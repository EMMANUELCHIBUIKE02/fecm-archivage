"use client"

import { useState } from "react"
import { Loader2, ShieldCheck, X } from "lucide-react"
import Image from "next/image"

interface TwoFactorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TwoFactorModal({ isOpen, onClose }: TwoFactorModalProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")
  const [isEnabled, setIsEnabled] = useState(false)

  const startSetup = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/user/2fa/setup", { method: "POST" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Impossible de préparer la 2FA")
      setQrCode(data.qrCode)
      setSecret(data.secret)
    } catch (setupError) {
      setError(setupError instanceof Error ? setupError.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const verifySetup = async () => {
    setIsVerifying(true)
    setError("")
    try {
      const response = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Code invalide")
      setIsEnabled(true)
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Une erreur est survenue")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    setQrCode(null)
    setSecret(null)
    setToken("")
    setError("")
    setIsEnabled(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Configurer la 2FA</h2>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1 hover:bg-gray-100" aria-label="Fermer">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {isEnabled ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
              L&apos;authentification à deux facteurs est activée sur votre compte.
            </div>
          ) : !qrCode ? (
            <>
              <p className="text-sm text-gray-600">
                Cliquez sur le bouton pour générer une clé unique à ajouter dans Google Authenticator.
              </p>
              <button onClick={startSetup} disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Générer ma clé 2FA
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700">Scannez ce QR code dans Google Authenticator.</p>
              <div className="flex justify-center rounded-lg border border-gray-200 bg-white p-3">
                <Image src={qrCode} alt="QR code de configuration 2FA" width={176} height={176} className="h-44 w-44" unoptimized />
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="mb-1 text-xs font-medium text-gray-600">Clé de configuration manuelle</p>
                <code className="break-all text-sm font-semibold text-gray-900">{secret}</code>
              </div>
              <p className="text-sm text-gray-600">Après l&apos;ajout, saisissez le code à 6 chiffres généré par l&apos;application.</p>
              <input
                value={token}
                onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-lg tracking-[0.35em] text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={verifySetup} disabled={isVerifying || token.length !== 6} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                {isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
                Vérifier et activer
              </button>
            </>
          )}
          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  )
}
