const DEFAULT_WORKER_BASE_URL = 'https://1_backend_hono.nestor-adonay-rodriguez-alberto.workers.dev';
const workerBaseUrl = import.meta.env.PUBLIC_WORKER_BASE_URL || DEFAULT_WORKER_BASE_URL;

export type LoginPayload = {
	username: string;
	password: string;
};

export type LoginResponse = {
	success: boolean;
	token?: string;
	message?: string;
	user?: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
	const response = await fetch(`${workerBaseUrl}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error('Credenciales inválidas o servicio no disponible');
	}

	return (await response.json()) as LoginResponse;
}

export async function logout(token?: string): Promise<void> {
	await fetch(`${workerBaseUrl}/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: token ? JSON.stringify({ token }) : undefined,
	});
}
