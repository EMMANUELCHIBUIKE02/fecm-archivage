export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  size: string
  webViewLink?: string
  webContentLink?: string
  createdTime: string
  modifiedTime: string
}

export interface DriveUploadResult {
  fileId: string
  fileName: string
  fileSize: number
  mimeType: string
  webViewLink?: string
}

export interface DriveFolderStructure {
  rootFolderId: string
  yearFolders: Record<string, string>
  categoryFolders: Record<string, Record<string, string>>
}