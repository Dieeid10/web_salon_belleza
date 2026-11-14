# Salón Web

Frontend del sistema del salón construido con Astro. La ruta de activación de
cuentas invitadas por la dueña está en `/auth/callback`.

## Requisitos

- Node.js compatible con la versión indicada en `package.json`.
- pnpm.
- Proyecto Supabase Auth con las invitaciones por email habilitadas.

## Configuración local

Crea `web/.env` a partir de `.env.example` y configura la URL del mismo proyecto
Supabase que utiliza `app_mvc`:

```dotenv
PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<public-anon-key>
```

Solo se usan la URL y la clave publicable. **No agregues la `service_role`, una
contraseña, ni otra clave secreta a variables `PUBLIC_`**: Astro las incluye en
el código disponible al navegador.

Instala dependencias e inicia Astro desde esta carpeta:

```sh
pnpm install
pnpm dev
```

El servidor local queda normalmente en `http://localhost:4321`.

## Callback de invitaciones

El backend invita al vendedor mediante Supabase Admin y configura el redirect
con `SUPABASE_INVITE_REDIRECT_URL`. En desarrollo debe apuntar a:

```text
http://localhost:4321/auth/callback
```

Agrega esa dirección a la lista de **Redirect URLs** permitidas en la
configuración de Supabase Auth. En producción, configura en el backend la URL
pública desplegada, por ejemplo `https://<dominio>/auth/callback`, y permite
esa misma dirección en Supabase.

Al aceptar la invitación, Supabase redirige al navegador con una sesión temporal.
La página procesa el token en el navegador (el fragmento `#...` de una URL no
se envía al servidor), elimina los tokens temporales de la barra de direcciones
y permite establecer la contraseña. Después, el vendedor puede iniciar sesión
con email y contraseña desde la aplicación de escritorio.

Si aparece “El enlace no contiene una invitación válida o ya venció”, solicita
una invitación nueva. No publiques ni compartas la URL completa de invitación:
contiene credenciales temporales.

## Scripts

| Comando | Acción |
| --- | --- |
| `pnpm dev` | Inicia Astro para desarrollo. |
| `pnpm build` | Compila el sitio en `dist/`. |
| `pnpm preview` | Sirve localmente la compilación. |

## Seguridad

- `.env` contiene configuración local y no debe subirse al repositorio.
- La clave `PUBLIC_SUPABASE_ANON_KEY` es publicable, pero debe tener las
	políticas RLS correctamente configuradas.
- La clave `SUPABASE_SERVICE_ROLE_KEY` solo vive en el backend MVC. Nunca se
	utiliza ni se copia al frontend.
- Si se expuso un token de invitación, una contraseña o una clave secreta,
	revócala o rótala.
