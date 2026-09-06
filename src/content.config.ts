import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './data/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      description: z.string().optional(),
      comments: z.boolean().default(true),
      authors: z.array(z.string()).default(['default']),
      heroImage: z.optional(image()),
      layout: z.string().default('Blog'),
      tags: z.array(z.string()).default([]),
      categories: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      homepage: z.boolean().default(false),
      homepageOrder: z.number().optional(),
      homepageMedia: z
        .union([z.string().regex(/^\.{1,2}\/.*\.(mp4|webm|ogg)$/i), image()])
        .optional(),
    }), 
});

const about = defineCollection({
  loader: glob({ base: './data/about', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    email: z.email().optional(),
    twitter: z.url().optional(),
    linkedin: z.url().optional(),
    github: z.url().optional(),
  }),
});

export const collections = { blog, about };
