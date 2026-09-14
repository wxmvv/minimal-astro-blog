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
  author: 'Astro',
  language: 'zh-cn',
  locale: 'zh-CN',
  siteUrl: 'https://wxmvv.dev',
  siteRepo: 'https://github.com/wxmvv/wxmvv.github.io',
  email: 'wxmvv@outlook.com',
  github: 'https://github.com/wxmvv',
  rssPath: '/rss.xml',
  analytics: {
    // Loaded in production only. Set umamiWebsiteId to '' to disable tracking.
    // umamiAnalytics: {
    //   umamiWebsiteId: '',
    //   src: '',
    // },
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      // https://giscus.app/
      repo: '',
      repositoryId: '',
      category: '',
      categoryId: '',
      mapping: '',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'zh-CN',
    },
  },
  search: {
    // cmdk algolia kbar
    // cmd+k show the search bar
    // Currently supports cmdk. Set provider to '' to disable search.
    provider: 'cmdk',
    cmdkConfig: {
      placeholder: 'Search…',
    },
  },
  trackList: [
    {
      url: '../assets/bg_audio/Nujabes - Beat laments the world.mp3',
      title: 'Nujabes - Beat laments the world',
      tags: ['Metaphorical Music', 'Nujabes'],
    },
    {
      url: '../assets/bg_audio/Nujabes - Letter from Yokosuka.mp3',
      title: 'Nujabes - Letter from Yokosuka',
      tags: ['Metaphorical Music', 'Nujabes'],
    },
    {
      url: '../assets/bg_audio/Nujabes - The Final View.mp3',
      title: 'Nujabes - The Final View',
      tags: ['Metaphorical Music', 'Nujabes'],
    },
  ],
} as const;

export const pageMetadata = {
  home: {
    description: siteMetadata.description,
  },
  blog: {
    title: 'Blog',
    description: 'All published posts.',
  },
  tags: {
    title: 'Tags',
    description: 'Things I blog about',
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
