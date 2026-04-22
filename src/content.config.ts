import { defineCollection } from "astro:content";
import { z } from "astro/zod"
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github: z.url(),
    tech: z.array(z.string()),
    featured: z.boolean().optional(),
    date: z.string(),
    image: z.string(),
  })
});

export const collections = { projects, };