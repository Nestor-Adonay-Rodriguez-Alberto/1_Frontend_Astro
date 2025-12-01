// @ts-check
import { readSession, clearSession } from '../lib/session.ts';

/** @type {HTMLElement | null} */
const messageEl = document.querySelector('[data-message]');

const session = readSession();
if (!session) {
	if (messageEl) {
		messageEl.textContent = 'No había una sesión activa.';
	}
} else {
	clearSession();
	if (messageEl) {
		messageEl.textContent = 'Sesión local eliminada. Puedes volver a iniciar cuando gustes.';
	}
}
