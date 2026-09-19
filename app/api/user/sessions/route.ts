import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    const currentSessionToken = cookieStore.get("authjs.session-token")?.value
      ?? cookieStore.get("__Secure-authjs.session-token")?.value

    // Récupérer toutes les sessions de l'utilisateur
    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        expires: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      sessions: sessions.map(s => ({
        id: s.id,
        expires: s.expires,
        isCurrent: currentSessionToken === s.sessionToken
      }))
    })

  } catch (error) {
    console.error("Erreur récupération sessions:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sessions" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID de session manquant" },
        { status: 400 }
      )
    }

    // Vérifier que la session appartient à l'utilisateur
    const sessionToDelete = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id
      }
    })

    if (!sessionToDelete) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404 }
      )
    }

    const cookieStore = await cookies()
    const currentSessionToken = cookieStore.get("authjs.session-token")?.value
      ?? cookieStore.get("__Secure-authjs.session-token")?.value

    // Empêcher la suppression de la session actuelle
    if (currentSessionToken === sessionToDelete.sessionToken) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre session actuelle" },
        { status: 400 }
      )
    }

    // Supprimer la session
    await prisma.session.delete({
      where: { id: sessionId }
    })

    return NextResponse.json({
      success: true,
      message: "Session supprimée avec succès"
    })

  } catch (error) {
    console.error("Erreur suppression session:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la session" },
      { status: 500 }
    )
  }
}