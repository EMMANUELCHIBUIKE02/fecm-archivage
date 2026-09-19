export interface Archive {
  id: string
  archiveNumber: string
  title: string
  reference?: string | null
  documentType: string
  category: string
  department: string
  author?: string | null
  documentDate?: Date | null
  archivedAt: Date
  expirationDate?: Date | null
  confidentiality: string
  keywords?: string | null
  description?: string | null
  physicalLocation?: string | null
  status: 'ACTIF' | 'ARCHIVE' | 'EXPIRE' | 'SUPPRIME'
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface DriveFile {
  id: string
  archiveId: string
  googleFileId: string
  googleFolderId?: string | null
  driveUrl?: string | null
  fileName: string
  mimeType: string
  fileSize: bigint
  sha256: string
  version: number
  createdAt: Date
  updatedAt: Date
}

export interface ArchiveWithFile extends Archive {
  driveFile?: DriveFile | null
}

export interface ArchiveFormData {
  title: string
  reference?: string
  documentType: string
  category: string
  department: string
  author?: string
  documentDate?: Date
  expirationDate?: Date
  confidentiality: string
  keywords?: string
  description?: string
  physicalLocation?: string
  file?: File
}

export interface ArchiveFilters {
  search?: string
  category?: string
  department?: string
  documentType?: string
  status?: string
  confidentiality?: string
  dateFrom?: Date
  dateTo?: Date
}