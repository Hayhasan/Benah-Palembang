import { notFound } from "next/navigation"

import { requireRole } from "@/modules/auth/data/session-dal"
import { ManagedArticlePreview } from "@/modules/manage-content/components/managed-article-preview"
import { getManagedArticle } from "@/modules/manage-content/data/get-managed-article"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  await requireRole(["ADMIN", "SUPERADMIN"])

  const { id } = await params
  if (!/^[1-9]\d*$/.test(id)) notFound()

  const article = await getManagedArticle(Number(id))
  if (!article) notFound()

  return <ManagedArticlePreview article={article} />
}
