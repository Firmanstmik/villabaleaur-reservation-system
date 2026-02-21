import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached long-term
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // UI primitives (used across many pages)
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-toast',
            '@radix-ui/react-tabs',
            '@radix-ui/react-slot',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-label',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slider',
            '@radix-ui/react-aspect-ratio',
          ],
          // Animation library
          'vendor-framer': ['framer-motion'],
          // Mapping — only needed on PropertyDetail
          'vendor-mapbox': ['mapbox-gl'],
          // Charts — only needed on BlogPost
          'vendor-recharts': ['recharts'],
          // Drag-and-drop — only needed on Dashboard/Admin
          'vendor-dnd': [
            '@dnd-kit/core',
            '@dnd-kit/sortable',
            '@dnd-kit/modifiers',
            '@dnd-kit/utilities',
          ],
          // Supabase + data fetching
          'vendor-data': [
            '@supabase/supabase-js',
            '@tanstack/react-query',
          ],
        },
      },
    },
  },
}));
