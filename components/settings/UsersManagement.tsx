"use client"

import { useState } from "react"
import { Archive, Eye, ShieldCheck, Users } from "lucide-react"
import type { UserRole } from "@prisma/client"

type ManagedUser = {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
  createdAt: Date
  _count: { archives: number }
}

interface UsersManagementProps {
  initialUsers: ManagedUser[]
  currentUserId: string
}

const roles: UserRole[] = ["ADMIN", "ARCHIVISTE", "CONSULTATION"]

const roleDetails: Record<UserRole, {
  label: string
  icon: typeof ShieldCheck
  iconClass: string
}> = {
  ADMIN: { label: "Administrateurs", icon: ShieldCheck, iconClass: "text-amber-600" },
  ARCHIVISTE: { label: "Archivistes", icon: Archive, iconClass: "text-blue-600" },
  CONSULTATION: { label: "Consultation", icon: Eye, iconClass: "text-emerald-600" }
}

export default function UsersManagement({ initialUsers, currentUserId }: UsersManagementProps) {
  const [users, setUsers] = useState(initialUsers)
  const [error, setError] = useState<string | null>(null)
  const [savingUserId, setSavingUserId] = useState<string | null>(null)

  async function updateRole(userId: string, role: UserRole) {
    setSavingUserId(userId)
    setError(null)

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role })
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Impossible de modifier le rôle")
        return
      }

      setUsers((currentUsers) => currentUsers.map((user) => (
        user.id === userId ? data.user : user
      )))
    } catch {
      setError("Une erreur réseau est survenue")
    } finally {
      setSavingUserId(null)
    }
  }

  function renderRoleSection(role: UserRole, contentClassName: string) {
    const details = roleDetails[role]
    const RoleIcon = details.icon
    const roleUsers = users.filter((user) => user.role === role)
    const isAdmin = role === "ADMIN"

    return (
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <RoleIcon className={`h-6 w-6 ${details.iconClass}`} />
            <h2 className="font-semibold text-gray-900">{details.label}</h2>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {roleUsers.length}
          </span>
        </div>

        <div className={`${isAdmin ? "h-36" : "h-96"} overflow-y-auto p-4 ${contentClassName}`}>
          {roleUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">Aucun utilisateur</p>
          ) : (
            roleUsers.map((user) => (
              <div key={user.id} className="shrink-0 grid w-full grid-cols-1 items-center gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-[1.5fr_1fr_1fr_1.25fr] sm:gap-x-10">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{user.name || "Utilisateur"}</p>
                  <p className="break-all text-sm text-gray-500">{user.email}</p>
                  {user.id === currentUserId && (
                    <span className="text-xs text-blue-600">Votre compte</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span>{user._count.archives} archive{user._count.archives > 1 ? "s" : ""}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </div>
                <label className="w-full text-xs font-medium text-gray-600">
                  Rôle
                  <select
                    value={user.role}
                    disabled={savingUserId === user.id}
                    onChange={(event) => updateRole(user.id, event.target.value as UserRole)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                  >
                    {roles.map((availableRole) => (
                      <option key={availableRole} value={availableRole}>
                        {roleDetails[availableRole].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
        </div>
        <p className="text-gray-600">Gérez les comptes et leurs permissions.</p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="w-full lg:col-span-2">
          {renderRoleSection("ADMIN", "flex flex-col gap-3")}
        </div>

        <div className="w-full">
          {renderRoleSection("ARCHIVISTE", "flex flex-col gap-3")}
        </div>

        <div className="w-full">
          {renderRoleSection("CONSULTATION", "flex flex-col gap-3")}
        </div>
      </div>
    </div>
  )
}