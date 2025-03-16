import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // Ensures correct asset paths for S3 deployment
  build: {
    outDir: 'dist'
  }
});
