import { DefaultSession } from "next-auth"

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
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string
      entePublico?: string
    }
    access_token?: string
    expires_at?: number
    refresh_token?: string
    tokenIsRefreshed: boolean | null
    error?: string | null
    forceLogout?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
    expires_at?: number
    refresh_token?: string
    error?: string | null
    tokenIsRefreshed?: boolean | null
    user?: UserParams  // IMPORTANTE: Agregar esto para mantener los datos del usuario en el token
    forceLogout?: boolean
  }
}

export type AuthRefresh = {
  access_token?: string | null
  expires?: number | null
  refresh_token?: string | null
}

export type UserSession = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  access_token?: string;
  expires?: number;
  refresh_token?: string;
  entePublico?: string;
}

export type UserParams = {
  id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  entePublico?: string;
}