import { NextAuthOptions, Awaitable, User, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { handleError } from "./utils"
import { directus, login } from "@/services/directus"
import { readMe, readItem } from "@directus/sdk"
import { JWT } from "next-auth/jwt"
import { AuthRefresh, UserSession, UserParams, FormPermisos } from "@/types/next-auth"

// Fallback UUID → nombre para roles sin admin_access (el rol Administrator de Directus
// ya viene con su nombre real vía role.name en el readMe)
const ROLE_ID_TO_NAME: Record<string, string> = {
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
    formPermisos: user.formPermisos,
  }
}

// Refresca el token de Directus si ya expiró o si han pasado más de 20 horas.
const DIRECTUS_REFRESH_INTERVAL_MS = 20 * 60 * 60 * 1000

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
              fields: ["id", "email", "first_name", "last_name", "entePublico", "role", "role.name"] as any,
            })
          ) as any

          const roleId = (loggedInUser.role?.id ?? loggedInUser.role) as string ?? ""
          const roleName = loggedInUser.role?.name ?? ROLE_ID_TO_NAME[roleId] ?? ""
          const entePublicoId = loggedInUser.entePublico
            ? String(loggedInUser.entePublico?.id ?? loggedInUser.entePublico)
            : ""

          let entePublicoNombre = ""
          let formPermisos: FormPermisos | undefined = undefined

          if (entePublicoId) {
            try {
              const ente = await apiAuth.request(
                readItem("ente_publico" as any, entePublicoId, {
                  fields: ["nombre", "faltasGraves", "faltasNoGraves", "faltasMorales", "faltasFisicas"],
                } as any)
              ) as any
              entePublicoNombre = ente?.nombre ?? ""
              formPermisos = {
                faltasGraves: ente?.faltasGraves ?? true,
                faltasNoGraves: ente?.faltasNoGraves ?? true,
                faltasMorales: ente?.faltasMorales ?? true,
                faltasFisicas: ente?.faltasFisicas ?? true,
              }
            } catch {
              // Si falla la consulta del ente, no restringir acceso
            }
          }

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
            expires: Date.now() + (auth.expires ?? 15 * 60 * 1000),
            refresh_token: auth.refresh_token ?? "",
            formPermisos,
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
    maxAge: 30 * 24 * 60 * 60,   // cookie JWT dura 30 días
    updateAge: 24 * 60 * 60,     // NextAuth renueva el JWT cada 24 horas
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
          last_refreshed_at: Date.now(),
          refresh_token: user.refresh_token,
          user: userParams(user as UserSession),
          error: null,
        }
      }

      // Refrescar si: expires_at ya pasó, O si han pasado más de 10 min desde el último refresh.
      // El segundo check cubre sesiones antiguas con expires_at mal calculado.
      const tokenAge = Date.now() - ((token.last_refreshed_at as number) ?? 0)
      const needsRefresh =
        Date.now() >= (token.expires_at ?? 0) || tokenAge > DIRECTUS_REFRESH_INTERVAL_MS

      if (!needsRefresh) {
        return { ...token, error: null }
      }

      // Renovar token de Directus con refresh_token
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: token.refresh_token, mode: "json" }),
        })
        if (!res.ok) throw new Error("Refresh failed")
        const json = await res.json()
        const result = json.data ?? json
        return {
          ...token,
          access_token: result.access_token ?? token.access_token,
          refresh_token: result.refresh_token ?? token.refresh_token,
          expires_at: Date.now() + (result.expires ?? 24 * 60 * 60 * 1000),
          last_refreshed_at: Date.now(),
          error: null,
          forceLogout: false,
        }
      } catch {
        // Si el access_token todavía no expiró, dejamos la sesión activa y reintentamos después.
        // Solo forzamos logout si el token ya expiró y no hay forma de renovarlo.
        const tokenStillValid = Date.now() < (token.expires_at ?? 0)
        if (tokenStillValid) {
          return { ...token, error: null, forceLogout: false }
        }
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
          forceLogout: true,
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
          const { id, name, email, entePublico, entePublicoNombre, role, roleName, formPermisos } = token.user as UserParams
          session.user = {
            id,
            name,
            email,
            entePublico: entePublico || "",
            entePublicoNombre: entePublicoNombre || "",
            role: role || "",
            roleName: roleName || "",
            formPermisos,
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
