import { readSession } from '../lib/session.ts';

const session = readSession();

if (!session) {
	window.location.replace('/');
} else {
	const usernameEl = document.querySelector<HTMLElement>('[data-username]');
	const strategyEl = document.querySelector<HTMLElement>('[data-strategy]');
	const loginAtEl = document.querySelector<HTMLElement>('[data-login-at]');

	if (usernameEl) {
		usernameEl.textContent = session.username;
	}

	if (strategyEl) {
		strategyEl.textContent =
			session.strategy === 'basic'
				? 'Basic Auth (/auth/login-basic)'
				: 'JSON Body (/auth/login)';
	}

	if (loginAtEl) {
		loginAtEl.textContent = new Date(session.loginAt).toLocaleString();
	}
}
