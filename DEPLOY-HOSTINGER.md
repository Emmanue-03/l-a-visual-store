# Desplegar en Hostinger (Node.js)

Esta app es **TanStack Start (SSR)**. No alcanza con subir archivos HTML: necesita
un proceso Node que escuche en un puerto. El servidor que hace eso es
[`scripts/node-server.mjs`](scripts/node-server.mjs).

El error **403 Forbidden** que aparecía era porque Hostinger no tenía una app Node
corriendo (no había script `start` ni un servidor que escuchara un puerto), así que
caía a la carpeta vacía.

---

## ⚠️ Importante si desplegás desde el repositorio (Git)

`dist/` ahora **se commitea al repo a propósito** (se sacó del `.gitignore`), porque
Hostinger trae el código desde git pero **NO compila en el servidor**. Si `dist/` no
estuviera en el repo, el server no tendría los archivos compilados y la app no
arrancaría (volvés al 403).

Flujo cada vez que cambiás algo:

```bash
npm run build:node          # genera dist/
git add dist                # incluye el build actualizado
git commit -m "build"
git push
```

Después, en Hostinger: hacé el **deploy/pull** del repo y **reiniciá la app Node**
(un git pull solo NO reinicia el proceso).

Y verificá que en hPanel → Node.js el **startup file** sea `scripts/node-server.mjs`
y que la app figure como **Running**.

---

## Opción recomendada: compilar local y subir `dist/`

El bundle SSR ya incluye TODAS las dependencias adentro, así que en el servidor
**no hace falta `node_modules` ni compilar** (que en hosting compartido suele fallar
por falta de RAM).

### 1. Compilar en tu PC

```bash
npm install
npm run build:node
```

Esto genera la carpeta `dist/` (`dist/client/` con los assets y
`dist/server/server.js` con el SSR).

### 2. Subir a Hostinger

Subí a la carpeta de tu app (ej. `~/lyamultiventas`) SOLO esto:

- `dist/`  (la carpeta completa)
- `scripts/node-server.mjs`
- `package.json`

> Podés subirlo por el Administrador de archivos de hPanel (comprimí en .zip y
> descomprimí allá) o por FTP/SSH.

### 3. Configurar la app Node en hPanel

En **hPanel → Avanzado → Node.js** (o "Setup Node.js App"):

- **Node version:** 20.x o superior
- **Application root:** la carpeta donde subiste los archivos
- **Application URL:** tu dominio (`lyamultiventas.com`)
- **Application startup file:** `scripts/node-server.mjs`

### 4. Variables de entorno

En la misma pantalla, sección **Environment variables**, cargá las que usa la app
(ver [`src/backend/env.ts`](src/backend/env.ts)):

- `ADMIN_SESSION_SECRET` (mínimo 32 caracteres)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- + cualquier otra que uses para la base (Postgres / Supabase)
- `NODE_ENV` = `production`

> Sin estas, la tienda arranca igual pero cae a datos de ejemplo (mock) y el panel
> admin no funciona.

### 5. Arrancar

Tocá **Restart / Start** en hPanel. Entrá a `lyamultiventas.com`: ya no debería dar 403.

---

## Opción alternativa: compilar en el servidor

Solo si tu plan tiene RAM suficiente (VPS o plan alto). Por SSH, en la carpeta de la app:

```bash
npm install          # incluye devDependencies (necesarias para compilar)
npm run build:node
```

Y configurá el startup file igual que arriba (`scripts/node-server.mjs`).

---

## Probar localmente (opcional)

```bash
npm run build:node
npm start              # levanta en http://localhost:3000
```

El servidor toma el puerto de `process.env.PORT` (que Hostinger inyecta) o usa 3000
por defecto.

---

## Por qué NO funcionaba antes

- El `package.json` no tenía script `start`.
- El servidor ([`src/server.ts`](src/server.ts)) usa el modelo `fetch(Request)` de
  Cloudflare/Vercel, no un servidor Node que escuche un puerto.

`scripts/node-server.mjs` es el puente: levanta un `http.Server`, sirve los assets de
`dist/client` y manda el resto al handler SSR.
