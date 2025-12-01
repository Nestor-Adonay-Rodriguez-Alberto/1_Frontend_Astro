/// <reference types="astro/client" />

declare namespace App {}

interface ImportMetaEnv {
	readonly PUBLIC_WORKER_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
