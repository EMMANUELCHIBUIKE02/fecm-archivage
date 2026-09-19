import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { ArchiveStatus, Prisma } from "@prisma/client"
import { CATEGORIES, DEPARTMENTS, DOCUMENT_TYPES } from "@/lib/constants"

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
    
    // Récupérer les paramètres de recherche
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const categoryValue = searchParams.get('categoryValue')
    const department = searchParams.get('department')
    const departmentValue = searchParams.get('departmentValue')
    const documentType = searchParams.get('documentType')
    const documentTypeValue = searchParams.get('documentTypeValue')
    const confidentiality = searchParams.get('confidentiality')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Construire les conditions de recherche
    const where: Prisma.ArchiveWhereInput & {
    AND: Prisma.ArchiveWhereInput[]
    } = {
    userId: session.user.id,
    AND: [],
    }

    // Recherche textuelle dans les informations principales et les classifications
    if (query) {
      where.AND.push({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { reference: { contains: query, mode: 'insensitive' } },
          { archiveNumber: { contains: query, mode: 'insensitive' } },
          { documentType: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { department: { contains: query, mode: 'insensitive' } }
        ]
      })
    }

    // Filtres spécifiques
    if (category && category !== 'all') {
      where.AND.push(category === 'Autre' && categoryValue
        ? { category: { equals: categoryValue, mode: 'insensitive' } }
        : category === 'Autre'
        ? { NOT: { category: { in: CATEGORIES.filter((value) => value !== 'Autre') } } }
        : { category })
    }

    if (department && department !== 'all') {
      where.AND.push(department === 'Autre' && departmentValue
        ? { department: { equals: departmentValue, mode: 'insensitive' } }
        : department === 'Autre'
        ? { NOT: { department: { in: DEPARTMENTS.filter((value) => value !== 'Autre') } } }
        : { department })
    }

    if (documentType && documentType !== 'all') {
      where.AND.push(documentType === 'Autre' && documentTypeValue
        ? { documentType: { equals: documentTypeValue, mode: 'insensitive' } }
        : documentType === 'Autre'
        ? { NOT: { documentType: { in: DOCUMENT_TYPES.filter((value) => value !== 'Autre') } } }
        : { documentType })
    }

    if (confidentiality && confidentiality !== 'all') {
      where.AND.push({ confidentiality })
    }

    if (Object.values(ArchiveStatus).includes(status as ArchiveStatus)) {
      where.AND.push({ status: status as ArchiveStatus })
    }

    // Filtre par dates
    if (dateFrom) {
      where.AND.push({
        createdAt: {
          gte: new Date(dateFrom)
        }
      })
    }

    if (dateTo) {
      where.AND.push({
        createdAt: {
          lte: new Date(dateTo)
        }
      })
    }

    // Rechercher les archives
    const archives = await prisma.archive.findMany({
      where,
      include: {
        driveFile: {
          select: {
            id: true,
            fileName: true,
            fileSize: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const serializedArchives = archives.map((archive) => ({
        ...archive,
        driveFile: archive.driveFile
            ? {
                ...archive.driveFile,
                fileSize: Number(archive.driveFile.fileSize),
            }
            : null,
    }))

    return NextResponse.json({
      success: true,
      count: serializedArchives.length,
      archives: serializedArchives,
    })

  } catch (error) {
    console.error("Erreur recherche:", error)
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    )
  }
}