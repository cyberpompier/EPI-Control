import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(), 
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'EPI Control',
        short_name: 'EPI Control',
        description: 'Application de gestion des équipements de protection individuelle pour les sapeurs-pompiers',
        theme_color: '#dc2626',
        background_color: '#ffffff',
        display: 'standalone',
        icon: 'public/logo-pompier.svg',
        start_url: '/',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));