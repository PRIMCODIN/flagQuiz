/**
 * Rosa de los vientos — sello de marca del login (tema Atlas).
 * SVG presentacional: doble círculo + agujas N/S/E/O y diagonales finas.
 * La aguja norte usa el acento terracota; el resto, la tinta marina.
 * Los colores se controlan por CSS (.compass-ink / .compass-needle-n),
 * de modo que sobre el panel marino las líneas pasan a crema.
 */
export default function CompassRose({ className = '' }) {
    return (
        <svg
            className={`compass-rose ${className}`}
            viewBox="0 0 100 100"
            role="img"
            aria-label="Rosa de los vientos"
        >
            {/* Doble círculo */}
            <circle className="compass-ink" cx="50" cy="50" r="46" fill="none" strokeWidth="1.5" />
            <circle className="compass-ink" cx="50" cy="50" r="38" fill="none" strokeWidth="1" />

            {/* Diagonales finas (NE/SE/SW/NO) */}
            <g className="compass-ink" strokeWidth="1" opacity="0.55">
                <line x1="50" y1="50" x2="77" y2="23" />
                <line x1="50" y1="50" x2="77" y2="77" />
                <line x1="50" y1="50" x2="23" y2="77" />
                <line x1="50" y1="50" x2="23" y2="23" />
            </g>

            {/* Agujas cardinales: E, S, O en tinta */}
            <polygon className="compass-ink" points="50,50 94,50 50,43" />
            <polygon className="compass-ink" points="50,50 50,94 57,50" />
            <polygon className="compass-ink" points="50,50 6,50 50,57" />

            {/* Aguja norte en acento (sello) */}
            <polygon className="compass-needle-n" points="50,50 50,6 43,50" />
            <polygon className="compass-needle-n" points="50,50 50,6 57,50" opacity="0.7" />
        </svg>
    )
}
