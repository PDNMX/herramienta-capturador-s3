import { NextAuthOptions, Awaitable, User, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { handleError } from "./utils"
import { directus, login } from "@/services/directus"
import { readMe, refresh } from "@directus/sdk"
import { JWT } from "next-auth/jwt"
import { AuthRefresh, UserSession, UserParams } from "@/types/next-auth"

// Mapeo de UUID de rol → nombre (evita llamadas a directus_roles que requieren permisos de admin)
const ROLE_ID_TO_NAME: Record<string, string> = {
  "e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b": "Administrador",
  "a5862643-ea54-43ac-af3d-0ff8809ff93f": "Usuario-Capturador",
  "80ba6d0a-3025-4bc5-9966-2acefa91d7c2": "Api-Interconexion",
  "41947437-8852-4e5b-adac-ea91d705f732": "API-Interconexión-ANA",
}

const userParams = (user: UserSession): UserParams => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    name: `${user.first_name} ${user.last_name}`,
    entePublico: user.entePublico || "",
    entePublicoNombre: user.entePublicoNombre || "",
    role: user.role || "",
    roleName: user.roleName || "",
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async function (credentials) {
        try {
          const { email, password } = credentials as {
            email: string
            password: string
          }
          const auth = await login({ email, password })
          const apiAuth = directus(auth.access_token ?? "")
          const loggedInUser = await apiAuth.request(
            readMe({
              fields: ["id", "email", "first_name", "last_name", "entePublico", "role"],
            })
          )

          const roleId = loggedInUser.role as string ?? ""
          const roleName = ROLE_ID_TO_NAME[roleId] ?? ""
          const entePublicoId = loggedInUser.entePublico
            ? String(loggedInUser.entePublico)
            : ""
          const entePublicoNombre = ""

          const user: Awaitable<User> = {
            id: loggedInUser.id,
            first_name: loggedInUser.first_name ?? "",
            last_name: loggedInUser.last_name ?? "",
            email: loggedInUser.email ?? "",
            entePublico: entePublicoId,
            entePublicoNombre,
            role: roleId,
            roleName,
            access_token: auth.access_token ?? "",
            expires: Date.now() + (2 * 60 * 60 * 1000),
            refresh_token: auth.refresh_token ?? "",
          }

          return user
        } catch (error: any) {
          handleError(error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
    updateAge: 5 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user, trigger, session }): Promise<JWT> {
      if (trigger === "update" && !session?.tokenIsRefreshed) {
        token.access_token = session.access_token
        token.refresh_token = session.refresh_token
        token.expires_at = session.expires_at
        token.tokenIsRefreshed = false
      }

      if (account && user) {
        return {
          access_token: user.access_token,
          expires_at: user.expires,
          refresh_token: user.refresh_token,
          user: userParams(user as UserSession),
          error: null,
        }
      }
      else if (Date.now() < (token.expires_at ?? 0)) {
        return { ...token, error: null }
      }
      else {
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
          forceLogout: true
        }
      }
    },
    async session({ session, token }): Promise<Session> {
      if (token.error || token.forceLogout) {
        session.forceLogout = true
        session.error = token.error
        session.expires = new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toISOString()
      } else {
        if (token.user) {
          const { id, name, email, entePublico, entePublicoNombre, role, roleName } = token.user as UserParams
          session.user = {
            id,
            name,
            email,
            entePublico: entePublico || "",
            entePublicoNombre: entePublicoNombre || "",
            role: role || "",
            roleName: roleName || "",
          }
        }
        session.access_token = token.access_token
        session.tokenIsRefreshed = token?.tokenIsRefreshed ?? false
        session.expires_at = token.expires_at
        session.refresh_token = token.refresh_token
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
}
