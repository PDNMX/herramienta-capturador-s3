import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    VITE_URL_API: process.env.VITE_URL_API,
    VITE_URL_OAUTH: process.env.VITE_URL_OAUTH,
    VITE_CLIENT_ID: process.env.VITE_CLIENT_ID,
    VITE_CLIENT_SECRET: process.env.VITE_CLIENT_SECRET,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
