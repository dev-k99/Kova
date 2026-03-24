/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
  readonly VITE_USD_TO_ZAR_RATE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
