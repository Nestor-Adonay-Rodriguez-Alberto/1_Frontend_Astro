/* Welcome page session display */
(function initWelcomePage() {
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

	const session = readSession();
	if (!session) {
		window.location.replace('/');
		return;
	}

	const usernameEl = document.querySelector('[data-username]');
	const strategyEl = document.querySelector('[data-strategy]');
	const loginAtEl = document.querySelector('[data-login-at]');

	if (usernameEl) usernameEl.textContent = session.username;
	if (strategyEl) {
		strategyEl.textContent =
			session.strategy === 'basic'
				? 'Basic Auth (/auth/login-basic)'
				: 'JSON Body (/auth/login)';
	}
	if (loginAtEl) loginAtEl.textContent = new Date(session.loginAt).toLocaleString();
})();
