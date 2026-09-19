"use client"

import { useState } from "react"
import { Search as SearchIcon } from "lucide-react"
import SearchForm, { SearchFilters } from "@/components/search/SearchForm"
import SearchResults from "@/components/search/SearchResults"

export default function RecherchePage() {
  const [archives, setArchives] = useState<
    React.ComponentProps<typeof SearchResults>["archives"]
    >([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    setHasSearched(true)

    try {
      // Construire l'URL avec les paramètres
      const params = new URLSearchParams()
      
      if (filters.q) params.append('q', filters.q)
      if (filters.category !== 'all') params.append('category', filters.category)
      if (filters.category === 'Autre' && filters.customCategory.trim()) {
        params.append('categoryValue', filters.customCategory.trim())
      }
      if (filters.department !== 'all') params.append('department', filters.department)
      if (filters.department === 'Autre' && filters.customDepartment.trim()) {
        params.append('departmentValue', filters.customDepartment.trim())
      }
      if (filters.documentType !== 'all') params.append('documentType', filters.documentType)
      if (filters.documentType === 'Autre' && filters.customDocumentType.trim()) {
        params.append('documentTypeValue', filters.customDocumentType.trim())
      }
      if (filters.confidentiality !== 'all') params.append('confidentiality', filters.confidentiality)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setArchives(data.archives)
      }
    } catch (error) {
      console.error("Erreur recherche:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <SearchIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Recherche avancée</h1>
        </div>
        <p className="text-gray-600">
          Trouvez rapidement vos archives grâce aux filtres avancés
        </p>
      </div>

      {/* Formulaire de recherche */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* Résultats */}
      {hasSearched && (
        <SearchResults archives={archives} isLoading={isLoading} />
      )}

      {/* Message initial */}
      {!hasSearched && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
          <div className="text-center">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Commencez votre recherche
            </h3>
            <p className="text-gray-600">
              Utilisez la barre de recherche et les filtres pour trouver vos archives
            </p>
          </div>
        </div>
      )}
    </div>
  )
}