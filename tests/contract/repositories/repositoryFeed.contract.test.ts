import { describe, expect, it } from "vitest";
import repositoryFeed from "@/data/repositories.json";
import { RepositoryFeedSchema } from "@/models/Repository";

describe("repository feed contract", () => {
  it("matches the expected top-level shape", () => {
    expect(() => RepositoryFeedSchema.parse(repositoryFeed)).not.toThrow();
  });

  it("requires metadata generated_at and schema_version", () => {
    const parsed = RepositoryFeedSchema.parse(repositoryFeed);
    expect(parsed.metadata.generated_at).toBeTruthy();
    expect(parsed.metadata.schema_version).toBeTruthy();
  });

  it("provides minimum repository fields used by the showcase", () => {
    const parsed = RepositoryFeedSchema.parse(repositoryFeed);
    expect(parsed.repositories.length).toBeGreaterThan(0);

    for (const repo of parsed.repositories) {
      expect(repo.name).toBeTruthy();
      expect(repo.url).toMatch(/^https:\/\//);
      expect(typeof repo.stars).toBe("number");
      expect(typeof repo.forks).toBe("number");
      expect(repo.updated_at).toBeTruthy();
      expect(repo.pushed_at).toBeTruthy();
    }
  });
});
