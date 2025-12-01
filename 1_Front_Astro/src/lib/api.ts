const DEFAULT_WORKER_BASE_URL = 'https://1_backend_hono.nestor-adonay-rodriguez-alberto.workers.dev';
const workerBaseUrl = import.meta.env.PUBLIC_WORKER_BASE_URL || DEFAULT_WORKER_BASE_URL;

export type LoginPayload = {
	username: string;
	password: string;
};

type WorkerLoginResponse = {
	ok: boolean;
	message?: string;
};

export type LoginResponse = {
	success: boolean;
	message?: string;
	strategy: 'json' | 'basic';
};

async function parseResponse(response: Response): Promise<WorkerLoginResponse> {
	let data: WorkerLoginResponse | null = null;
	try {
		data = (await response.json()) as WorkerLoginResponse;
	} catch (error) {
		data = { ok: false, message: 'Respuesta inesperada del Worker' };
	}

	if (!response.ok) {
		throw new Error(data?.message || 'Credenciales inválidas o servicio no disponible');
	}

	return data;
}

export async function loginWithJson(payload: LoginPayload): Promise<LoginResponse> {
	const response = await fetch(`${workerBaseUrl}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	const data = await parseResponse(response);
	return { success: data.ok, message: data.message, strategy: 'json' };
}

function encodeBasicCredentials(username: string, password: string): string {
	if (typeof btoa === 'function') {
		return btoa(`${username}:${password}`);
	}

	if (typeof Buffer !== 'undefined') {
		return Buffer.from(`${username}:${password}`, 'binary').toString('base64');
	}

	throw new Error('Tu entorno no soporta codificación Base64 requerida para Basic Auth');
}

export async function loginWithBasic(payload: LoginPayload): Promise<LoginResponse> {
	const response = await fetch(`${workerBaseUrl}/auth/login-basic`, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encodeBasicCredentials(payload.username, payload.password)}`,
		},
	});

	const data = await parseResponse(response);
	return { success: data.ok, message: data.message, strategy: 'basic' };
}

export async function login(payload: LoginPayload, mode: 'json' | 'basic' = 'json'): Promise<LoginResponse> {
	return mode === 'basic' ? loginWithBasic(payload) : loginWithJson(payload);
}
