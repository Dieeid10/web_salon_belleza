// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema: {
      PUBLIC_SUPABASE_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
      }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_API_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
      }),
    },
  },
});