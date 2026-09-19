import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verify } from "otplib"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const token = typeof body.token === "string" ? body.token.trim() : ""

    if (!/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: "Le code doit contenir 6 chiffres" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true }
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: "Aucune configuration 2FA en attente" }, { status: 400 })
    }

    const result = await verify({ secret: user.twoFactorSecret, token })

    if (!result.valid) {
      return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur vérification 2FA:", error)
    return NextResponse.json(
      { error: "Impossible de vérifier le code 2FA" },
      { status: 500 }
    )
  }
}
