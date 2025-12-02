/* Logout page controller */
(function initLogoutPage() {
	const STORAGE_KEY = 'astro-auth-session';

	const readSession = () => {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw);
		} catch (error) {
			localStorage.removeItem(STORAGE_KEY);
			return null;
		}
	};

	const clearSession = () => localStorage.removeItem(STORAGE_KEY);

	const messageEl = document.querySelector('[data-message]');
	const session = readSession();

	if (!session) {
		if (messageEl) messageEl.textContent = 'No había una sesión activa.';
		return;
	}

	clearSession();
	if (messageEl) {
		messageEl.textContent = 'Sesión local eliminada. Puedes volver a iniciar cuando gustes.';
	}
})();
