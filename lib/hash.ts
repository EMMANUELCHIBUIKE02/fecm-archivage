import crypto from 'crypto'

/**
 * Calcule le hash SHA-256 d'un fichier (côté serveur Node.js)
 */
export async function calculateFileSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const hash = crypto.createHash('sha256').update(buffer).digest('hex')
  return hash
}

/**
 * Calcule le hash SHA-256 d'un Buffer
 */
export function calculateBufferSHA256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

/**
 * Vérifie l'intégrité d'un fichier
 */
export async function verifyFileIntegrity(file: File, expectedHash: string): Promise<boolean> {
  const calculatedHash = await calculateFileSHA256(file)
  return calculatedHash === expectedHash
}