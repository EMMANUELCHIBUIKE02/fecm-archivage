"use client"

import { useState } from "react"
import { Filter } from "lucide-react"

interface HistoryFiltersProps {
  onFilterChange: (action: string | null) => void
}

export default function HistoryFilters({ onFilterChange }: HistoryFiltersProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const actions = [
    { value: null, label: 'Toutes les actions', color: 'gray' },
    { value: 'CREATE', label: 'Créations', color: 'green' },
    { value: 'UPDATE', label: 'Modifications', color: 'blue' },
    { value: 'DELETE', label: 'Suppressions', color: 'red' },
    { value: 'DOWNLOAD', label: 'Téléchargements', color: 'purple' }
  ]

  const handleFilterClick = (value: string | null) => {
    setSelectedAction(value)
    onFilterChange(value)
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Filtrer par type</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleFilterClick(action.value)}
            className={`px-3 py-1.5 text-sm text-gray-900font-medium rounded-lg transition ${
              selectedAction === action.value
                ? `bg-${action.color}-100 text-${action.color}-700 border-${action.color}-300`
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            } border`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}