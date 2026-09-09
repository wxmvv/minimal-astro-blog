export interface NavigationLink {
  href: string;
  label: string;
}

export const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Blog' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
] as const satisfies readonly NavigationLink[];
