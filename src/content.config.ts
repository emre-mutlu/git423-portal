import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const weeksCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/weeks" }),
  schema: z.object({
    hafta: z.number(),
    baslik: z.string(),
    ozet: z.string().optional(),
    isPublished: z.boolean().default(false),
    teslim_tarihi_sube1: z.string().optional(),
    teslim_tarihi_sube2: z.string().optional(),
    github_classroom_sube1: z.string().url().optional(),
    github_classroom_sube2: z.string().url().optional(),
  }),
});

const announcementsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/announcements" }),
  schema: z.object({
    baslik: z.string(),
    tarih: z.date(),
    sube: z.enum(['Tümü', 'Şube 1', 'Şube 2']).default('Tümü'),
  }),
});

const resourcesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{json,yaml}", base: "./src/content/resources" }),
  schema: z.object({
    baslik: z.string(),
    kategori: z.string(),
    linkler: z.array(z.object({
      ad: z.string(),
      url: z.string().url(),
      aciklama: z.string().optional()
    }))
  }),
});

export const collections = {
  'weeks': weeksCollection,
  'announcements': announcementsCollection,
  'resources': resourcesCollection,
};
