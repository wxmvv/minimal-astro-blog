import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { siteMetadata } from '@data/config/site';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: siteMetadata.title,
    description: siteMetadata.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
