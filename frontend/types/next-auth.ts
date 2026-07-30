import { DefaultSession } from "next-auth"

export type FormPermisos = {
  faltasGraves: boolean
  faltasNoGraves: boolean
  faltasMorales: boolean
  faltasFisicas: boolean
}

declare module "next-auth" {
  interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    access_token: string
    expires: number
    refresh_token: string
    entePublico: string
    entePublicoNombre: string
    role: string
    roleName: string
    formPermisos?: FormPermisos
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string
      entePublico?: string
      entePublicoNombre?: string
      role?: string
      roleName?: string
      formPermisos?: FormPermisos
    }
    access_token?: string
    expires_at?: number
    refresh_token?: string
    tokenIsRefreshed: boolean | null
    error?: string | null
    forceLogout?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    expires_at?: number
    last_refreshed_at?: number
    refresh_token?: string
    error?: string | null
    tokenIsRefreshed?: boolean | null
    user?: UserParams
    forceLogout?: boolean
    formPermisos?: FormPermisos
  }
}

export type AuthRefresh = {
  access_token?: string | null
  expires?: number | null
  refresh_token?: string | null
}

export type UserSession = {
  id: string
  first_name: string
  last_name: string
  email: string
  access_token?: string
  expires?: number
  refresh_token?: string
  entePublico?: string
  entePublicoNombre?: string
  role?: string
  roleName?: string
  formPermisos?: FormPermisos
}

export type UserParams = {
  id?: string
  name?: string
  first_name?: string
  last_name?: string
  email?: string
  entePublico?: string
  entePublicoNombre?: string
  role?: string
  roleName?: string
  formPermisos?: FormPermisos
}

// Role name constant — matches Directus role name exactly
export const ROLES = {
  ADMINISTRADOR: "Administrator",
  CAPTURADOR: "Usuario-Capturador",
  API: "Api-Interconexion",
} as const

export type RoleName = typeof ROLES[keyof typeof ROLES]
