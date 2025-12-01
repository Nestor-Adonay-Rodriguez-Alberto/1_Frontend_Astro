// @ts-check
import { readSession } from '../lib/session.ts';

const session = readSession();

if (!session) {
	window.location.replace('/');
} else {
	/** @type {HTMLElement | null} */
	const usernameEl = document.querySelector('[data-username]');
	/** @type {HTMLElement | null} */
	const strategyEl = document.querySelector('[data-strategy]');
	/** @type {HTMLElement | null} */
	const loginAtEl = document.querySelector('[data-login-at]');

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
