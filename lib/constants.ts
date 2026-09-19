export const DOCUMENT_TYPES = [
  'Contrat',
  'Facture',
  'Devis',
  'Bon de commande',
  'Rapport',
  'Courrier',
  'Email',
  'Diplôme',
  'Certificat',
  'Attestation',
  'Procès-verbal',
  'Note de service',
  'Règlement',
  'Politique',
  'Manuel',
  'Guide',
  'Formulaire',
  'Dossier',
  'Plan',
  'Schéma',
  'Photo',
  'Vidéo',
  'Autre'
] as const

export const CATEGORIES = [
  'Administration',
  'Finance',
  'Comptabilité',
  'Ressources Humaines',
  'Juridique',
  'Commercial',
  'Marketing',
  'Technique',
  'Informatique',
  'Production',
  'Qualité',
  'Sécurité',
  'Projet',
  'Recherche & Développement',
  'Communication',
  'Formation',
  'Autre'
] as const

export const DEPARTMENTS = [
  'Direction Générale',
  'Direction Administrative',
  'Direction Financière',
  'Direction des Ressources Humaines',
  'Direction Juridique',
  'Direction Commerciale',
  'Direction Marketing',
  'Direction Technique',
  'Direction Informatique',
  'Direction de la Production',
  'Direction Qualité',
  'Service Achats',
  'Service Comptabilité',
  'Service Communication',
  'Service Formation',
  'Service Maintenance',
  'Service Logistique',
  'Autre'
] as const

export const CONFIDENTIALITY_LEVELS = [
  'Public',
  'Interne',
  'Confidentiel',
  'Très confidentiel'
] as const

export const ARCHIVE_STATUSES = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'ARCHIVE', label: 'Archivé' },
  { value: 'EXPIRE', label: 'Expiré' },
  { value: 'SUPPRIME', label: 'Supprimé' }
] as const

export const USER_ROLES = [
  { value: 'ADMIN', label: 'Administrateur' },
  { value: 'ARCHIVISTE', label: 'Archiviste' },
  { value: 'CONSULTATION', label: 'Consultation' }
] as const

export const MIME_TYPES = {
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'application/vnd.ms-excel': 'Excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
  'application/vnd.ms-powerpoint': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'image/jpeg': 'Image JPEG',
  'image/png': 'Image PNG',
  'image/gif': 'Image GIF',
  'text/plain': 'Texte',
  'application/zip': 'Archive ZIP',
  'application/x-rar-compressed': 'Archive RAR'
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed'
]

export const ARCHIVE_STATUS = [
  "ACTIF",
  "ARCHIVE",
  "SUPPRIME"
] as const