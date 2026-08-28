export interface PasswordResetRequestState {
  status?: "sent" | "error"
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
  email?: string
  maskedEmail?: string
  retryAt?: number
}

export interface PasswordResetFormState {
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

export type PasswordResetTokenStatus =
  | { status: "valid"; maskedEmail: string }
  | { status: "used" }
  | { status: "replaced" }
  | { status: "invalid" }

export const INITIAL_PASSWORD_RESET_REQUEST_STATE: PasswordResetRequestState = {}
export const INITIAL_PASSWORD_RESET_FORM_STATE: PasswordResetFormState = {}
