import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@ant-design/icons'],
    include: ['classnames', 'react-is'], // ✅ aquí están ambos en el mismo array
  },
})
