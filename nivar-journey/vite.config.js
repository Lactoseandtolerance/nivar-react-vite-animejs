import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['animejs', 'styled-components'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-state': ['zustand']
        }
      }
    },
    // Enable source maps for production
    sourcemap: true,
    // Optimize assets
    assetsInlineLimit: 4096
  }
})