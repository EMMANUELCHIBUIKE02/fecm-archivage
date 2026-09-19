import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ParametresContent from "@/components/settings/ParametresContent"

export default async function ParametresPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer les informations de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        where: {
          provider: 'google'
        },
        select: {
          access_token: true,
          expires_at: true
        }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  // Statistiques de l'utilisateur
  const totalArchives = await prisma.archive.count({
    where: { userId: user.id }
  })

  const totalFiles = await prisma.driveFile.count({
    where: {
      archive: {
        userId: user.id
      }
    }
  })

  const totalSize = await prisma.driveFile.aggregate({
    where: {
      archive: {
        userId: user.id
      }
    },
    _sum: {
      fileSize: true
    }
  })

  const isGoogleConnected = Boolean(user.accounts.length > 0 && user.accounts[0].access_token)

  return (
    <ParametresContent
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt
      }}
      stats={{
        totalArchives,
        totalFiles,
        totalSize: Number(totalSize._sum.fileSize || 0)
      }}
      isGoogleConnected={isGoogleConnected}
    />
  )
}