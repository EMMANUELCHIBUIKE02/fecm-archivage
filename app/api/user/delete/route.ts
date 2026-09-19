import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Récupérer toutes les archives et leurs fichiers
    const archives = await prisma.archive.findMany({
      where: { userId },
      include: {
        driveFile: true
      }
    })

    // Récupérer le token Google pour supprimer les fichiers
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: "google"
      }
    })

    // Supprimer tous les fichiers de Google Drive
    if (account?.access_token) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      )

      oauth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token
      })

      const drive = google.drive({ version: 'v3', auth: oauth2Client })

      // Supprimer chaque fichier
      for (const archive of archives) {
        if (archive.driveFile?.googleFileId) {
          try {
            await drive.files.delete({
              fileId: archive.driveFile.googleFileId
            })
          } catch (error) {
            console.error(`Erreur suppression fichier ${archive.driveFile.googleFileId}:`, error)
          }
        }
      }
    }

    // Supprimer toutes les données de la base (cascade automatique via Prisma)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: "Compte supprimé avec succès"
    })

  } catch (error) {
    console.error("Erreur suppression compte:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    )
  }
}