import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: '0.0.0.0', // supaya bisa diakses dari luar (nginx/domain)
    port: 5550,

    allowedHosts: [
      'gemilang.beeasy.id',
      'maqlubah-api.beeasy.id'
    ]
  },

  preview: {
    host: '0.0.0.0',
    port: 5550,
    allowedHosts: [
      'gemilang.beeasy.id',
      'maqlubah-api.beeasy.id'
    ]
  }
})