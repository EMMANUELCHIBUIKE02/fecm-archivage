import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  Edit,
  Calendar,
  User,
  Building2,
  FolderOpen,
  FileText,
  Shield,
  Clock,
  Hash,
  HardDrive
} from "lucide-react"
import DeleteButton from "@/components/archives/DeleteButton"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ArchiveDetailPage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { id } = await params

  // Récupérer l'archive avec tous ses détails
  const archive = await prisma.archive.findFirst({
    where: {
      id,
      userId: session.user.id
    },
    include: {
      driveFile: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!archive) {
    notFound()
  }

  // Récupérer l'historique des actions
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      archiveId: id
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10,
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/archives"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{archive.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Numéro d&apos;archive : {archive.archiveNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {archive.driveFile && (
            <a
              href={`/api/drive/download?fileId=${archive.driveFile.googleFileId}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </a>
          )}
          {session.user.role !== 'CONSULTATION' && (
            <>
              <Link
                href={`/dashboard/archives/${id}/modifier`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Link>
              <DeleteButton
                archiveId={archive.id}
                archiveNumber={archive.archiveNumber}
                archiveTitle={archive.title}
              />
            </>
          )}
        </div>
      </div>

      {/* Statut */}
      <div>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
          archive.status === 'ACTIF'
            ? 'bg-green-100 text-green-800'
            : archive.status === 'ARCHIVE'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {archive.status}
        </span>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Informations générales
          </h2>
          <div className="space-y-4">
            <InfoRow icon={FileText} label="Type de document" value={archive.documentType} />
            <InfoRow icon={FolderOpen} label="Catégorie" value={archive.category} />
            <InfoRow icon={Building2} label="Service" value={archive.department} />
            <InfoRow icon={User} label="Auteur" value={archive.author || 'Non renseigné'} />
            <InfoRow icon={Shield} label="Confidentialité" value={archive.confidentiality} />
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Dates</h2>
          <div className="space-y-4">
            <InfoRow
              icon={Calendar}
              label="Date de création"
              value={new Date(archive.createdAt).toLocaleDateString('fr-FR')}
            />
            <InfoRow
              icon={Calendar}
              label="Date du document"
              value={archive.documentDate ? new Date(archive.documentDate).toLocaleDateString('fr-FR') : 'Non renseignée'}
            />
            <InfoRow
              icon={Clock}
              label="Début de conservation"
              value={new Date(archive.archivedAt).toLocaleDateString("fr-FR")}
            />
            <InfoRow
              icon={Clock}
              label="Fin de conservation"
              value={
                archive.expirationDate
                  ? new Date(archive.expirationDate).toLocaleDateString("fr-FR")
                  : "Non renseignée"
              }
            />
          </div>
        </div>
      </div>

      {/* Description et mots-clés */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {archive.description || 'Aucune description'}
        </p>
        
        {archive.keywords && archive.keywords.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">
              {archive.keywords.split(",").map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informations du fichier */}
      {archive.driveFile && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Fichier associé
          </h2>
          <div className="space-y-4">
            <InfoRow icon={FileText} label="Nom du fichier" value={archive.driveFile.fileName} />
            <InfoRow icon={HardDrive} label="Taille" value={formatFileSize(Number(archive.driveFile.fileSize))} />
            <InfoRow icon={Hash} label="SHA-256" value={archive.driveFile.sha256} mono />
            <InfoRow
              icon={Calendar}
              label="Uploadé le"
              value={new Date(archive.driveFile.createdAt).toLocaleDateString('fr-FR')}
            />
            {archive.driveFile.driveUrl && (
              <div className="pt-2">
                <a
                  href={archive.driveFile.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Voir dans Google Drive →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Historique des actions
        </h2>
        {auditLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune action enregistrée</p>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {log.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Par {log.user.name || log.user.email}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-sm text-gray-900 mt-1 ${mono ? 'font-mono text-xs break-all' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}