// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { siteMetadata } from '@data/config/site';

import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginLanguageBadge } from 'expressive-code-language-badge';

// https://astro.build/config
export default defineConfig({
  site: siteMetadata.siteUrl,
  trailingSlash: 'always',
  integrations: [
    expressiveCode({
      themes: ['one-dark-pro', 'one-light'], // dark light
      plugins: [pluginLineNumbers(), pluginLanguageBadge()],
    }),
    mdx(),
    sitemap(),
    react(),
  ],
  markdown: {},
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson',
      cssVariable: '--font-atkinson',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/atkinson-regular.woff'],
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/atkinson-bold.woff'],
            weight: 700,
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
