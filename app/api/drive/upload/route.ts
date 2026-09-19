import { auth } from "@/lib/auth"
import { uploadFileToDrive } from "@/lib/google-drive"
import { calculateFileSHA256 } from "@/lib/hash"
import { prisma } from "@/lib/prisma"
import { generateArchiveNumber } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (session.user.role === 'CONSULTATION') {
      return NextResponse.json(
        { error: 'Vous n\'avez pas le droit de créer une archive' },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    
    // Récupérer les données du formulaire
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const reference = formData.get('reference') as string | null
    const documentType = formData.get('documentType') as string
    const category = formData.get('category') as string
    const department = formData.get('department') as string
    const author = formData.get('author') as string | null
    const documentDate = formData.get('documentDate') as string | null
    const expirationDate = formData.get('expirationDate') as string | null
    const confidentiality = formData.get('confidentiality') as string
    const keywords = formData.get('keywords') as string | null
    const description = formData.get('description') as string | null
    const physicalLocation = formData.get('physicalLocation') as string | null

    if (!file || !title || !documentType || !category || !department) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Générer le numéro d'archive
    const archiveNumber = generateArchiveNumber()

    // Calculer le hash du fichier
    const sha256 = await calculateFileSHA256(file)

    // Uploader vers Google Drive
    const year = new Date().getFullYear()
    const driveResult = await uploadFileToDrive(
      session.user.id,
      file,
      archiveNumber,
      category,
      year
    )

    // Créer l'archive dans la base de données
    const archive = await prisma.archive.create({
      data: {
        archiveNumber,
        title,
        reference,
        documentType,
        category,
        department,
        author,
        documentDate: documentDate ? new Date(documentDate) : null,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        confidentiality,
        keywords,
        description,
        physicalLocation,
        userId: session.user.id,
        driveFile: {
          create: {
            googleFileId: driveResult.fileId,
            googleFolderId: driveResult.folderId,
            driveUrl: driveResult.webViewLink,
            fileName: driveResult.fileName,
            mimeType: driveResult.mimeType,
            fileSize: driveResult.fileSize,
            sha256
          }
        }
      },
      include: {
        driveFile: true
      }
    })

    // Enregistrer dans l'historique
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        archiveId: archive.id,
        action: 'CREATION_ARCHIVE',
        description: `Archive créée : ${archive.title}`
      }
    })

      const serializedArchive = {
    ...archive,
    driveFile: archive.driveFile
      ? {
          ...archive.driveFile,
          fileSize: Number(archive.driveFile.fileSize),
        }
      : null,
    }

      return NextResponse.json({
        success: true,
        archive: serializedArchive,
      })

  } catch (error: unknown) {
    console.error('Erreur upload:', error)

    const message =
    error instanceof Error
      ? error.message
      : "Erreur lors de l'upload"

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )

  }
}