"use client"

import { useState } from "react"
import { Search, X, Filter } from "lucide-react"
import { 
  CATEGORIES, 
  DEPARTMENTS, 
  DOCUMENT_TYPES, 
  CONFIDENTIALITY_LEVELS,
  ARCHIVE_STATUS
} from "@/lib/constants"

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
  isLoading?: boolean
}

export interface SearchFilters {
  q: string
  category: string
  customCategory: string
  department: string
  customDepartment: string
  documentType: string
  customDocumentType: string
  confidentiality: string
  status: string
  dateFrom: string
  dateTo: string
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    category: 'all',
    customCategory: '',
    department: 'all',
    customDepartment: '',
    documentType: 'all',
    customDocumentType: '',
    confidentiality: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      q: '',
      category: 'all',
      customCategory: '',
      department: 'all',
      customDepartment: '',
      documentType: 'all',
      customDocumentType: '',
      confidentiality: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'q') return value !== ''
    return value !== 'all' && value !== ''
  }).length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Rechercher par titre, description, référence..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-900"
          />
        </div>
        
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition ${
            showFilters 
              ? 'bg-blue-50 border-blue-300 text-blue-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filtres
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Recherche...' : 'Rechercher'}
        </button>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filtres avancés
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="text-gray-400">Toutes les catégories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="text-gray-900">
                    {cat === 'Autre' ? 'Autres' : cat}
                  </option>
                ))}
              </select>
              {filters.category === 'Autre' && (
                <input
                  type="text"
                  value={filters.customCategory}
                  onChange={(e) => setFilters({ ...filters, customCategory: e.target.value })}
                  required
                  placeholder="Saisissez votre catégorie"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="text-gray-400">Tous les services</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="text-gray-900">
                    {dept === 'Autre' ? 'Autres' : dept}
                  </option>
                ))}
              </select>
              {filters.department === 'Autre' && (
                <input
                  type="text"
                  value={filters.customDepartment}
                  onChange={(e) => setFilters({ ...filters, customDepartment: e.target.value })}
                  required
                  placeholder="Saisissez votre service"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Type de document */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de document
              </label>
              <select
                value={filters.documentType}
                onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="text-gray-400">Tous les types</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type} className="text-gray-900">
                    {type === 'Autre' ? 'Autres' : type}
                  </option>
                ))}
              </select>
              {filters.documentType === 'Autre' && (
                <input
                  type="text"
                  value={filters.customDocumentType}
                  onChange={(e) => setFilters({ ...filters, customDocumentType: e.target.value })}
                  required
                  placeholder="Saisissez votre type de document"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Confidentialité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidentialité
              </label>
              <select
                value={filters.confidentiality}
                onChange={(e) => setFilters({ ...filters, confidentiality: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="text-gray-400">Tous les niveaux</option>
                {CONFIDENTIALITY_LEVELS.map((level) => (
                  <option key={level} value={level} className="text-gray-900">
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all" className="text-gray-400">Tous les statuts</option>
                {ARCHIVE_STATUS.map((s) => (
                  <option key={s} value={s} className="text-gray-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtres par date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  filters.dateFrom ? 'text-gray-900' : 'text-gray-400'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  filters.dateTo ? 'text-gray-900' : 'text-gray-400'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}