import { ResetPasswordPage } from "@/modules/auth/components/reset-password-page"
import { getPasswordResetTokenStatus } from "@/modules/auth/data/password-reset"

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>
}

export default async function Page({ params }: ResetPasswordPageProps) {
  const { token } = await params
  const tokenStatus = await getPasswordResetTokenStatus(token)

  return <ResetPasswordPage token={token} tokenStatus={tokenStatus} />
}
