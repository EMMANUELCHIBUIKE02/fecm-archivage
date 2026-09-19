import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FolderOpen, FileText, AlertCircle, Lock } from "lucide-react"
import type { Archive, DriveFile } from "@prisma/client"

type ArchiveWithFile = Archive & { driveFile: DriveFile | null }

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Récupérer les statistiques
  const stats = await prisma.archive.groupBy({
    by: ['status'],
    where: {
      userId: session.user.id
    },
    _count: true
  })

  const totalArchives = stats.reduce((acc: number, curr) => acc + curr._count, 0)
  const activeArchives = stats.find((s) => s.status === 'ACTIF')?._count || 0

  // Archives récentes
  const recentArchives: ArchiveWithFile[] = await prisma.archive.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    include: {
      driveFile: true
    }
  })

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total archives"
          value={totalArchives}
          icon={FolderOpen}
          color="blue"
        />
        <StatCard
          title="Archives actives"
          value={activeArchives}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="À expirer"
          value={0}
          icon={AlertCircle}
          color="orange"
        />
        <StatCard
          title="Confidentielles"
          value={0}
          icon={Lock}
          color="red"
        />
      </div>

      {/* Archives récentes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Archives récentes</h3>

        <div className="overflow-y-auto" style={{ height: "20rem" }}>
          {recentArchives.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune archive pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">
                Commencez par ajouter votre première archive
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentArchives.map((archive: ArchiveWithFile) => (
                <div
                  key={archive.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{archive.title}</p>
                      <p className="text-sm text-gray-500">
                        {archive.category} • {archive.department}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(archive.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'orange' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}