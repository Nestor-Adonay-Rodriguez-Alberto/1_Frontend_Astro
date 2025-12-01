// @ts-check
import { login } from '../lib/api.ts';
import { saveSession } from '../lib/session.ts';

/**
 * @typedef {'default' | 'info' | 'success' | 'error'} StatusVariant
 */

/** @type {HTMLFormElement | null} */
const form = document.querySelector('#login-form');
/** @type {(HTMLElement & { dataset: DOMStringMap & { variant?: StatusVariant } }) | null} */
const statusElem = document.querySelector('[data-status]');
/** @type {HTMLButtonElement | null} */
const submitButton = form ? form.querySelector('button') : null;

/**
 * @param {string} message
 * @param {StatusVariant} [variant]
 */
function setStatus(message, variant = 'default') {
	if (!statusElem) return;
	statusElem.textContent = message;
	statusElem.dataset.variant = variant;
}

form?.addEventListener('submit', async (event) => {
	event.preventDefault();
	if (!form) return;
	const formData = new FormData(form);
	const username = String(formData.get('username'));
	const password = String(formData.get('password'));

	setStatus('Validando credenciales…', 'info');
	submitButton?.setAttribute('disabled', 'true');

	try {
		const mode = formData.get('mode') === 'basic' ? 'basic' : 'json';
		const result = await login({ username, password }, mode);
		if (!result.success) {
			throw new Error(result.message || 'No se pudo iniciar sesión');
		}

		saveSession({
			username,
			loginAt: new Date().toISOString(),
			strategy: result.strategy,
		});

		setStatus('Ingreso exitoso, redirigiendo…', 'success');
		window.location.href = '/welcome';
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Error inesperado';
		setStatus(message, 'error');
	} finally {
		submitButton?.removeAttribute('disabled');
	}
});
