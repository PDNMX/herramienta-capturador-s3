// Protecting routes with next-auth
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = { matcher: ["/inicio/:path*"] };
