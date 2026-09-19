"use client"

import Link from "next/link"
import { FileText, Download, Eye, Calendar, FolderOpen } from "lucide-react"

interface Archive {
  id: string
  archiveNumber: string
  title: string
  category: string
  department: string
  documentType: string
  status: string
  confidentiality: string
  createdAt: Date
  description: string | null
  driveFile: {
    id: string
    fileName: string
    fileSize: bigint
  } | null
}

interface SearchResultsProps {
  archives: Archive[]
  isLoading?: boolean
}

export default function SearchResults({ archives, isLoading = false }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Recherche en cours...</p>
        </div>
      </div>
    )
  }

  if (archives.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Compteur de résultats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">{archives.length}</span> résultat{archives.length > 1 ? 's' : ''} trouvé{archives.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des résultats */}
      <div
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
        style={{ height: "32rem" }}
      >
        <div className="h-full overflow-y-scroll divide-y divide-gray-200">
          {archives.map((archive) => (
            <div
              key={archive.id}
              className="p-6 hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Titre et numéro */}
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/archives/${archive.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition"
                      >
                        {archive.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {archive.archiveNumber}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {archive.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {archive.description}
                    </p>
                  )}

                  {/* Métadonnées */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {archive.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {archive.department}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {archive.documentType}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      archive.status === 'ACTIF'
                        ? 'bg-green-100 text-green-800'
                        : archive.status === 'ARCHIVE'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {archive.status}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {archive.confidentiality}
                    </span>
                  </div>

                  {/* Date et fichier */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(archive.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    {archive.driveFile && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {archive.driveFile.fileName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    href={`/dashboard/archives/${archive.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </Link>
                  {archive.driveFile && (
                    <a
                      href={`/api/drive/download?fileId=${archive.driveFile.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}