## Astro + Cloudflare Worker Auth Demo

Pequeño frontend creado con Astro que consume un Worker de Cloudflare (Hono) con dos endpoints:

- `POST /auth/login` recibe `username` y `password` en un cuerpo JSON
- `POST /auth/login-basic` espera el header `Authorization: Basic …`

El sitio expone tres rutas:

| Ruta | Descripción |
| --- | --- |
| `/` | Formulario de inicio de sesión que permite alternar entre JSON y Basic Auth |
| `/welcome` | Página protegida que recuerda usuario, hora y modo utilizado |
| `/logout` | Elimina la sesión local (no hace falta endpoint remoto) |

## Configurar variables

1. Duplica el archivo `.env.example` como `.env`.
2. Ajusta `PUBLIC_WORKER_BASE_URL` para que apunte al dominio de tu Worker.

> Las variables que inician con `PUBLIC_` quedan disponibles tanto en el servidor como en el navegador, lo cual permite que las peticiones `fetch` del cliente llamen al Worker directamente.

## Scripts disponibles

| Comando | Acción |
| --- | --- |
| `npm install` | Instala dependencias |
| `npm run dev` | Inicia el servidor de desarrollo (`localhost:4321`) |
| `npm run build` | Genera `dist/` listo para producción |
| `npm run preview` | Sirve el build localmente |

## Flujo de despliegue sugerido

1. Commitea el proyecto en GitHub.
2. En Cloudflare Pages crea un proyecto nuevo apuntando al repo y deja el build command por defecto (`npm run build`).
3. Define la variable `PUBLIC_WORKER_BASE_URL` en Settings → Environment Variables.
4. (Opcional) Configura una regla de enrutamiento para proxy inverso (`/api/*`) hacia el Worker si no quieres exponer el dominio completo en el cliente.

Eso es todo. Conecta tu Worker existente desplegado vía Wrangler y tendrás un flujo básico de autenticación listo para extender.
