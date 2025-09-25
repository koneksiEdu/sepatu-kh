// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // ...
  output: 'server',
  integrations: [vue()],
  adapter: vercel(),
});