/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base relativa: a demo funciona em hospedagem estática e em subdiretório (ex.: GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
