export type SessionData = {
	token: string;
	username: string;
	loginAt: string;
};

const STORAGE_KEY = 'astro-auth-session';

export function saveSession(data: SessionData) {
	if (typeof window === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function readSession(): SessionData | null {
	if (typeof window === 'undefined') return null;
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as SessionData;
	} catch (error) {
		localStorage.removeItem(STORAGE_KEY);
		return null;
	}
}

export function clearSession() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem(STORAGE_KEY);
}
