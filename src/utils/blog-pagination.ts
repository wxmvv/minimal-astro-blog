import { getCollection } from 'astro:content';

export const BLOG_PAGE_SIZE = 10;

export const blogPageUrl = (page: number) => (page === 1 ? '/blog/' : `/blog/page/${page}/`);

export async function getBlogPages() {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id),
  );
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));

  return Array.from({ length: totalPages }, (_, index) => ({
    posts: posts.slice(index * BLOG_PAGE_SIZE, (index + 1) * BLOG_PAGE_SIZE),
    currentPage: index + 1,
    totalPages,
  }));
}
