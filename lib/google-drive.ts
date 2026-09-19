import { google } from 'googleapis'
import { prisma } from './prisma'
import { Readable } from "node:stream"

/**
 * Créer un client Google Drive pour un utilisateur
 */
export async function getDriveClient(userId: string) {
  // Récupérer le compte Google de l'utilisateur
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'google'
    }
  })

  if (!account || !account.access_token) {
    throw new Error('Compte Google non trouvé ou token manquant')
  }

  // Configurer OAuth2
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at
    ? account.expires_at * 1000
    : undefined,
  })

  await oauth2Client.getAccessToken()

  // Créer le client Drive
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  return drive
}

/**
 * Créer ou récupérer le dossier racine FECM ARCHIVAGE
 */
export async function getOrCreateRootFolder(userId: string) {
  const drive = await getDriveClient(userId)

  // Chercher si le dossier existe déjà
  const response = await drive.files.list({
    q: "name='FECM ARCHIVAGE' and mimeType='application/vnd.google-apps.folder' and trashed=false",
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!
  }

  // Créer le dossier racine
  const fileMetadata = {
    name: 'FECM ARCHIVAGE',
    mimeType: 'application/vnd.google-apps.folder'
  }

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id'
  })

  return folder.data.id!
}

/**
 * Créer ou récupérer un dossier année
 */
export async function getOrCreateYearFolder(userId: string, year: number) {
  const drive = await getDriveClient(userId)
  const rootFolderId = await getOrCreateRootFolder(userId)

  // Chercher si le dossier année existe
  const response = await drive.files.list({
    q: `name='${year}' and '${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!
  }

  // Créer le dossier année
  const fileMetadata = {
    name: year.toString(),
    mimeType: 'application/vnd.google-apps.folder',
    parents: [rootFolderId]
  }

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id'
  })

  return folder.data.id!
}

/**
 * Créer ou récupérer un dossier catégorie
 */
export async function getOrCreateCategoryFolder(
  userId: string,
  year: number,
  category: string
) {
  const drive = await getDriveClient(userId)
  const yearFolderId = await getOrCreateYearFolder(userId, year)

  // Chercher si le dossier catégorie existe
  const response = await drive.files.list({
    q: `name='${category}' and '${yearFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  })

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id!
  }

  // Créer le dossier catégorie
  const fileMetadata = {
    name: category,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [yearFolderId]
  }

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id'
  })

  return folder.data.id!
}

/**
 * Uploader un fichier vers Google Drive
 */
export async function uploadFileToDrive(
  userId: string,
  file: File,
  archiveNumber: string,
  category: string,
  year: number
) {
  const drive = await getDriveClient(userId)
  const folderId = await getOrCreateCategoryFolder(userId, year, category)

  // Convertir le File en Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const fileStream = Readable.from(buffer)

  // Nom du fichier : ARC-2026-000001 - Nom original.pdf
  const fileName = `${archiveNumber} - ${file.name}`

  // Uploader le fichier
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId]
    },
    media: {
      mimeType: file.type,
      body: fileStream
    },
    fields: 'id, name, mimeType, size, webViewLink'
  })

  return {
    fileId: response.data.id!,
    fileName: response.data.name!,
    mimeType: response.data.mimeType!,
    fileSize: parseInt(response.data.size || '0'),
    webViewLink: response.data.webViewLink || undefined,
    folderId
  }
}

/**
 * Télécharger un fichier depuis Google Drive
 */
export async function downloadFileFromDrive(userId: string, fileId: string) {
  const drive = await getDriveClient(userId)

  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  )

  return response.data
}

/**
 * Récupérer les informations d'un fichier
 */
export async function getFileInfo(userId: string, fileId: string) {
  const drive = await getDriveClient(userId)

  const response = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size, webViewLink, createdTime, modifiedTime'
  })

  return response.data
}

/**
 * Supprimer un fichier de Google Drive
 */
export async function deleteFileFromDrive(userId: string, fileId: string) {
  const drive = await getDriveClient(userId)

  await drive.files.delete({ fileId })
}