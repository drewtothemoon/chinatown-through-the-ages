import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Dev-server only: serve public/admin/index.html (Decap CMS) at /admin and /admin/
 * instead of falling back to the main app. In production, Netlify serves the
 * static file from dist/admin/ directly, so this isn't needed there.
 */
function adminRoute(): Plugin {
  return {
    name: "admin-route",
    configureServer(server) {
      server.middlewares.use((rawReq, _res, next) => {
        const req = rawReq as unknown as { url?: string };
        if (req.url === "/admin" || req.url === "/admin/") req.url = "/admin/index.html";
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [adminRoute(), react(), tailwindcss()],
});
