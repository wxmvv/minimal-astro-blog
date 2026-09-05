export interface Project {
  title: string;
  description: string;
  href?: string;
  /** Local image path relative to this config file, e.g. '../assets/google.png'. */
  image?: string;
  tag?: string;
  year?: string;
}

export const projects: readonly Project[] = [
  {
    title: 'Google',
    description:
      "What if you could look up any information in the world? Google has many features to help you find exactly what you're looking for.",
    image: '../assets/google.png',
    href: 'https://www.google.com',
    tag: 'Search Engine',
    year: '2026',
  },
  {
    title: 'Google without a link',
    description:
      "What if you could look up any information in the world? Google has many features to help you find exactly what you're looking for.",
    image: '../assets/google.png',
    year: '2025',
  },
  {
    title: 'Google without image',
    description:
      "What if you could look up any information in the world? Google has many features to help you find exactly what you're looking for.",
    href: 'https://www.google.com',
    year: '2024',
  },
];
