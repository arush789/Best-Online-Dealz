import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
//
// Only variables prefixed with BODZ_PUBLIC_ reach the browser (via
// import.meta.env). The usual VITE_ prefix is deliberately NOT exposed: old
// secrets were stored in Vercel under VITE_ names, and Vite would ship them.
// Never put secrets in a BODZ_PUBLIC_ variable: anything there is public.
// Database, Telegram and Cutt.ly credentials live on bodz-server only.
export default defineConfig({
  plugins: [react()],
  envPrefix: "BODZ_PUBLIC_",
});
