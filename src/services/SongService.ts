import csvRaw from "../data/youtube-top-100-songs-2025.csv?raw";
import { Song, SongArraySchema, SongSortColumn, SortDirection } from "../models/Song";

let cachedSongs: Song[] | null = null;

const parseNumber = (value: string): number => {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toOptionalText = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const formatViewCount = (viewCount: number): string => {
  if (viewCount >= 1_000_000_000) {
    return `${(viewCount / 1_000_000_000).toFixed(1)}B`;
  }
  if (viewCount >= 1_000_000) {
    return `${(viewCount / 1_000_000).toFixed(1)}M`;
  }
  if (viewCount >= 1_000) {
    return `${(viewCount / 1_000).toFixed(1)}K`;
  }
  return `${viewCount}`;
};

const parseCsv = (raw: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const next = raw[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
};

const toSong = (headers: string[], values: string[], rank: number): Song => {
  const map = Object.fromEntries(
    headers.map((header, index) => [header.trim(), values[index] ?? ""])
  );

  const viewCount = parseNumber(map.view_count ?? "0");
  const durationSeconds = parseNumber(map.duration ?? "0");

  return {
    rank,
    title: (map.title ?? "").trim(),
    fullTitle: toOptionalText(map.fulltitle ?? ""),
    description: toOptionalText(map.description ?? ""),
    viewCount,
    viewCountFormatted: formatViewCount(viewCount),
    duration: toOptionalText(map.duration_string ?? ""),
    durationSeconds: durationSeconds > 0 ? durationSeconds : undefined,
    channel: (map.channel ?? "").trim(),
    channelUrl: toOptionalText(map.channel_url ?? ""),
    channelFollowerCount: parseNumber(map.channel_follower_count ?? "0") || undefined,
    categories: toOptionalText(map.categories ?? ""),
    tags: toOptionalText(map.tags ?? ""),
    liveStatus: toOptionalText(map.live_status ?? ""),
    thumbnail: toOptionalText(map.thumbnail ?? ""),
  };
};

export const fetchAllSongs = async (): Promise<Song[]> => {
  if (cachedSongs) {
    return cachedSongs;
  }

  const rows = parseCsv(csvRaw);
  if (rows.length < 2) {
    cachedSongs = [];
    return cachedSongs;
  }

  const headers = rows[0];
  const parsed = rows
    .slice(1)
    .filter((row) => row.some((value) => value.trim().length > 0))
    .map((row, index) => toSong(headers, row, index + 1));

  cachedSongs = SongArraySchema.parse(parsed);
  return cachedSongs;
};

export const getSongById = async (id: number): Promise<Song | null> => {
  const songs = await fetchAllSongs();
  return songs.find((song) => song.rank === id) ?? null;
};

export const searchSongs = (songs: Song[], query: string): Song[] => {
  if (!query.trim()) {
    return songs;
  }

  const needle = query.toLowerCase();
  return songs.filter((song) => {
    const haystack = [song.title, song.channel, song.categories ?? "", song.tags ?? ""].join(" ");
    return haystack.toLowerCase().includes(needle);
  });
};

export const sortSongs = (
  songs: Song[],
  column: SongSortColumn,
  direction: SortDirection
): Song[] => {
  const sorted = [...songs].sort((left, right) => {
    if (column === "rank") {
      return left.rank - right.rank;
    }
    if (column === "title") {
      return left.title.localeCompare(right.title);
    }
    if (column === "channel") {
      return left.channel.localeCompare(right.channel);
    }
    if (column === "viewCount") {
      return left.viewCount - right.viewCount;
    }
    return (left.durationSeconds ?? 0) - (right.durationSeconds ?? 0);
  });

  return direction === "asc" ? sorted : sorted.reverse();
};

const csvEscape = (value: string): string => {
  if (/[,"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportToCsv = (songs: Song[]): string => {
  const headers = ["rank", "title", "channel", "views", "duration"];
  const lines = songs.map((song) =>
    [song.rank.toString(), song.title, song.channel, song.viewCount.toString(), song.duration ?? ""]
      .map(csvEscape)
      .join(",")
  );

  return [headers.join(","), ...lines].join("\n");
};

export const exportToJson = (songs: Song[]): string => {
  return JSON.stringify(songs, null, 2);
};
