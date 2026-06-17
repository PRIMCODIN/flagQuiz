/**
 * Rosa de los vientos — sello de marca del login (tema Atlas).
 * Brújula completa sobre disco de papel crema: borde marino, anillo interior
 * terracota, marcas cardinales N/S/E/O (N resaltada en marino, resto tenues)
 * y aguja bicolor (norte terracota, sur marino) con buje central.
 * SVG presentacional con colores inline; aria-hidden porque es decorativo.
 */
export default function CompassRose({ className = '' }) {
    return (
        <svg
            className={`compass-rose ${className}`}
            viewBox="0 0 100 100"
            aria-hidden="true"
        >
            {/* Disco de papel + borde marino */}
            <circle cx="50" cy="50" r="47" fill="#F4ECD8" />
            <circle cx="50" cy="50" r="47" fill="none" stroke="#1B3A4B" strokeWidth="2" />
            {/* Anillo interior fino terracota */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#B0411A" strokeWidth="0.7" />

            {/* Marcas cardinales menores */}
            <g stroke="#1B3A4B" strokeWidth="0.8">
                <line x1="50" y1="10" x2="50" y2="16" />
                <line x1="50" y1="84" x2="50" y2="90" />
                <line x1="10" y1="50" x2="16" y2="50" />
                <line x1="84" y1="50" x2="90" y2="50" />
            </g>

            {/* Letras cardinales: N marino resaltada, resto tenues */}
            <text x="50" y="26" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#1B3A4B">N</text>
            <text x="50" y="80" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9A8E78">S</text>
            <text x="22" y="53" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9A8E78">O</text>
            <text x="78" y="53" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9A8E78">E</text>

            {/* Aguja bicolor: norte terracota, sur marino */}
            <polygon points="50,22 57,50 50,48 43,50" fill="#B0411A" />
            <polygon points="50,78 43,50 50,52 57,50" fill="#1B3A4B" />

            {/* Buje central */}
            <circle cx="50" cy="50" r="3.5" fill="#F4ECD8" stroke="#1B3A4B" strokeWidth="1.5" />
        </svg>
    )
}
