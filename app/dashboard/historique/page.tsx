import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { History, FileText, Edit, Trash2, Download, Plus } from "lucide-react"
import Link from "next/link"

export default async function HistoriquePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer tous les logs d'audit de l'utilisateur
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      archive: {
        select: {
          id: true,
          archiveNumber: true,
          title: true
        }
      }
    }
  })

  // Grouper par date
  const logsByDate: { [key: string]: typeof auditLogs } = {}
  auditLogs.forEach(log => {
    const dateKey = new Date(log.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!logsByDate[dateKey]) {
      logsByDate[dateKey] = []
    }
    logsByDate[dateKey].push(log)
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'CREATION_ARCHIVE':
        return <Plus className="w-5 h-5 text-green-600" />
      case 'UPDATE':
      case 'MODIFICATION_ARCHIVE':
        return <Edit className="w-5 h-5 text-blue-600" />
      case 'DELETE':
      case 'SUPPRESSION_ARCHIVE':
        return <Trash2 className="w-5 h-5 text-red-600" />
      case 'DOWNLOAD':
      case 'TELECHARGEMENT_FICHIER':
        return <Download className="w-5 h-5 text-purple-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'CREATION_ARCHIVE':
        return 'bg-green-50 border-green-200'
      case 'UPDATE':
      case 'MODIFICATION_ARCHIVE':
        return 'bg-blue-50 border-blue-200'
      case 'DELETE':
      case 'SUPPRESSION_ARCHIVE':
        return 'bg-red-50 border-red-200'
      case 'DOWNLOAD':
      case 'TELECHARGEMENT_FICHIER':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'CREATION_ARCHIVE':
        return 'Création'
      case 'UPDATE':
      case 'MODIFICATION_ARCHIVE':
        return 'Modification'
      case 'DELETE':
      case 'SUPPRESSION_ARCHIVE':
        return 'Suppression'
      case 'DOWNLOAD':
      case 'TELECHARGEMENT_FICHIER':
        return 'Téléchargement'
      default:
        return action
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <History className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Historique</h1>
        </div>
        <p className="text-gray-600">
          Toutes vos actions sur les archives
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total d&apos;actions</p>
              <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Créations</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditLogs.filter(log => log.action === 'CREATION_ARCHIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Modifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditLogs.filter(log => log.action === 'MODIFICATION_ARCHIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléchargements</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditLogs.filter(log => log.action === 'TELECHARGEMENT_FICHIER').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline des actions */}
      <div className="h-128 overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        {auditLogs.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun historique
            </h3>
            <p className="text-gray-600">
              Vos actions sur les archives apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto divide-y divide-gray-200">
            {Object.entries(logsByDate).map(([date, logs]) => (
              <div key={date} className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gray-200" />
                  <h3 className="text-sm font-semibold text-gray-900 px-3 py-1 bg-gray-100 rounded-full">
                    {date}
                  </h3>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Actions du jour */}
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg ${getActionColor(log.action)}`}
                    >
                      {/* Icône */}
                      <div className="shrink-0 mt-0.5">
                        {getActionIcon(log.action)}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 text-xs font-semibold text-gray-900 rounded-full bg-white">
                                {getActionLabel(log.action)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {log.description}
                            </p>
                            {log.archive && (
                              <Link
                                href={`/dashboard/archives/${log.archive.id}`}
                                className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
                              >
                                {log.archive.archiveNumber} - {log.archive.title}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}