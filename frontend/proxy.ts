// Protecting routes with next-auth
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ token, req }) {
      const { pathname } = req.nextUrl;
      // Admin routes — only Administrador role
      if (pathname.startsWith("/inicio/administracion")) {
        return token?.user?.roleName === "Administrador-Frontend";
      }
      // All other /inicio routes — any authenticated user
      return !!token;
    },
  },
});

export const config = { matcher: ["/inicio/:path*"] };
