
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
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@supabase/supabase-js'
          ],
          'form-utils': [
            'react-hook-form',
            '@hookform/resolvers/zod'
          ],
          'zod': [
            'zod'
          ]
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
