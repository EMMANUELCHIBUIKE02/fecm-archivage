import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function HomePage() {
  const session = await auth()

  // Si connecté, rediriger vers le dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Logo / Titre */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            📁 FECM Archivage
          </h1>
          <p className="text-xl text-gray-600">
            Gérez vos documents et archives en toute simplicité
          </p>
        </div>

        {/* Fonctionnalités */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">☁️</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Stockage Google Drive
            </h3>
            <p className="text-sm text-gray-600">
              Vos documents sont stockés de manière sécurisée dans votre Google Drive
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Recherche rapide
            </h3>
            <p className="text-sm text-gray-600">
              Retrouvez n&apos;importe quel document en quelques secondes
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Statistiques
            </h3>
            <p className="text-sm text-gray-600">
              Suivez l&apos;évolution de vos archives avec des graphiques détaillés
            </p>
          </div>
        </div>

        {/* Bouton de connexion */}
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          Commencer maintenant →
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          Connectez-vous avec votre compte Google
        </p>
      </div>
    </div>
  )
}