'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FolderOpen, 
  PlusCircle, 
  Search, 
  BarChart3, 
  Clock, 
  Settings,
  Users,
  FileText,
  Sun,
  Moon
} from "lucide-react"
import { useTheme } from "@/components/providers/ThemeProvider"
import type { UserRole } from "@prisma/client"

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role: UserRole
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { href: '/dashboard/archives', icon: FolderOpen, label: 'Mes archives' },
    { href: '/dashboard/recherche', icon: Search, label: 'Rechercher' },
    { href: '/dashboard/statistiques', icon: BarChart3, label: 'Statistiques' },
    { href: '/dashboard/historique', icon: Clock, label: 'Historique' },
    { href: '/dashboard/parametres', icon: Settings, label: 'Paramètres' },
  ]

  const visibleMenuItems = user.role === 'CONSULTATION'
    ? menuItems
    : [{ href: '/dashboard/ajouter', icon: PlusCircle, label: 'Ajouter une archive' }, ...menuItems]

  if (user.role === 'ADMIN') {
    visibleMenuItems.push({ href: '/dashboard/utilisateurs', icon: Users, label: 'Utilisateurs' })
  }

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Logo */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="font-bold text-xl text-gray-900 dark:text-white">FECM</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Archivage</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
              pathname === item.href
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}

          <span>
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </span>
        </button>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name || ''} 
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {user.name || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 truncate dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}