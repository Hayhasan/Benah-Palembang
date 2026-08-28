export interface AuthActionState {
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
  values?: {
    name?: string
    email?: string
  }
  accountCreated?: boolean
}

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {}
