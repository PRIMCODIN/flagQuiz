# 🌍 Flag Challenge

Juego web para poner a prueba tus conocimientos de banderas del mundo. Adivina
el país a partir de su bandera contra el reloj, suma puntos por velocidad y
compite en un ranking global en tiempo real.

🔗 **Demo:** https://flag-quiz.vercel.app

> Proyecto de portfolio desarrollado por **Victor Prim**.

---

## ✨ Características

- **Autenticación** con email/contraseña (Supabase Auth), con login también por
  nombre de usuario.
- **Modo invitado**: juega sin registrarte; tu puntuación entra en el ranking.
- **Modos de juego**:
  - *Clásico*: partida rápida con banderas de todo el mundo.
  - *Free Mode*: elige continente y dificultad (fácil / normal / difícil).
  - *World Path*: progresión por niveles que se van desbloqueando.
- **Puntuación por tiempo**: cuanto antes aciertas, más puntos.
- **Ranking en tiempo real** con Supabase Realtime (se actualiza al instante
  cuando otro jugador registra una partida) y buscador por nombre.
- **Perfil** con estadísticas personales (mejor puntuación, media, últimas partidas).
- **Responsive** mobile-first y rutas protegidas.

---

## 🛠️ Stack

- **React 18** + **Vite 5**
- **React Router 6** (incluye rutas protegidas)
- **Supabase** (Auth, Postgres y Realtime)
- **framer-motion**, **lucide-react**, **react-hot-toast**, **react-confetti**
- **CSS** propio (mobile-first) con **PostCSS** + **autoprefixer**

---

## 🚀 Instalación

```bash
# 1. Clonar e instalar dependencias
git clone <url-del-repo>
cd FlagCarnaval
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 3. Arrancar en desarrollo (abre http://localhost:3000)
npm run dev
```

Scripts disponibles:

| Script            | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Servidor de desarrollo (puerto 3000) |
| `npm run build`   | Build de producción en `dist/`       |
| `npm run preview` | Sirve el build de producción         |
| `npm run lint`    | Linter (ESLint)                      |

### Variables de entorno

Copia `.env.example` a `.env` y rellena:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Las encuentras en tu panel de Supabase → *Project Settings → API*.
El archivo `.env` está en `.gitignore`: **nunca lo subas al repositorio.**

---

## 🗄️ Configuración de Supabase

El proyecto espera dos tablas en el esquema `public`:

**`profiles`**

| Columna        | Tipo      | Notas             |
| -------------- | --------- | ----------------- |
| `id`           | uuid (PK) | = `auth.users.id` |
| `username`     | text      | único             |
| `display_name` | text      |                   |
| `email`        | text      |                   |

**`leaderboard_entries`**

| Columna           | Tipo        | Notas                       |
| ----------------- | ----------- | --------------------------- |
| `id`              | uuid (PK)   | default `gen_random_uuid()` |
| `user_id`         | uuid (null) | null para invitados         |
| `display_name`    | text        |                             |
| `score`           | int         |                             |
| `correct_answers` | int         |                             |
| `total_questions` | int         |                             |
| `time_seconds`    | int         |                             |
| `mode`            | text        |                             |
| `created_at`      | timestamptz | default `now()`             |

Recuerda:

- Activar **Realtime** sobre `leaderboard_entries` (para el ranking en vivo).
- Configurar **Row Level Security (RLS)**: lectura pública del leaderboard,
  inserción permitida (incluida la de invitados con `user_id` null) y acceso a
  `profiles` restringido al propio usuario.

---

## ☁️ Deploy en Vercel

1. Importa el repositorio en Vercel (framework detectado: **Vite**).
2. Añade las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en
   *Settings → Environment Variables*.
3. El `vercel.json` ya incluye el rewrite SPA hacia `index.html`.

---

## 📁 Estructura

```
src/
├── api/        # Acceso a Supabase (perfiles, leaderboard)
├── components/ # Componentes reutilizables (ProtectedRoute)
├── config/     # Cliente de Supabase
├── context/    # AuthContext (sesión y perfil)
├── screens/    # Pantallas (login, juego, modos, rankings, perfil...)
├── styles/     # CSS global mobile-first
└── utils/      # Lógica de juego, base de datos y world path
```

---

## 👤 Autor

**Victor Prim** — proyecto de portfolio.
