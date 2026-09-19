export interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
  role: 'ADMIN' | 'ARCHIVISTE' | 'CONSULTATION'
  createdAt: Date
  updatedAt: Date
}

export interface UserWithStats extends User {
  _count?: {
    archives: number
  }
}