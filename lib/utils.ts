import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatFileSize(bytes: number | bigint): string {
  const size = typeof bytes === 'bigint' ? Number(bytes) : bytes
  
  if (size === 0) return '0 octets'
  
  const units = ['octets', 'Ko', 'Mo', 'Go', 'To']
  const i = Math.floor(Math.log(size) / Math.log(1024))
  
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function generateArchiveNumber(year?: number): string {
  const currentYear = year || new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `ARC-${currentYear}-${randomNum}`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

export function getConfidentialityColor(level: string): string {
  const colors: Record<string, string> = {
    'Public': 'bg-green-100 text-green-800',
    'Interne': 'bg-blue-100 text-blue-800',
    'Confidentiel': 'bg-orange-100 text-orange-800',
    'Très confidentiel': 'bg-red-100 text-red-800'
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'ACTIF': 'bg-green-100 text-green-800',
    'ARCHIVE': 'bg-gray-100 text-gray-800',
    'EXPIRE': 'bg-orange-100 text-orange-800',
    'SUPPRIME': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function isExpiringSoon(expirationDate: Date | null | undefined, days: number = 30): boolean {
  if (!expirationDate) return false
  const expDate = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate
  const daysUntilExpiration = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiration <= days && daysUntilExpiration > 0
}