import { z } from "zod";

const optionalText = z.string().trim().optional();

export const SongSchema = z.object({
  rank: z.number().int().positive(),
  title: z.string().trim().min(1),
  fullTitle: optionalText,
  description: optionalText,
  viewCount: z.number().int().nonnegative(),
  viewCountFormatted: z.string().trim().min(1),
  duration: optionalText,
  durationSeconds: z.number().int().nonnegative().optional(),
  channel: z.string().trim().min(1),
  channelUrl: z.string().url().optional(),
  channelFollowerCount: z.number().int().nonnegative().optional(),
  categories: optionalText,
  tags: optionalText,
  liveStatus: optionalText,
  thumbnail: z.string().url().optional(),
});

export const SongArraySchema = z.array(SongSchema);

export type Song = z.infer<typeof SongSchema>;
export type SongSortColumn = "rank" | "title" | "channel" | "viewCount" | "durationSeconds";
export type SortDirection = "asc" | "desc";
