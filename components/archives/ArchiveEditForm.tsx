"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  DOCUMENT_TYPES, 
  CATEGORIES, 
  DEPARTMENTS, 
  CONFIDENTIALITY_LEVELS,
  ARCHIVE_STATUS
} from "@/lib/constants"
import { Loader2 } from "lucide-react"

interface Archive {
  id: string
  title: string
  reference: string | null
  documentType: string
  category: string
  department: string
  author: string | null
  documentDate: Date | null
  archivedAt: Date
  expirationDate: Date | null
  confidentiality: string
  keywords: string | null
  description: string | null
  physicalLocation: string | null
  status: string
}

interface ArchiveEditFormProps {
  archive: Archive
}

export default function ArchiveEditForm({ archive }: ArchiveEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // États pour les champs du formulaire
  const [title, setTitle] = useState(archive.title)
  const [reference, setReference] = useState(archive.reference || "")
  const [documentType, setDocumentType] = useState(archive.documentType)
  const [category, setCategory] = useState(archive.category)
  const [department, setDepartment] = useState(archive.department)
  const [author, setAuthor] = useState(archive.author || "")
  const [documentDate, setDocumentDate] = useState(
    archive.documentDate ? new Date(archive.documentDate).toISOString().split('T')[0] : ""
  )
  const [archivedAt, setArchivedAt] = useState(
    new Date(archive.archivedAt).toISOString().split('T')[0]
  )
  const [expirationDate, setExpirationDate] = useState(
    archive.expirationDate ? new Date(archive.expirationDate).toISOString().split('T')[0] : ""
  )
  const [confidentiality, setConfidentiality] = useState(archive.confidentiality)
  const [keywords, setKeywords] = useState(archive.keywords ?? "")
  const [description, setDescription] = useState(archive.description || "")
  const [physicalLocation, setPhysicalLocation] = useState(archive.physicalLocation || "")
  const [status, setStatus] = useState(archive.status)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
        
      const response = await fetch(`/api/archives/${archive.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          reference: reference || null,
          documentType,
          category,
          department,
          author: author || null,
          documentDate: documentDate ? new Date(documentDate) : null,
          archivedAt: new Date(archivedAt),
          expirationDate: expirationDate ? new Date(expirationDate) : null,
          confidentiality,
          keywords: keywords || null,
          description: description || null,
          physicalLocation: physicalLocation || null,
          status
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la modification")
      }

      // Rediriger vers la page de détail
      router.push(`/dashboard/archives/${archive.id}`)
      router.refresh()

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Informations de base */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Informations de base
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Référence
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="REF-2025-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de document <span className="text-red-500">*</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                documentType ? 'text-gray-900' : 'text-gray-400'
              }`}
              required
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                category ? 'text-gray-900' : 'text-gray-400'
              }`}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                department ? 'text-gray-900' : 'text-gray-400'
              }`}
              required
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auteur
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nom de l&apos;auteur"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du document
            </label>
            <input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                documentDate ? 'text-gray-900' : 'text-gray-400'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d&apos;archivage <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={archivedAt}
              onChange={(e) => setArchivedAt(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                archivedAt ? 'text-gray-900' : 'text-gray-400'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d&apos;expiration
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                expirationDate ? 'text-gray-900' : 'text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Sécurité et classification */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Sécurité et classification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de confidentialité <span className="text-red-500">*</span>
            </label>
            <select
              value={confidentiality}
              onChange={(e) => setConfidentiality(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                confidentiality ? 'text-gray-900' : 'text-gray-400'
              }`}
              required
            >
              {CONFIDENTIALITY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                status ? 'text-gray-900' : 'text-gray-400'
              }`}
              required
            >
              {ARCHIVE_STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mots-clés
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="contrat, finance, 2025 (séparés par des virgules)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Description et localisation */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Détails supplémentaires
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Description détaillée du document..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation physique
            </label>
            <input
              type="text"
              value={physicalLocation}
              onChange={(e) => setPhysicalLocation(e.target.value)}
              placeholder="Exemple: Armoire A, Étagère 3, Boîte 12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Modification..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  )
}