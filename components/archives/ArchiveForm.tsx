'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { DOCUMENT_TYPES, CATEGORIES, DEPARTMENTS, CONFIDENTIALITY_LEVELS } from '@/lib/constants'

export default function ArchiveForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  
  // États pour gérer la couleur des selects et dates
  const [documentType, setDocumentType] = useState('')
  const [category, setCategory] = useState('')
  const [department, setDepartment] = useState('')
  const [documentDate, setDocumentDate] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [confidentiality, setConfidentiality] = useState('')
  const [customDocumentType, setCustomDocumentType] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [customDepartment, setCustomDepartment] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      if (file) {
        formData.append('file', file)
      }

      if (documentType === 'Autre') {
        formData.set('documentType', customDocumentType.trim())
      }
      if (category === 'Autre') {
        formData.set('category', customCategory.trim())
      }
      if (department === 'Autre') {
        formData.set('department', customDepartment.trim())
      }

      const response = await fetch('/api/drive/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création')
      }

      // Rediriger vers le dashboard
      router.push('/dashboard')
      router.refresh()

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Titre */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du document *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Ex: Contrat Client 2026"
        />
      </div>

      {/* Référence */}
      <div>
        <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
          Référence
        </label>
        <input
          type="text"
          id="reference"
          name="reference"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Ex: REF-ADM-025"
        />
      </div>

      {/* Type de document */}
      <div>
        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
          Type de document *
        </label>
        <select
          id="documentType"
          name="documentType"
          required
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            documentType ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <option value="">Sélectionner un type</option>
          {DOCUMENT_TYPES.map((type) => (
            <option key={type} value={type} className="text-gray-900">
              {type === 'Autre' ? 'Autres' : type}
            </option>
          ))}
        </select>
        {documentType === 'Autre' && (
          <input
            type="text"
            value={customDocumentType}
            onChange={(e) => setCustomDocumentType(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Précisez le type de document"
          />
        )}
      </div>

      {/* Catégorie */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie *
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            category ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <option value="">Sélectionner une catégorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="text-gray-900">
              {cat === 'Autre' ? 'Autres' : cat}
            </option>
          ))}
        </select>
        {category === 'Autre' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Précisez la catégorie"
          />
        )}
      </div>

      {/* Service */}
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
          Service *
        </label>
        <select
          id="department"
          name="department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            department ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <option value="">Sélectionner un service</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept} className="text-gray-900">
              {dept === 'Autre' ? 'Autres' : dept}
            </option>
          ))}
        </select>
        {department === 'Autre' && (
          <input
            type="text"
            value={customDepartment}
            onChange={(e) => setCustomDepartment(e.target.value)}
            required
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Précisez le service"
          />
        )}
      </div>

      {/* Auteur */}
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Auteur / Responsable
        </label>
        <input
          type="text"
          id="author"
          name="author"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Ex: Jean Dupont"
        />
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="documentDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date du document
          </label>
          <input
            type="date"
            id="documentDate"
            name="documentDate"
            value={documentDate}
            onChange={(e) => setDocumentDate(e.target.value)}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              documentDate ? 'text-gray-900' : 'text-gray-400'
            }`}
            
          />
        </div>

        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date d&apos;expiration
          </label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              expirationDate ? 'text-gray-900' : 'text-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Confidentialité */}
      <div>
        <label htmlFor="confidentiality" className="block text-sm font-medium text-gray-700 mb-1">
          Niveau de confidentialité *
        </label>
        <select
          id="confidentiality"
          name="confidentiality"
          required
          value={confidentiality}
          onChange={(e) => setConfidentiality(e.target.value)}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            confidentiality ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <option value="">Sélectionner le niveau</option>
          {CONFIDENTIALITY_LEVELS.map((level) => (
            <option key={level} value={level} className="text-gray-900">{level}</option>
          ))}
        </select>
      </div>

      {/* Mots-clés */}
      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
          Mots-clés
        </label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Ex: contrat, client, commercial"
        />
        <p className="text-xs text-gray-500 mt-1">
          Séparez les mots-clés par des virgules
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Description détaillée du document..."
        />
      </div>

      {/* Emplacement physique */}
      <div>
        <label htmlFor="physicalLocation" className="block text-sm font-medium text-gray-700 mb-1">
          Emplacement physique
        </label>
        <input
          type="text"
          id="physicalLocation"
          name="physicalLocation"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="Ex: Armoire A, Étagère 2, Dossier 15"
        />
      </div>

      {/* Upload fichier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier numérique *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="hidden"
          />
          <label
            htmlFor="file"
            className="cursor-pointer flex flex-col items-center"
          >
            {file ? (
              <>
                <FileText className="w-12 h-12 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Cliquez pour sélectionner un fichier
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, Word, Excel, Images... (max 100 MB)
                </p>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Archivage en cours...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Archiver le document</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}