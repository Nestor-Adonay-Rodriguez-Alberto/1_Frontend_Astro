import { readSession, clearSession } from '../lib/session.ts';

const messageEl = document.querySelector<HTMLElement>('[data-message]');

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
