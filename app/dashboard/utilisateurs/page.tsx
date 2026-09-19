import { getCurrentUser } from "@/lib/authorization"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { redirect } from "next/navigation"
import UsersManagement from "@/components/settings/UsersManagement"

export default async function UtilisateursPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: {
        select: { archives: true }
      }
    },
    orderBy: { createdAt: "asc" }
  })

  return <UsersManagement initialUsers={users} currentUserId={user.id} />
}