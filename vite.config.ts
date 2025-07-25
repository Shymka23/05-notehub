import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy":
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none'",
    },
  },
});
