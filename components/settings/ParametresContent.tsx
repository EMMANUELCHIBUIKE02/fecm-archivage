"use client"

import { useState } from "react"
import Image from "next/image"
import { Settings, User, HardDrive, Shield, Bell } from "lucide-react"
import DeleteAccountModal from "./DeleteAccountModal"
import SessionsModal from "./SessionsModal"
import TwoFactorModal from "./TwoFactorModal"

interface UserData {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: Date
}

interface Stats {
  totalArchives: number
  totalFiles: number
  totalSize: number
}

interface ParametresContentProps {
  user: UserData
  stats: Stats
  isGoogleConnected: boolean
}

export default function ParametresContent({
  user,
  stats,
  isGoogleConnected
}: ParametresContentProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false)
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          </div>
          <p className="text-gray-600">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {/* Profil utilisateur */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Profil</h2>
          </div>

          <div className="flex items-start gap-6">
            {/* Photo de profil */}
            {user.image && (
              <div className="flex-shrink-0">
                <Image
                  src={user.image}
                  alt={user.name || 'Photo de profil'}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-200"
                />
              </div>
            )}

            {/* Informations */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <p className="text-gray-900 font-medium">{user.name || 'Non renseigné'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rôle
                </label>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  {user.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membre depuis
                </label>
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connexion Google Drive */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <HardDrive className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Google Drive</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isGoogleConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                  <HardDrive className={`w-5 h-5 ${isGoogleConnected ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {isGoogleConnected ? 'Compte Google connecté' : 'Compte Google non connecté'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isGoogleConnected 
                      ? 'Vos fichiers sont synchronisés avec Google Drive' 
                      : 'Connectez votre compte Google pour activer la synchronisation'}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isGoogleConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isGoogleConnected ? 'Connecté' : 'Déconnecté'}
              </div>
            </div>

            {/* Statistiques de stockage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Archives créées</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalArchives}</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Fichiers stockés</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalFiles}</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700 mb-1">Espace utilisé</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-600">
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
              </div>
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                onClick={() => setIsTwoFactorModalOpen(true)}
              >
                Configurer
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Sessions actives</p>
                <p className="text-sm text-gray-600">
                  Gérez les appareils connectés à votre compte
                </p>
              </div>
              <button 
                onClick={() => setIsSessionsModalOpen(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Voir
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Notifications par email</p>
                <p className="text-sm text-gray-600">
                  Recevez des notifications sur votre adresse email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Archives expirées</p>
                <p className="text-sm text-gray-600">
                  Être notifié quand une archive arrive à expiration
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Résumé hebdomadaire</p>
                <p className="text-sm text-gray-600">
                  Recevoir un résumé de votre activité chaque semaine
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Zone de danger */}
        <div className="bg-white rounded-lg shadow border border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-900 mb-4">Zone de danger</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-900">Supprimer mon compte</p>
                <p className="text-sm text-red-700">
                  Supprimer définitivement votre compte et toutes vos données
                </p>
              </div>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userEmail={user.email}
      />

      <SessionsModal
        isOpen={isSessionsModalOpen}
        onClose={() => setIsSessionsModalOpen(false)}
      />

      <TwoFactorModal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
      />
    </>
  )
}