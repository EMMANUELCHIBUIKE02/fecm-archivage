import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { archiveSchema } from "@/lib/validations"

interface RouteContext {
  params: Promise<{ id: string }>
}

// PUT - Mettre à jour une archive
export async function PUT(
  request: Request,
  context: RouteContext
) {
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
        { error: "Vous n'avez pas le droit de modifier une archive" },
        { status: 403 }
      )
    }

    const { id } = await context.params
    const body = await request.json()

    // Valider les données
    const validatedData = archiveSchema.parse(body)

    // Vérifier que l'archive appartient à l'utilisateur
    const existingArchive = await prisma.archive.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingArchive) {
      return NextResponse.json(
        { error: "Archive non trouvée" },
        { status: 404 }
      )
    }

    // Mettre à jour l'archive
    const updatedArchive = await prisma.archive.update({
      where: { id },
      data: {
        title: validatedData.title,
        reference: validatedData.reference,
        documentType: validatedData.documentType,
        category: validatedData.category,
        department: validatedData.department,
        author: validatedData.author,
        documentDate: validatedData.documentDate,
        archivedAt: validatedData.archivedAt,
        expirationDate: validatedData.expirationDate,
        confidentiality: validatedData.confidentiality,
        keywords: validatedData.keywords,
        description: validatedData.description,
        physicalLocation: validatedData.physicalLocation,
        status: validatedData.status,
        updatedAt: new Date()
      }
    })

    // Enregistrer dans l'audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        archiveId: id,
        action: "MODIFICATION_ARCHIVE",
        description: `Modification de l'archive ${updatedArchive.archiveNumber}`
      }
    })

    return NextResponse.json({
      success: true,
      archive: updatedArchive
    })

  } catch (error) {
    console.error("Erreur modification archive:", error)
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une archive définitivement
export async function DELETE(
  request: Request,
  context: RouteContext
) {
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
        { error: "Vous n'avez pas le droit de supprimer une archive" },
        { status: 403 }
      )
    }

    const { id } = await context.params

    // Vérifier que l'archive appartient à l'utilisateur
    const existingArchive = await prisma.archive.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        driveFile: true
      }
    })

    if (!existingArchive) {
      return NextResponse.json(
        { error: "Archive non trouvée" },
        { status: 404 }
      )
    }

    // Supprimer le fichier de Google Drive si présent
    if (existingArchive.driveFile) {
      try {
        const deleteResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/drive/delete?fileId=${existingArchive.driveFile.googleFileId}`,
          {
            method: 'DELETE',
            headers: {
              'Cookie': request.headers.get('Cookie') || ''
            }
          }
        )

        if (!deleteResponse.ok) {
          console.error("Erreur lors de la suppression du fichier Google Drive")
        }
      } catch (error) {
        console.error("Erreur suppression fichier Drive:", error)
        // Continue quand même la suppression de l'archive
      }
    }

    // Enregistrer dans l'audit log avant suppression
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        archiveId: id,
        action: "SUPPRESSION_ARCHIVE",
        description: `Suppression définitive de l'archive ${existingArchive.archiveNumber}`
      }
    })

    // Supprimer le fichier de la base de données
    if (existingArchive.driveFile) {
      await prisma.driveFile.delete({
        where: { id: existingArchive.driveFile.id }
      })
    }

    // Supprimer l'archive de la base de données
    await prisma.archive.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Archive et fichier supprimés définitivement"
    })

  } catch (error) {
    console.error("Erreur suppression archive:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    )
  }
}