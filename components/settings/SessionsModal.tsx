"use client"

import { useState, useEffect } from "react"
import { X, Monitor, Loader2, Trash2 } from "lucide-react"

interface Session {
  id: string
  expires: Date
  isCurrent: boolean
}

interface SessionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SessionsModal({ isOpen, onClose }: SessionsModalProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      const loadSessions = async () => {
        setIsLoading(true)
        try {
          const response = await fetch('/api/user/sessions')
          const data = await response.json()

          if (data.success) {
            setSessions(data.sessions)
          }
        } catch (error) {
          console.error("Erreur chargement sessions:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadSessions()
    }
  }, [isOpen])

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingId(sessionId)
    try {
      const response = await fetch(`/api/user/sessions?id=${sessionId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setSessions(sessions.filter(s => s.id !== sessionId))
      }
    } catch (error) {
      console.error("Erreur suppression session:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Sessions actives
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune session active</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    session.isCurrent 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      session.isCurrent ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Monitor className={`w-5 h-5 ${
                        session.isCurrent ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.isCurrent ? 'Session actuelle' : 'Autre appareil'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expire le {new Date(session.expires).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      disabled={deletingId === session.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}