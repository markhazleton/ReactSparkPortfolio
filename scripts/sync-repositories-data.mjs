import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const outputPath = path.join(workspaceRoot, ".build", "data", "repositories.json");
const sourceUrl = process.env.REPOSITORIES_FEED_URL || "https://markhazleton.com/repositories.json";

const isValidFeed = (payload) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (!payload.profile || typeof payload.profile !== "object") {
    return false;
  }

  if (!Array.isArray(payload.repositories)) {
    return false;
  }

  if (!payload.metadata || typeof payload.metadata !== "object") {
    return false;
  }

  return true;
};

const run = async () => {
  console.log(`Syncing repositories data from ${sourceUrl}`);

  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories feed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();

  if (!isValidFeed(payload)) {
    throw new Error("Fetched repositories feed is missing required profile/repositories/metadata shape.");
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote fresh repositories build artifact to ${outputPath}`);
};

run().catch((error) => {
  console.error("Repository sync failed:", error.message);
  process.exit(1);
});
