/**
 * Migración de flags.json
 * --------------------------------
 * 1. El host antiguo `twemoji.maxcdn.com` ya no existe. Reescribimos las URLs
 *    al CDN vivo de twemoji oficial (jsdelivr + jdecked/twemoji), conservando
 *    los mismos codepoints, lo que mantiene TODAS las entradas (incluidos
 *    territorios sin código ISO estándar como Ascensión, Ceuta y Melilla, etc.).
 * 2. Eliminamos los campos `answers`/`correct`: las opciones se generan de forma
 *    dinámica en `gameUtils.js`, que es la única fuente de verdad.
 *
 * Uso: node scripts/migrate-flags.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FLAGS_PATH = join(__dirname, '..', 'src', 'assets', 'flags.json')

const OLD_HOST = 'https://twemoji.maxcdn.com/2/svg/'
const NEW_HOST = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/'

const flags = JSON.parse(readFileSync(FLAGS_PATH, 'utf8'))

let migratedUrls = 0
let strippedFields = 0

const cleaned = flags.map((entry) => {
    const next = { ...entry }

    if (typeof next.flag === 'string' && next.flag.startsWith(OLD_HOST)) {
        next.flag = next.flag.replace(OLD_HOST, NEW_HOST)
        migratedUrls++
    }

    if ('answers' in next) {
        delete next.answers
        strippedFields++
    }
    if ('correct' in next) {
        delete next.correct
    }

    return next
})

writeFileSync(FLAGS_PATH, JSON.stringify(cleaned, null, '\t') + '\n', 'utf8')

console.log(`Entradas: ${cleaned.length}`)
console.log(`URLs migradas: ${migratedUrls}`)
console.log(`Entradas con answers/correct eliminados: ${strippedFields}`)
