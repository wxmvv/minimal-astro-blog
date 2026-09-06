import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/mdx/container-renderer';
import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';
import { siteMetadata } from '@data/config/site';

const escapeXml = (value) =>
  String(value).replace(/[<>&"']/g, (character) => {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[character];
  });

export async function GET(context) {
  const site = context.site ?? new URL(siteMetadata.siteUrl);
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const editor = `${siteMetadata.email} (${siteMetadata.author})`;
  const lastBuildDate = posts.length
    ? new Date(Math.max(...posts.map(({ data }) => (data.updatedDate ?? data.pubDate).valueOf())))
    : undefined;
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const items = [];

  for (const post of posts) {
    const link = new URL(`/blog/${post.id}/`, site).href;
    const { Content } = await render(post);
    const html = await container.renderToString(Content, { request: new Request(link) });
    const content = sanitizeHtml(html, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
      transformTags: {
        '*': (tagName, attributes) => {
          for (const attribute of ['href', 'src']) {
            if (attributes[attribute]) {
              attributes[attribute] = new URL(attributes[attribute], link).href;
            }
          }
          return { tagName, attribs: attributes };
        },
      },
    });

    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link,
      content,
      author: editor,
      categories: [...new Set([...post.data.tags, ...post.data.categories])],
      commentsUrl: post.data.comments ? `${link}#comments` : undefined,
    });
  }

  return rss({
    title: siteMetadata.title,
    description: siteMetadata.description,
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<link>${escapeXml(new URL('/blog/', site).href)}</link>`,
      `<language>${escapeXml(siteMetadata.language)}</language>`,
      `<managingEditor>${escapeXml(editor)}</managingEditor>`,
      `<webMaster>${escapeXml(editor)}</webMaster>`,
      lastBuildDate ? `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>` : '',
      `<atom:link href="${escapeXml(new URL(siteMetadata.rssPath, site).href)}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    items,
  });
}
