import type { Config } from 'prettier';

export default {
  plugins: ['prettier-plugin-astro'],
  tabWidth: 2,
  printWidth: 100,
  endOfLine: 'lf',
  trailingComma: 'all',
  htmlWhitespaceSensitivity: 'css',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        useTabs: false,
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
} satisfies Config;
