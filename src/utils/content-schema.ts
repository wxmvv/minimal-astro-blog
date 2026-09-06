import { z } from 'astro/zod';

const isBlank = (value: unknown) =>
  value === null || (typeof value === 'string' && value.trim() === '');

// Normalize before parsing so optional fields and defaults also accept empty YAML values.
export const blankAsMissing = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (isBlank(value) ? undefined : value), schema);

export const stringList = (fallback: string[] = []) =>
  z.preprocess(
    (value) => {
      if (isBlank(value)) return undefined;
      if (!Array.isArray(value)) return value;
      const items = value.filter((item) => !isBlank(item));
      return items.length ? items : undefined;
    },
    z.array(z.string().trim().min(1)).default(fallback),
  );
