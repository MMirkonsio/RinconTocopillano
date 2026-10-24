# Rincón Tocopillano

Red social / marketplace local: publicaciones con imagen y precio, comentarios con respuestas,
votos, guardados, categorías y perfiles.

- `Backend/`: API en Express 5 + MySQL (puerto 3000).
- `FrontEnd/`: React 19 + React Router 7 + Vite 8 + Tailwind CSS 4 (puerto 5173).

## Requisitos

- Node.js 20.19 o superior
- MySQL 8 (o MariaDB 10.6+)

## Estructura del backend

```
Backend/
├── index.js                 arranca el servidor
├── database/rinconbd.sql    esquema y datos de ejemplo
├── uploads/                 imágenes subidas
└── src/
    ├── app.js               middlewares generales (helmet, CORS, sesión, estáticos)
    ├── config.js            lee el .env
    ├── db.js                pool de MySQL
    ├── routes/index.js      todas las URLs de la API
    ├── controllers/         lógica de cada recurso (auth, perfiles, publicaciones,
    │                        comentarios, votos, guardados, notificaciones)
    ├── middlewares/         auth (sesión y dueño), upload (imágenes), errores
    └── utils/validacion.js  validaciones y HttpError
```

Para agregar un endpoint: escribe la función en el controlador que corresponda y regístrala en
`src/routes/index.js`. Con Express 5 los errores de funciones `async` llegan solos al manejador
de errores; para responder con un error controlado basta con `throw new HttpError(400, "...")`.

## Estructura del frontend

```
FrontEnd/src/
├── main.jsx · App.jsx       arranque, sesión y rutas
├── index.css                tema (paleta "mar y desierto", modo oscuro) y clases reutilizables
├── auth/AuthContext.jsx     usuario de la sesión (useAuth)
├── lib/                     formato (precios CLP, fechas, WhatsApp), categorías, alertas
├── components/
│   ├── layout/              cabecera, menú lateral, barra móvil, columna derecha, login/registro
│   ├── posts/               feed, tarjeta, votos/guardar/compartir, comentarios, visor de fotos
│   └── ui/                  avatar, estados vacíos, esqueletos de carga, cambio de tema
└── screens/                 una pantalla por ruta
```

Clases propias del diseño (definidas en `index.css`): `tarjeta`, `btn-primario`, `btn-secundario`,
`btn-fantasma`, `btn-icono`, `campo`, `etiqueta`, `chip`, `precio`. Colores: `mar-*` (azul),
`arena-*` (acento) y los semánticos `bg-fondo`, `bg-superficie`, `border-borde`, `text-texto`,
`text-suave`, que cambian solos en modo oscuro.

## Puesta en marcha

1. **Base de datos.** Crea la base de datos y las tablas con datos de ejemplo
   (borra las tablas si ya existían):

   ```bash
   mysql -u root -p < Backend/database/rinconbd.sql
   ```

   Si ya tenías la base creada con una versión anterior, en vez de recrearla aplica las
   migraciones de `Backend/database/migraciones/` en orden (conservan los datos):

   ```bash
   mysql -u root -p rinconbd2 < Backend/database/migraciones/001_estado_publicaciones.sql
   mysql -u root -p rinconbd2 < Backend/database/migraciones/002_imagenes_publicaciones.sql
   ```

2. **Backend.**

   ```bash
   cd Backend
   cp .env.example .env   # y pon tu usuario/contraseña de MySQL
   npm install
   npm run dev            # se reinicia solo al guardar (node --watch); o npm start
   ```

3. **Frontend** (en otra terminal).

   ```bash
   cd FrontEnd
   cp .env.example .env   # solo si el backend no está en http://localhost:3000
   npm install
   npm run dev
   ```

   Abre http://localhost:5173.

Los usuarios de ejemplo tienen contraseñas desconocidas: regístrate con un usuario nuevo
desde `/registro`. En la instalación local de desarrollo existen además `prueba1@rincon.test`,
`prueba2@rincon.test`, `prueba3@rincon.test` y `prueba4@rincon.test` (contraseña `Prueba123!`),
creados al probar la app.

## URLs del sitio

| URL | Página |
|---|---|
| `/` | Inicio. Acepta `?q=texto` (búsqueda), `?orden=populares\|comentadas` y `?estado=disponible\|reservado\|vendido` |
| `/publicacion/66/completos-italianos` | Detalle. El texto final se corrige solo si falta o cambió el título |
| `/usuario/prueba1` | Perfil público (no distingue mayúsculas: `/usuario/PRUEBA1` lleva al mismo) |
| `/categoria/comida` | Categoría: `comida`, `ropa`, `electronicos`, `juguetes-y-juegos`, `mascotas`, `deportes`, `otros` |
| `/publicar` · `/guardados` · `/notificaciones` · `/ajustes` | Requieren sesión |
| `/iniciar-sesion` · `/registro` · `/ayuda` | |

Las URLs antiguas siguen funcionando y redirigen a las nuevas: `/inicio`, `/login`, `/editar-perfil`,
`/publicacion/:id/comments`, `/perfil/:id`, `/categorias/:id`, `/guardados/:id`,
`/bandeja-de-entrada/:id`. Cualquier otra muestra la página "Esta página no existe".

En el código, las URLs se generan siempre con `rutas` de `FrontEnd/src/lib/rutas.js`.

## API

Todas las rutas cuelgan de `/api` (la lista completa está al inicio de
`Backend/src/routes/index.js`). Por ejemplo: `GET /api/publicaciones?search=&categoria=&orden=&estado=`,
`GET /api/publicaciones/:id`, `POST /api/publicaciones/:id/voto`, `GET /api/usuarios/:nombre`,
`PATCH /api/perfil`, `PUT|DELETE /api/guardados/:id`. `GET /api/salud` comprueba que la API y la base
de datos responden.

## Tests

```bash
cd Backend && npm test     # API completa contra la base del .env (crea y borra usuarios de prueba)
cd FrontEnd && npm test    # todas las rutas del sitio, redirecciones y enlaces internos
```

## Seguridad

- **Sesión:** al iniciar sesión el backend crea una cookie `rincon.sid` httpOnly (JavaScript no
  puede leerla). Las sesiones se guardan en MySQL (tabla `sessions`, se crea sola) y duran 7 días
  desde la última actividad. El frontend solo guarda en `localStorage` una copia de los datos
  públicos del usuario y la verifica con `GET /me` al cargar.
- **Autorización:** el backend ya no confía en el `usuario_id` que manda el navegador: publicar,
  comentar, votar, guardar y editar el perfil usan siempre el usuario de la sesión, y solo el
  autor puede borrar sus publicaciones y comentarios.
- **Datos privados:** nunca se devuelve la contraseña; el correo solo lo ve su dueño.
- **Imágenes:** JPG, PNG, WEBP o GIF de hasta 5 MB, con nombre aleatorio y comprobación del
  contenido real del archivo.
- **Límites:** máximo 20 intentos de login/registro cada 15 minutos por IP.

## Imágenes subidas

Las fotos se guardan en `Backend/uploads/` con un nombre aleatorio. Al eliminar una publicación
se borran también sus fotos, salvo las que use otra publicación o un perfil (y nunca
`default.webp` ni `defaultPhoto.jpg`).

Para revisar imágenes que hayan quedado sin uso (por ejemplo, de versiones anteriores):

```bash
cd Backend
npm run limpiar-uploads              # solo lista
npm run limpiar-uploads -- --borrar  # lista y borra
```

### MySQL instalado con winget (sin servicio de Windows)

El instalador silencioso de winget no registra MySQL como servicio. Los datos están en
`%LOCALAPPDATA%\MySQL\data` y el servidor se arranca a mano:

```bash
"/c/Program Files/MySQL/MySQL Server 8.4/bin/mysqld.exe" --defaults-file="$LOCALAPPDATA/MySQL/my.ini" --console
```

> `rinconbd2.sql` es el volcado antiguo de phpMyAdmin y ya no coincide con el código;
> usa `Backend/database/rinconbd.sql`.
