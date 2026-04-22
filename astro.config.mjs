// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layout': fileURLToPath(new URL('./src/layout', import.meta.url)),
        '@public': fileURLToPath(new URL('./public', import.meta.url)),
        '@images': fileURLToPath(new URL('./public/images', import.meta.url)),
        '@icons': fileURLToPath(new URL('./public/icons', import.meta.url)),
      }
    }

  }
});
