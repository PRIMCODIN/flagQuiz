## FlagCarnaval (Flag Challenge)

React + Vite flag quiz game with:
- **Supabase Auth** (login / signup / guest)
- **Global leaderboards** (no school-only fields)
- **World Path** progression + **Free Mode** (continent + difficulty)
- Simple Duolingo-like styling and micro-animations

## Requirements

- Node.js 18+
- A Supabase project

## Environment variables

Create a `.env` file (see `.env.example`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Supabase tables (expected)

### `profiles`

- `id` uuid (primary key, matches `auth.users.id`)
- `display_name` text
- `created_at` timestamptz (default `now()`)

### `leaderboard_entries`

- `id` uuid (primary key, default `gen_random_uuid()`)
- `user_id` uuid (nullable)
- `display_name` text
- `score` int
- `correct_answers` int
- `total_questions` int
- `time_seconds` int
- `mode` text
- `created_at` timestamptz (default `now()`)

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

- **Framework preset**: Vite
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment variables**: add the same keys from `.env` in Vercel project settings

# ?? Flag Challenge - Carnaval Edition

Juego web competitivo de trivia de banderas diseñado para eventos escolares. Los jugadores compiten respondiendo 12 preguntas sobre banderas de países de todo el mundo en 15 segundos cada una, acumulando puntos según su velocidad y precisión.

## ?? Características

- **Login simple** con validación de nombres únicos por curso
- **12 banderas aleatorias** de 258 países del mundo
- **Sistema de puntuación** basado en aciertos y velocidad
- **Ranking en tiempo real** con actualización automática
- **Códigos de premio únicos** para los ganadores
- **Diseño responsive** optimizado para móviles
- **Animaciones atractivas** con Framer Motion y confetti

## ??? Stack Tecnológico

### Frontend
- **React 18** con Vite
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Framer Motion** para animaciones
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones

### Backend
- **Supabase** (PostgreSQL + Real-time)
- Base de datos con Row Level Security
- Actualizaciones en tiempo real del ranking

### Hosting Recomendado
- **Vercel** o **Netlify** (NO usar InfinityFree)

## ?? Instalación

### 1. Requisitos Previos
- Node.js 18+ instalado
- Cuenta en Supabase (gratis)
- Editor de código (VS Code recomendado)

### 2. Clonar el proyecto
```bash
cd flag-challenge-app
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar Supabase

#### a) Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
   - Nombre: `flag-challenge-carnaval`
   - Password: (guárdala de forma segura)
   - Región: Europe West (más cercana a España)

#### b) Ejecutar SQL de configuración
1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase-setup.sql` de este proyecto
3. Copia todo el contenido
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **RUN** para ejecutar
6. Verifica que no haya errores (debería mostrar "Success")

#### c) Obtener credenciales
1. Ve a **Settings > API** en Supabase
2. Copia:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon/public key** (la clave pública larga)

### 5. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales reales
nano .env  # o usa tu editor favorito
```

Reemplaza en `.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto-real.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_real_aqui
```

### 6. Iniciar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ?? Despliegue en Producción

### Opción 1: Vercel (RECOMENDADO)

#### Desde la terminal
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Seguir las instrucciones en pantalla
```

#### Desde GitHub
1. Sube tu proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Despliega

### Opción 2: Netlify

```bash
# Compilar para producción
npm run build

# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Seleccionar carpeta: dist/
```

O usa el método drag & drop en [netlify.com](https://netlify.com).

### ?? Variables de Entorno en Producción
**MUY IMPORTANTE:** No olvides configurar las variables de entorno en tu plataforma de hosting:

**Vercel:**
- Settings > Environment Variables

**Netlify:**
- Site settings > Build & deploy > Environment

Variables necesarias:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## ?? Generar QR para el evento

Una vez desplegado:

1. Copia la URL de producción (ej: https://flag-challenge.vercel.app)
2. Genera el QR en: [qr-code-generator.com](https://www.qr-code-generator.com)
3. Descarga e imprime el QR en tamaño A4
4. Opcional: Personaliza el QR con el logo del colegio

## ?? Uso en el Evento

### Antes del evento
- [ ] Verificar que la app funciona en producción
- [ ] Imprimir 10+ copias del QR
- [ ] Preparar carteles con instrucciones
- [ ] Tener premios físicos listos
- [ ] Verificar conexión WiFi del colegio
- [ ] Backup: Tener datos móviles disponibles

### Durante el evento
1. Estudiantes escanean el QR
2. Hacen login con nombre + curso
3. Juegan las 12 preguntas
4. Reciben código de premio
5. Verifican su posición en el ranking

### Gestión de premios
Los ganadores presentan su código de premio. Verifica en Supabase:

```sql
SELECT p.username, p.course, g.score, g.prize_code
FROM games g
JOIN players p ON g.player_id = p.id
WHERE g.prize_code = 'A-12345'  -- El código que te dieron
ORDER BY g.score DESC
LIMIT 1;
```

## ?? Personalización

### Cambiar número de preguntas
En `src/utils/gameUtils.js`:
```javascript
export const GAME_CONFIG = {
  NUM_QUESTIONS: 12,  // Cambia esto a 10 o 15
  TIME_PER_QUESTION: 15,
  // ...
}
```

### Cambiar cursos disponibles
En `src/utils/gameUtils.js`:
```javascript
export const COURSES = [
  '1º ESO',
  '2º ESO',
  // Añade o elimina cursos aquí
]
```

### Cambiar colores
En `tailwind.config.js`:
```javascript
colors: {
  primary: '#FF6B6B',    // Color principal
  secondary: '#4ECDC4',   // Color secundario
  // ...
}
```

## ?? Analytics y Métricas

### Ver estadísticas en Supabase
```sql
-- Ranking completo
SELECT * FROM get_global_ranking(50);

-- Estadísticas generales
SELECT * FROM get_game_statistics();

-- Top por curso
SELECT * FROM get_course_ranking('1º ESO', 10);
```

### Métricas de éxito
- Total de jugadores únicos
- Tasa de finalización (% que completan las 12 preguntas)
- Puntuación media
- Tiempo promedio de juego

## ?? Solución de Problemas

### Error: "Network request failed"
- Verifica las credenciales de Supabase en `.env`
- Comprueba que las tablas existen en Supabase
- Verifica las políticas RLS en Supabase

### Error: "Username already exists"
- Es correcto, el nombre ya está en uso en ese curso
- El usuario debe elegir otro nombre

### La app no carga las banderas
- Verifica que `flags.json` está en `src/assets/`
- Comprueba la consola del navegador para errores

### El ranking no se actualiza
- Verifica que Supabase Realtime esté habilitado
- Refresca la página manualmente

## ?? Estructura del Proyecto

```
flag-challenge-app/
??? public/
??? src/
?   ??? assets/
?   ?   ??? flags.json          # 258 banderas
?   ??? components/             # Componentes reutilizables
?   ??? config/
?   ?   ??? supabase.js         # Cliente de Supabase
?   ??? screens/
?   ?   ??? LoginScreen.jsx     # Pantalla de login
?   ?   ??? GameScreen.jsx      # Juego principal
?   ?   ??? ResultsScreen.jsx   # Resultados y premio
?   ?   ??? RankingScreen.jsx   # Clasificación
?   ??? utils/
?   ?   ??? gameUtils.js        # Lógica del juego
?   ?   ??? database.js         # Funciones de BD
?   ??? App.jsx                 # Routing principal
?   ??? main.jsx                # Punto de entrada
?   ??? index.css               # Estilos globales
??? supabase-setup.sql          # Script de BD
??? .env.example                # Plantilla de variables
??? package.json
??? README.md
```

## ?? Contribuir

Si encuentras bugs o quieres mejorar el juego:

1. Haz un fork del proyecto
2. Crea una rama: `git checkout -b feature/mejora`
3. Haz commit: `git commit -m 'Añadir mejora'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

## ?? Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## ?? Créditos

- Banderas de [Twemoji](https://twemoji.twitter.com/)
- Desarrollado para eventos escolares
- Especial gracias a la comunidad de React y Supabase

## ?? Soporte

Si tienes problemas:

1. Revisa esta documentación
2. Consulta la [documentación de Supabase](https://supabase.com/docs)
3. Consulta la [documentación de React](https://react.dev)

---

**¡Buena suerte en tu evento de carnaval! ????**