import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  preview: { host: '0.0.0.0', port: 6464, strictPort: true,
    proxy: {
      '/api': {
        target: 'https://agent.mck.aidendigital.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  server: { host: '0.0.0.0', port: 6464, strictPort: true,
    proxy: {
      '/api': {
        target: 'https://agent.mck.aidendigital.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
