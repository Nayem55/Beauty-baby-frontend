import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { host: true, port: 1008, strictPort: true, proxy: { '/api': 'http://127.0.0.1:1009', '/uploads': 'http://127.0.0.1:1009' } }, build: { chunkSizeWarningLimit: 800 } });
