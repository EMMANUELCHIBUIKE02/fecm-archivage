"use client"

import { useEffect, useState } from "react"
import { BarChart3, Loader2, HardDrive, FileText, Download } from "lucide-react"
import {
  PieChartComponent,
  BarChartComponent,
  LineChartComponent
} from "@/components/dashboard/StatisticsCharts"

interface Statistics {
  totalArchives: number
  totalFiles: number
  totalSize: bigint
  byCategory: { name: string; value: number }[]
  byDepartment: { name: string; value: number }[]
  byDocumentType: { name: string; value: number }[]
  byStatus: { name: string; value: number }[]
  byConfidentiality: { name: string; value: number }[]
  evolution: { month: string; count: number }[]
}

export default function StatistiquesPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics')
        const data = await response.json()
        
        if (data.success) {
          setStatistics(data.statistics)
        }
      } catch (error) {
        console.error("Erreur chargement statistiques:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erreur lors du chargement des statistiques</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        </div>
        <p className="text-gray-600">
          Vue d&apos;ensemble de vos archives et documents
        </p>
      </div>

      {/* Cartes de statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total des archives</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistics.totalArchives}</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Fichiers stockés</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistics.totalFiles}</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Espace utilisé</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatFileSize(Number(statistics.totalSize))}
          </p>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <LineChartComponent
        data={statistics.evolution}
        title="Évolution des archives (12 derniers mois)"
      />

      {/* Graphiques en grille */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={statistics.byCategory}
          title="Répartition par catégorie"
        />
        <PieChartComponent
          data={statistics.byDepartment}
          title="Répartition par service"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={statistics.byDocumentType}
          title="Répartition par type de document"
        />
        <BarChartComponent
          data={statistics.byStatus}
          title="Répartition par statut"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={statistics.byConfidentiality}
          title="Répartition par confidentialité"
        />
      </div>
    </div>
  )
}