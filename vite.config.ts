
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Handle zod and related packages
          if (id.includes('node_modules/zod')) {
            return 'zod';
          }
          // Handle React and related core packages
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/@supabase/supabase-js')) {
            return 'vendor';
          }
          // Handle form related packages
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform/resolvers')) {
            return 'form-utils';
          }
          return null;
        }
      },
      // Ensure all packages are properly bundled (not externalized)
      external: []
    },
    commonjsOptions: {
      include: [/node_modules/],
      esmExternals: false
    }
  }
}));
