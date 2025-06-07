import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // <-- 1. IMPORT THE REACT PLUGIN

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 2. ADD THE PLUGINS ARRAY WITH REACT
      plugins: [react()],

      // 3. ADD THE BASE PROPERTY FOR CORRECT ASSET PATHS
      base: './',

      // --- Your existing configuration below ---
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
