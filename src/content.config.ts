import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blankAsMissing, stringList } from './utils/content-schema';

const blog = defineCollection({
  loader: glob({ base: './data/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().trim().min(1),
      pubDate: blankAsMissing(z.coerce.date()),
      updatedDate: blankAsMissing(z.coerce.date().optional()),
      description: blankAsMissing(z.string().optional()),
      comments: blankAsMissing(z.boolean().default(true)),
      authors: stringList(['default']),
      heroImage: blankAsMissing(image().optional()),
      postLayout: blankAsMissing(z.string().default('Blog')),
      tags: stringList(),
      categories: stringList(),
      draft: blankAsMissing(z.boolean().default(false)),
      homepage: blankAsMissing(z.boolean().default(false)),
      homepageOrder: blankAsMissing(z.number().optional()),
      homepageMedia: blankAsMissing(
        z.union([z.string().regex(/^\.{1,2}\/.*\.(mp4|webm|ogg)$/i), image()]).optional(),
      ),
    }),
});

const about = defineCollection({
  loader: glob({ base: './data/about', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string().trim().min(1),
    avatar: blankAsMissing(z.string().optional()),
    occupation: blankAsMissing(z.string().optional()),
    company: blankAsMissing(z.string().optional()),
    email: blankAsMissing(z.email().optional()),
    twitter: blankAsMissing(z.url().optional()),
    linkedin: blankAsMissing(z.url().optional()),
    github: blankAsMissing(z.url().optional()),
  }),
});

export const collections = { blog, about };
