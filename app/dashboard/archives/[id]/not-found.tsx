import Link from "next/link"
import { FolderOpen } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <FolderOpen className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Archive introuvable
      </h2>
      <p className="text-gray-600 mb-6">
        L&apos;archive que vous recherchez n&apos;existe pas ou a été supprimée.
      </p>
      <Link
        href="/dashboard/archives"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Retour aux archives
      </Link>
    </div>
  )
}