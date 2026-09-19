import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Download, Eye } from "lucide-react"

export default async function ArchivesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer toutes les archives de l'utilisateur
  const archives = await prisma.archive.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      driveFile: true
    }
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes archives</h1>
          <p className="mt-2 text-gray-600">
            Gérez toutes vos archives documentaires
          </p>
        </div>
        <Link
          href="/dashboard/ajouter"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Nouvelle archive
        </Link>
      </div>

      {/* Tableau des archives */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {archives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Aucune archive pour le moment</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Commencez par{" "}
                      <Link
                        href="/dashboard/ajouter"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        créer votre première archive
                      </Link>
                    </p>
                  </td>
                </tr>
              ) : (
                archives.map((archive) => (
                  <tr key={archive.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {archive.archiveNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {archive.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {archive.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {archive.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          archive.status === "ACTIF"
                            ? "bg-green-100 text-green-800"
                            : archive.status === "ARCHIVE"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {archive.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(archive.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/archives/${archive.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </Link>
                        {archive.driveFile && (
                          <a
                            href={`/api/drive/download?fileId=${archive.driveFile.googleFileId}`}
                            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Télécharger
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques en bas */}
      {archives.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{archives.length}</span>{" "}
            archive{archives.length > 1 ? "s" : ""} au total
          </p>
        </div>
      )}
    </div>
  )
}