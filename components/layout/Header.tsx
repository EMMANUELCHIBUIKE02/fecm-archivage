'use client'

import { signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { LogOut, Bell, Check, CheckCheck } from "lucide-react"

interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export default function Header({ user }: HeaderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  async function loadNotifications() {
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" })
      if (!response.ok) return

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // Les notifications ne doivent pas empêcher l'utilisation du tableau de bord.
    }
  }

  useEffect(() => {
    const refreshNotifications = async () => {
      await loadNotifications()
    }

    void refreshNotifications()
    const interval = window.setInterval(loadNotifications, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  async function markAsRead(id: string) {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    await loadNotifications()
  }

  async function markAllAsRead() {
    await fetch("/api/notifications", { method: "PATCH" })
    await loadNotifications()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Bienvenue, {user.name?.split(' ')[0] || 'Utilisateur'} 👋
          </h2>
          <p className="text-sm text-gray-500">
            Gérez vos archives en toute simplicité
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
            >
            <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex min-h-2 min-w-2 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Tout lire
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-500">
                      Aucune notification
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-gray-100 px-4 py-3 last:border-b-0 ${notification.read ? "bg-white" : "bg-blue-50"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="mt-1 text-xs text-gray-600">{notification.message}</p>
                            <p className="mt-2 text-[11px] text-gray-400">
                              {new Date(notification.createdAt).toLocaleString("fr-FR")}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              type="button"
                              aria-label="Marquer comme lue"
                              onClick={() => markAsRead(notification.id)}
                              className="shrink-0 rounded p-1 text-blue-600 hover:bg-blue-100"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Déconnexion */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}