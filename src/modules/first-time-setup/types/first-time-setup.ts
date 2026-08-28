export interface FirstTimeSetupActionState {
  message: string | null
  fieldErrors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  values?: {
    name?: string
    email?: string
  }
  success?: boolean
}

export const INITIAL_SETUP_ACTION_STATE: FirstTimeSetupActionState = {
  message: null,
}
