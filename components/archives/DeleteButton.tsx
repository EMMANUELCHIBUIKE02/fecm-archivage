"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import DeleteArchiveModal from "./DeleteArchiveModal"

interface DeleteButtonProps {
  archiveId: string
  archiveNumber: string
  archiveTitle: string
}

export default function DeleteButton({
  archiveId,
  archiveNumber,
  archiveTitle
}: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
      >
        <Trash2 className="w-4 h-4" />
        Supprimer
      </button>

      <DeleteArchiveModal
        archiveId={archiveId}
        archiveNumber={archiveNumber}
        archiveTitle={archiveTitle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}