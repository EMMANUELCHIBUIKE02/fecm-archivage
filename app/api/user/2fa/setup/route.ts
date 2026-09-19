import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSecret, generateURI } from "otplib"
import QRCode from "qrcode"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const secret = generateSecret()
    const uri = generateURI({
      issuer: "FECM Archivage",
      label: session.user.email,
      secret
    })
    const qrCode = await QRCode.toDataURL(uri)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: false
      }
    })

    return NextResponse.json({ success: true, secret, qrCode })
  } catch (error) {
    console.error("Erreur préparation 2FA:", error)
    return NextResponse.json(
      { error: "Impossible de préparer la double authentification" },
      { status: 500 }
    )
  }
}
