import { describe, expect, it } from "vitest";
import {
  exportToCsv,
  exportToJson,
  fetchAllSongs,
  searchSongs,
  sortSongs,
} from "../../../src/services/SongService";

describe("SongService", () => {
  it("loads and validates songs from CSV", async () => {
    const songs = await fetchAllSongs();
    expect(songs.length).toBeGreaterThan(0);
    expect(songs[0].title.length).toBeGreaterThan(0);
  });

  it("filters songs by query", async () => {
    const songs = await fetchAllSongs();
    const firstChannel = songs[0].channel;
    const result = searchSongs(songs, firstChannel);
    expect(result.length).toBeGreaterThan(0);
  });

  it("sorts songs by view count", async () => {
    const songs = await fetchAllSongs();
    const sorted = sortSongs(songs, "viewCount", "desc");
    expect(sorted[0].viewCount).toBeGreaterThanOrEqual(sorted[1].viewCount);
  });

  it("exports csv and json", async () => {
    const songs = await fetchAllSongs();
    const sample = songs.slice(0, 2);
    expect(exportToCsv(sample)).toContain("rank,title,channel,views,duration");
    expect(exportToJson(sample)).toContain('"rank"');
  });
});
