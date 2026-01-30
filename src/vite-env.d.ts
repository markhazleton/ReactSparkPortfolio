/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SIGNALR_HUB_URL?: string;
  readonly VITE_BASE_URL?: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
