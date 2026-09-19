import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ArchiveEditForm from "@/components/archives/ArchiveEditForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierArchivePage({ params }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  if (session.user.role === 'CONSULTATION') {
    redirect('/dashboard/archives')
  }

  const { id } = await params

  // Récupérer l'archive
  const archive = await prisma.archive.findFirst({
    where: {
      id,
      userId: session.user.id
    }
  })

  if (!archive) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/archives/${id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier l&apos;archive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {archive.archiveNumber} - {archive.title}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <ArchiveEditForm archive={archive} />
    </div>
  )
}