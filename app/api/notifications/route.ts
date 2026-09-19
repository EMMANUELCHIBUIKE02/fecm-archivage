import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

async function getSessionUserId() {
  const session = await auth()
  return session?.user?.id ?? null
}

async function createExpirationNotifications(userId: string) {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
    select: { expirationAlerts: true }
  })

  if (settings?.expirationAlerts === false) {
    return
  }

  const now = new Date()
  const alertLimit = new Date(now)
  alertLimit.setDate(alertLimit.getDate() + 30)

  const archives = await prisma.archive.findMany({
    where: {
      userId,
      expirationDate: { not: null }
    },
    select: {
      id: true,
      title: true,
      expirationDate: true
    }
  })

  for (const archive of archives) {
    if (!archive.expirationDate) continue

    const isExpired = archive.expirationDate < now
    const expiresSoon = archive.expirationDate >= now && archive.expirationDate <= alertLimit

    if (!isExpired && !expiresSoon) continue

    const type = isExpired ? "EXPIRED_ARCHIVE" : "EXPIRING_ARCHIVE"
    const title = isExpired ? "Archive expirée" : "Archive bientôt expirée"
    const formattedDate = archive.expirationDate.toLocaleDateString("fr-FR")
    const message = isExpired
      ? `L'archive « ${archive.title} » a expiré le ${formattedDate}.`
      : `L'archive « ${archive.title} » expire le ${formattedDate}.`

    const existing = await prisma.notification.findFirst({
      where: { userId, type, title, message }
    })

    if (!existing) {
      await prisma.notification.create({
        data: { userId, type, title, message }
      })
    }
  }
}

export async function GET() {
  try {
    const userId = await getSessionUserId()

    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    await createExpirationNotifications(userId)

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 30
      }),
      prisma.notification.count({
        where: { userId, read: false }
      })
    ])

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error("Erreur récupération notifications:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getSessionUserId()

    if (!userId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({})) as { id?: string }
    const where = body.id
      ? { id: body.id, userId }
      : { userId, read: false }

    await prisma.notification.updateMany({
      where,
      data: { read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur mise à jour notifications:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des notifications" },
      { status: 500 }
    )
  }
}
