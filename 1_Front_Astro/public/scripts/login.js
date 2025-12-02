/* Login form handler served from /public */
(function initLoginForm() {
	const STORAGE_KEY = 'astro-auth-session';

	const form = document.querySelector('#login-form');
	const workerBaseUrl =
		(form?.dataset.workerUrl && String(form.dataset.workerUrl)) ||
		'https://1_backend_hono.nestor-adonay-rodriguez-alberto.workers.dev';
	const statusElem = document.querySelector('[data-status]');
	const submitButton = form ? form.querySelector('button') : null;
	if (!form) return;

	const setStatus = (message, variant = 'default') => {
		if (!statusElem) return;
		statusElem.textContent = message;
		statusElem.dataset.variant = variant;
	};

	const saveSession = (data) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (error) {
			console.warn('No se pudo guardar la sesión', error);
		}
	};

	const encodeBasic = (username, password) => btoa(`${username}:${password}`);

	const parseResponse = async (response) => {
		let data;
		try {
			data = await response.json();
		} catch (error) {
			data = { ok: false, message: 'Respuesta inesperada del Worker' };
		}
		if (!response.ok || !data?.ok) {
			throw new Error(data?.message || 'Credenciales inválidas o servicio no disponible');
		}
		return data;
	};

	const loginWithJson = (payload) =>
		fetch(`${workerBaseUrl}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		}).then(parseResponse);

	const loginWithBasic = (payload) =>
		fetch(`${workerBaseUrl}/auth/login-basic`, {
			method: 'POST',
			headers: { Authorization: `Basic ${encodeBasic(payload.username, payload.password)}` },
		}).then(parseResponse);

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const formData = new FormData(form);
		const username = String(formData.get('username'));
		const password = String(formData.get('password'));
		const mode = formData.get('mode') === 'basic' ? 'basic' : 'json';

		setStatus('Validando credenciales…', 'info');
		submitButton?.setAttribute('disabled', 'true');

		try {
			await (mode === 'basic'
				? loginWithBasic({ username, password })
				: loginWithJson({ username, password }));

			saveSession({ username, loginAt: new Date().toISOString(), strategy: mode });
			setStatus('Ingreso exitoso, redirigiendo…', 'success');
			window.location.href = '/welcome';
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Error inesperado';
			setStatus(message, 'error');
		} finally {
			submitButton?.removeAttribute('disabled');
		}
	});
})();
