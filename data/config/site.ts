export interface PageMeta {
  title?: string;
  description?: string;
  image?: URL | string;
  canonical?: URL | string;
  type?: 'article' | 'website';
  noIndex?: boolean;
  publishedTime?: Date;
  updatedTime?: Date;
}

export const siteMetadata = {
  title: 'minimal-astro-blog',
  subtitle: 'A minimal blog template for Astro',
  description: 'Welcome to my website!',
  author: 'wxm',
  language: 'zh-cn',
  locale: 'zh-CN',
  siteUrl: 'https://wxmvv.dev',
  siteRepo: 'https://github.com/wxmvv/wxmvv.github.io',
  email: 'wxmvv@outlook.com',
  github: 'https://github.com/wxmvv',
  rssPath: '/rss.xml',
} as const;

export const pageMetadata = {
  home: {
    description: siteMetadata.description,
  },
  blog: {
    title: 'Blog',
    description: 'All published posts.',
  },
  about: {
    title: 'About',
    description: `About ${siteMetadata.author}.`,
    type: 'website',
  },
  projects: {
    title: 'Projects',
    description: 'Things I have built or recommend.',
  },
} satisfies Record<string, PageMeta>;
