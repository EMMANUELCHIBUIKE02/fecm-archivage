import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    if (session.user.role === "CONSULTATION") {
      return NextResponse.json(
        { error: "Vous n'avez pas le droit de supprimer un fichier" },
        { status: 403 }
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

    // Supprimer le fichier de Google Drive
    await drive.files.delete({
      fileId: fileId
    })

    return NextResponse.json({
      success: true,
      message: "Fichier supprimé de Google Drive"
    })

  } catch (error) {
    console.error("Erreur suppression Google Drive:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du fichier" },
      { status: 500 }
    )
  }
}