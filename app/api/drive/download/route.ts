import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json(
        { error: "ID du fichier manquant" },
        { status: 400 }
      )
    }

    // Vérifier que le fichier appartient à l'utilisateur
    const driveFile = await prisma.driveFile.findFirst({
      where: {
        googleFileId: fileId,
        archive: {
          userId: session.user.id
        }
      },
      include: {
        archive: true
      }
    })

    if (!driveFile) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      )
    }

    // Récupérer les tokens OAuth
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "google"
      }
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: "Token d'accès manquant" },
        { status: 401 }
      )
    }

    // Configurer Google Drive API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token
    })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Télécharger le fichier
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media'
      },
      { responseType: 'arraybuffer' }
    )

    // Enregistrer dans l'audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        archiveId: driveFile.archiveId,
        action: "TELECHARGEMENT_FICHIER",
        description: `Téléchargement du fichier ${driveFile.fileName}`
      }
    })

    // Retourner le fichier
    return new NextResponse(response.data as ArrayBuffer, {
      headers: {
        'Content-Type': driveFile.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${driveFile.fileName}"`
      }
    })

  } catch (error) {
    console.error("Erreur téléchargement:", error)
    return NextResponse.json(
      { error: "Erreur lors du téléchargement" },
      { status: 500 }
    )
  }
}