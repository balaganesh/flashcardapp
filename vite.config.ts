import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // <-- IMPORT THE PLUGIN

export default defineConfig(({ mode }) => {
    // This loads environment variables, but we will rely on the Cloud Build step
    // to pass the key during the build. This part is fine.
    const env = loadEnv(mode, '.', '');

    return {
      // Add the plugins array with the React plugin
      plugins: [react()],

      // Add the base property to fix the 404 errors for assets
      base: './',

      // Your existing `define` and `resolve` configuration is good
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
