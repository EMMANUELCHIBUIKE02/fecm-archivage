import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // Statistiques globales
    const totalArchives = await prisma.archive.count({
      where: { userId: session.user.id }
    })

    // Répartition par catégorie
    const byCategory = await prisma.archive.groupBy({
      by: ['category'],
      where: { userId: session.user.id },
      _count: true,
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    })

    // Répartition par service
    const byDepartment = await prisma.archive.groupBy({
      by: ['department'],
      where: { userId: session.user.id },
      _count: true,
      orderBy: {
        _count: {
          department: 'desc'
        }
      }
    })

    // Répartition par type de document
    const byDocumentType = await prisma.archive.groupBy({
      by: ['documentType'],
      where: { userId: session.user.id },
      _count: true,
      orderBy: {
        _count: {
          documentType: 'desc'
        }
      }
    })

    // Répartition par statut
    const byStatus = await prisma.archive.groupBy({
      by: ['status'],
      where: { userId: session.user.id },
      _count: true
    })

    // Répartition par confidentialité
    const byConfidentiality = await prisma.archive.groupBy({
      by: ['confidentiality'],
      where: { userId: session.user.id },
      _count: true
    })

    // Évolution temporelle (archives créées par mois - 12 derniers mois)
    const now = new Date()
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

    const archivesByMonth = await prisma.archive.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: twelveMonthsAgo
        }
      },
      select: {
        createdAt: true
      }
    })

    // Grouper par mois
    const monthlyData: { [key: string]: number } = {}
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })
      monthlyData[monthKey] = 0
    }

    archivesByMonth.forEach(archive => {
      const monthKey = new Date(archive.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })
      if (monthlyData[monthKey] !== undefined) {
        monthlyData[monthKey]++
      }
    })

    const evolutionData = Object.entries(monthlyData)
      .reverse()
      .map(([month, count]) => ({ month, count }))

    // Taille totale des fichiers
    const filesStats = await prisma.driveFile.aggregate({
      where: {
        archive: {
          userId: session.user.id
        }
      },
      _sum: {
        fileSize: true
      },
      _count: true
    })

    return NextResponse.json({
      success: true,
      statistics: {
        totalArchives,
        totalFiles: filesStats._count,
        totalSize: Number(filesStats._sum.fileSize ?? 0),
        byCategory: byCategory.map(item => ({
          name: item.category,
          value: item._count
        })),
        byDepartment: byDepartment.map(item => ({
          name: item.department,
          value: item._count
        })),
        byDocumentType: byDocumentType.map(item => ({
          name: item.documentType,
          value: item._count
        })),
        byStatus: byStatus.map(item => ({
          name: item.status,
          value: item._count
        })),
        byConfidentiality: byConfidentiality.map(item => ({
          name: item.confidentiality,
          value: item._count
        })),
        evolution: evolutionData
      }
    })

  } catch (error) {
    console.error("Erreur statistiques:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    )
  }
}