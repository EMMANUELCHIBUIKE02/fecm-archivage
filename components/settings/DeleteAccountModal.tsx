"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Loader2, AlertTriangle, X } from "lucide-react"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userEmail
}: DeleteAccountModalProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [confirmText, setConfirmText] = useState("")

  const handleDelete = async () => {
    if (confirmText !== "SUPPRIMER") {
      setError("Veuillez taper SUPPRIMER pour confirmer")
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      // Déconnecter l'utilisateur
      await signOut({ redirect: false })
      
      // Rediriger vers la page d'accueil
      router.push('/')

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[calc(100vh-2rem)] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900">
              Supprimer mon compte
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-100 rounded-lg transition"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-red-700" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-4 overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <p className="text-gray-700 font-medium">
              ⚠️ Cette action est irréversible !
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
              <p className="text-sm text-red-800 font-semibold">
                Les données suivantes seront définitivement supprimées :
              </p>
              <ul className="text-sm text-red-700 space-y-1 ml-4 list-disc">
                <li>Toutes vos archives</li>
                <li>Tous vos fichiers dans Google Drive</li>
                <li>Votre historique d&apos;actions</li>
                <li>Vos paramètres et préférences</li>
                <li>Votre compte utilisateur</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-1">
                Compte à supprimer :
              </p>
              <p className="text-sm font-semibold text-gray-900">{userEmail}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pour confirmer, tapez <span className="font-bold text-red-600">SUPPRIMER</span>
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
                disabled={isDeleting}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition"
            disabled={isDeleting}
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== "SUPPRIMER"}
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