"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertTriangle, X } from "lucide-react"

interface DeleteArchiveModalProps {
  archiveId: string
  archiveNumber: string
  archiveTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function DeleteArchiveModal({
  archiveId,
  archiveNumber,
  archiveTitle,
  isOpen,
  onClose
}: DeleteArchiveModalProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/archives/${archiveId}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      // Fermer le modal
      onClose()

      // Rediriger vers la liste des archives et forcer le rafraîchissement
      router.push("/dashboard/archives")
      router.refresh()
      
      // Rafraîchir aussi la page du dashboard
      setTimeout(() => {
        router.refresh()
      }, 100)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Supprimer l&apos;archive
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-gray-700 mb-4">
            Êtes-vous sûr de vouloir supprimer définitivement cette archive ?
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {archiveNumber}
            </p>
            <p className="text-sm text-gray-600">{archiveTitle}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>⚠️ Attention :</strong> Cette action est irréversible. 
              L&apos;archive ET le fichier dans Google Drive seront supprimés définitivement.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition"
            disabled={isDeleting}
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isDeleting ? "Suppression..." : "Supprimer définitivement"}
          </button>
        </div>
      </div>
    </div>
  )
}