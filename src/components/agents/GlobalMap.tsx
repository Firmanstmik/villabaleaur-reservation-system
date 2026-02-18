import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { WORLD_MAP_VIEWBOX, WORLD_MAP_PATHS } from '@/data/worldMapPaths';

const ACTIVE_COUNTRY_IDS = new Set(['nl', 'pt', 'id', 'my']);

interface CountryData {
  name: string;
  agents: number;
  cx: number;
  cy: number;
}

// Coordinates in the original SVG viewBox coordinate space
const activeCountries: CountryData[] = [
  { name: 'Netherlands', agents: 3, cx: 419, cy: 386 },
  { name: 'Portugal', agents: 1, cx: 389, cy: 428 },
  { name: 'Indonesia', agents: 4, cx: 690, cy: 535 },
  { name: 'Malaysia', agents: 1, cx: 665, cy: 520 },
];

export const GlobalMap = () => {
  const { t } = useLanguage();
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const pathsByActive = useMemo(() => {
    const active: typeof WORLD_MAP_PATHS = [];
    const inactive: typeof WORLD_MAP_PATHS = [];
    for (const p of WORLD_MAP_PATHS) {
      if (ACTIVE_COUNTRY_IDS.has(p.id)) {
        active.push(p);
      } else {
        inactive.push(p);
      }
    }
    return { active, inactive };
  }, []);

  return (
    <section className="py-28 border-b border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-base font-bold tracking-[0.2em] text-foreground uppercase mb-4">
            {t('agents.mapHeadline')}
          </h2>
          <div className="w-10 h-px bg-foreground/30 mx-auto mb-5" />
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            {t('agents.mapSubtext')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <svg
            viewBox={WORLD_MAP_VIEWBOX}
            className="w-full h-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Inactive countries — neutral fill */}
            <g>
              {pathsByActive.inactive.map((p, i) => (
                <path
                  key={`${p.id}-${i}`}
                  d={p.d}
                  fill="#f3f4f6"
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            {/* Active countries — highlighted fill */}
            <g>
              {pathsByActive.active.map((p, i) => (
                <path
                  key={`${p.id}-active-${i}`}
                  d={p.d}
                  fill={hoveredPath === p.id ? 'rgba(14,46,80,0.28)' : 'rgba(14,46,80,0.18)'}
                  stroke="rgba(14,46,80,0.3)"
                  strokeWidth="0.5"
                  className="transition-[fill] duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredPath(p.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                />
              ))}
            </g>

            {/* Dot markers on active countries */}
            {activeCountries.map((country) => (
              <g
                key={country.name}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
                className="cursor-pointer"
              >
                {/* Subtle pulse ring */}
                <circle
                  cx={country.cx}
                  cy={country.cy}
                  r="5"
                  fill="none"
                  stroke="rgba(14,46,80,0.3)"
                  strokeWidth="0.4"
                >
                  <animate
                    attributeName="r"
                    values="4;7;4"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0.1;0.4"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Solid dot */}
                <circle
                  cx={country.cx}
                  cy={country.cy}
                  r={hoveredCountry?.name === country.name ? 3.5 : 2.5}
                  fill="rgba(14,46,80,0.7)"
                  className="transition-all duration-200"
                />
              </g>
            ))}

            {/* Tooltip */}
            {hoveredCountry && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={hoveredCountry.cx - 48}
                  y={hoveredCountry.cy - 28}
                  width="96"
                  height="22"
                  rx="3"
                  fill="#0e2e50"
                />
                <polygon
                  points={`${hoveredCountry.cx - 3},${hoveredCountry.cy - 6} ${hoveredCountry.cx + 3},${hoveredCountry.cy - 6} ${hoveredCountry.cx},${hoveredCountry.cy - 2}`}
                  fill="#0e2e50"
                />
                <text
                  x={hoveredCountry.cx}
                  y={hoveredCountry.cy - 18}
                  textAnchor="middle"
                  fill="white"
                  fontSize="7"
                  fontWeight="500"
                >
                  {hoveredCountry.name}
                </text>
                <text
                  x={hoveredCountry.cx}
                  y={hoveredCountry.cy - 10}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.6)"
                  fontSize="5.5"
                >
                  {hoveredCountry.agents} {hoveredCountry.agents === 1 ? 'Agent' : 'Agents'}
                </text>
              </g>
            )}
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
