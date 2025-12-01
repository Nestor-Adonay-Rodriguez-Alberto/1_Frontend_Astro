import { login } from '../lib/api.ts';
import { saveSession } from '../lib/session.ts';

type StatusVariant = 'default' | 'info' | 'success' | 'error';

type StatusElement = HTMLElement & { dataset: DOMStringMap & { variant?: StatusVariant } };

const form = document.querySelector<HTMLFormElement>('#login-form');
const statusElem = document.querySelector<StatusElement>('[data-status]');
const submitButton = form?.querySelector<HTMLButtonElement>('button');

function setStatus(message: string, variant: StatusVariant = 'default') {
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
