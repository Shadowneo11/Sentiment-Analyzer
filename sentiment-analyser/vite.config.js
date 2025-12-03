import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: "sentiment-analyser",
  base: "/Sentiment-Analyzer/",
  plugins: [react()],
})
