import { createContext, useContext, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export type Role = "superadmin" | "admin" | "user"

export interface User {
  name: string
  email: string
  role: Role
  avatar: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, pw: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  const login = (email: string, pw: string) => {
    if (email === "super@example.com" && pw === "@Super123") {
      setUser({ name: "Super Admin", email, role: "superadmin", avatar: "https://i.pravatar.cc/150?img=11" })
      return true
    } else if (email === "admin@example.com" && pw === "@Admin123") {
      setUser({ name: "Admin", email, role: "admin", avatar: "https://i.pravatar.cc/150?img=12" })
      return true
    } else if (email === "user@example.com" && pw === "@User123") {
      setUser({ name: "Warga Biasa", email, role: "user", avatar: "https://i.pravatar.cc/150?img=13" })
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    toast.success("Berhasil logout")
    navigate("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
