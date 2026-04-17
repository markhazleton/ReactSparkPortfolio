const axios = require("axios");

const ALLOWED_ORIGINS = [
  "https://bootstrapspark.markhazleton.com",
  "https://markhazleton.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const REPOSITORY_SOURCE_URL = "https://markhazleton.com/repositories.json";

module.exports = async function (context, req) {
  context.log("Processing repositories proxy request");

  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const baseHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "false",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    context.res = {
      status: 200,
      headers: baseHeaders,
    };
    return;
  }

  try {
    const response = await axios.get(REPOSITORY_SOURCE_URL, {
      timeout: 8000,
      headers: {
        "User-Agent": "BootstrapSpark/1.0 Repository-Proxy",
        Accept: "application/json",
      },
    });

    const payload = response.data;
    const hasMinimumShape =
      payload && payload.profile && Array.isArray(payload.repositories) && payload.metadata;

    if (!hasMinimumShape) {
      throw new Error("Repository feed does not contain profile/repositories/metadata");
    }

    context.res = {
      status: 200,
      headers: baseHeaders,
      body: payload,
    };
  } catch (error) {
    context.log.error("Error fetching repositories:", error.message);

    context.res = {
      status: 502,
      headers: baseHeaders,
      body: {
        error: "Failed to retrieve repository feed",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }
};
