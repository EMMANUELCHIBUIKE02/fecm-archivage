import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ArchiveForm from "@/components/archives/ArchiveForm"

export default async function AjouterPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role === 'CONSULTATION') {
    redirect('/dashboard/archives')
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ajouter une archive
        </h1>
        <p className="text-gray-600 mt-1">
          Remplissez les informations et téléchargez le document
        </p>
      </div>

      <ArchiveForm />
    </div>
  )
}