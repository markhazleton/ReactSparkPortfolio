import { beforeEach, describe, expect, it, vi } from "vitest";
import repositoryFeed from "@/data/repositories.json";
import {
  clearRepositoriesCache,
  fetchRepositoryShowcaseData,
  getRepositoriesCacheInfo,
} from "@/services/RepositoryService";

const mockFetch = (payload: unknown, ok = true, status = 200, statusText = "OK") => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    json: async () => payload,
  } as Response);
};

describe("RepositoryService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("fetches remote data and caches it", async () => {
    mockFetch(repositoryFeed, true);

    const vm = await fetchRepositoryShowcaseData();
    expect(vm.sourceStatus.source).toBe("remote");

    const cacheInfo = getRepositoriesCacheInfo();
    expect(cacheInfo.hasCache).toBe(true);
  });

  it("uses cache when available and fresh", async () => {
    localStorage.setItem("cachedRepositoriesData", JSON.stringify(repositoryFeed));
    localStorage.setItem("repositoriesLastUpdated", new Date().toISOString());
    localStorage.setItem("app_version", "1.0.0");
    localStorage.setItem("repositoriesCacheVersion", "1.0.0");

    global.fetch = vi.fn();

    const vm = await fetchRepositoryShowcaseData();
    expect(vm.sourceStatus.source).toBe("cache");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("falls back to cache when remote fails", async () => {
    localStorage.setItem("cachedRepositoriesData", JSON.stringify(repositoryFeed));
    localStorage.setItem("repositoriesLastUpdated", new Date().toISOString());

    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const vm = await fetchRepositoryShowcaseData(true);
    expect(vm.sourceStatus.source).toBe("cache");
  });

  it("falls back to local feed when remote and cache fail", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    const vm = await fetchRepositoryShowcaseData(true);
    expect(vm.sourceStatus.source).toBe("local");
  });

  it("forces refresh and supports retry-friendly failure handling", async () => {
    localStorage.setItem("cachedRepositoriesData", JSON.stringify(repositoryFeed));
    localStorage.setItem("repositoriesLastUpdated", new Date().toISOString());

    mockFetch(repositoryFeed, true);

    const vm = await fetchRepositoryShowcaseData(true);
    expect(vm.sourceStatus.source).toBe("remote");
  });

  it("clears repository cache", () => {
    localStorage.setItem("cachedRepositoriesData", JSON.stringify(repositoryFeed));
    localStorage.setItem("repositoriesLastUpdated", new Date().toISOString());
    localStorage.setItem("repositoriesCount", "3");
    localStorage.setItem("repositoriesSource", "cache");
    localStorage.setItem("repositoriesCacheVersion", "1.0.0");

    clearRepositoriesCache();

    const cacheInfo = getRepositoriesCacheInfo();
    expect(cacheInfo.hasCache).toBe(false);
  });

  it("rejects invalid remote payload and uses local fallback", async () => {
    mockFetch({ invalid: true }, true);

    const vm = await fetchRepositoryShowcaseData(true);
    expect(vm.sourceStatus.source).toBe("local");
  });
});
