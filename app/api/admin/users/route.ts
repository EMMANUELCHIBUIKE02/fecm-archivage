import { getCurrentUser } from "@/lib/authorization"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(UserRole)
})

async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    return { response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) }
  }

  if (user.role !== UserRole.ADMIN) {
    return { response: NextResponse.json({ error: "Accès interdit" }, { status: 403 }) }
  }

  return { userId: user.id }
}

export async function GET() {
  const access = await requireAdmin()

  if (access.response) {
    return access.response
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

  return NextResponse.json({ users })
}

export async function PATCH(request: Request) {
  const access = await requireAdmin()

  if (access.response) {
    return access.response
  }

  try {
    const data = updateRoleSchema.parse(await request.json())
    const target = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { id: true, role: true }
    })

    if (!target) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    if (target.role === UserRole.ADMIN && data.role !== UserRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: { role: UserRole.ADMIN }
      })

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Le dernier administrateur ne peut pas être rétrogradé" },
          { status: 409 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id: data.userId },
      data: { role: data.role },
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
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    console.error("Erreur modification rôle:", error)
    return NextResponse.json({ error: "Erreur lors de la modification du rôle" }, { status: 500 })
  }
}