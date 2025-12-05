import { NextAuthOptions, Awaitable, User, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { handleError } from "./utils"
import { directus, login } from "@/services/directus"
import { readMe, refresh } from "@directus/sdk"
import { JWT } from "next-auth/jwt"
import { AuthRefresh, UserSession, UserParams } from "@/types/next-auth"

const userParams = (user: UserSession): UserParams => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    name: `${user.first_name} ${user.last_name}`,
    entePublico: user.entePublico || ""
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
              fields: ["id", "email", "first_name", "last_name", "entePublico"],
            })
          )
          
          // Log para debugging
          console.log("Logged in user data:", loggedInUser)
          
          const user: Awaitable<User> = {
            id: loggedInUser.id,
            first_name: loggedInUser.first_name ?? "",
            last_name: loggedInUser.last_name ?? "",
            email: loggedInUser.email ?? "",
            entePublico: loggedInUser.entePublico ?? "",
            access_token: auth.access_token ?? "",
            expires: Math.floor(Date.now() + (auth.expires ?? 0)),
            refresh_token: auth.refresh_token ?? "",
          }
          
          console.log("User object to return:", user)
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
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user, trigger, session }): Promise<JWT> {
      // Manejar actualizaciones del token
      if (trigger === "update" && !session?.tokenIsRefreshed) {
        token.access_token = session.access_token
        token.refresh_token = session.refresh_token
        token.expires_at = session.expires_at
        token.tokenIsRefreshed = false
      }

      // Primera vez que se crea el token (después del login)
      if (account && user) {
        console.log("Creating initial token with user:", user)
        return {
          access_token: user.access_token,
          expires_at: user.expires,
          refresh_token: user.refresh_token,
          user: userParams(user as UserSession),
          error: null,
        }
      } 
      // Token aún válido
      else if (Date.now() < (token.expires_at ?? 0)) {
        return { ...token, error: null }
      } 
      // Token expirado, necesita refresh
      else {
        try {
          const api = directus()
          const result: AuthRefresh = await api.request(
            refresh("json", token?.refresh_token ?? "")
          )
          
          // Después del refresh, mantener la información del usuario
          const resultToken = {
            ...token,
            access_token: result.access_token ?? "",
            expires_at: Math.floor(Date.now() + (result.expires ?? 0)),
            refresh_token: result.refresh_token ?? "",
            error: null,
            tokenIsRefreshed: true,
            // Importante: mantener los datos del usuario incluyendo entePublico
            user: token.user
          }
          return resultToken
        } catch (error) {
          console.error("Error refreshing token:", error)
          return { ...token, error: "RefreshAccessTokenError" as const, forceLogout: true }
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
        // Asegurarse de que token.user existe antes de desestructurar
        if (token.user) {
          const { id, name, email, entePublico } = token.user as UserParams
          console.log("Session callback - entePublico:", entePublico)
          session.user = { 
            id, 
            name, 
            email, 
            entePublico: entePublico || "" 
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