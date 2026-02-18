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
  { name: 'Malaysia', agents: 1, cx: 658, cy: 518 },
];

const TOOLTIP_W = 140;
const TOOLTIP_H = 38;
const TOOLTIP_OFFSET_Y = 22;
const TOOLTIP_RX = 1.5;

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
                  fill="#E7EBF0"
                  stroke="#D6DBE3"
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                />
              ))}
            </g>

            {/* Active countries — highlighted fill */}
            <g>
              {pathsByActive.active.map((p, i) => (
                <path
                  key={`${p.id}-active-${i}`}
                  d={p.d}
                  fill={hoveredPath === p.id ? 'rgba(14,46,80,0.38)' : 'rgba(14,46,80,0.18)'}
                  stroke="rgba(14,46,80,0.3)"
                  strokeWidth="0.5"
                  style={{ transition: 'fill 150ms ease, opacity 150ms ease' }}
                  className="cursor-pointer"
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
                {/* Solid dot */}
                <circle
                  cx={country.cx}
                  cy={country.cy}
                  r={hoveredCountry?.name === country.name ? 3.5 : 2.5}
                  fill="rgba(14,46,80,0.7)"
                  style={{ transition: 'r 200ms ease' }}
                />
              </g>
            ))}

            {/* Tooltip */}
            {hoveredCountry && (() => {
              const tx = hoveredCountry.cx - TOOLTIP_W / 2;
              const ty = hoveredCountry.cy - TOOLTIP_H - TOOLTIP_OFFSET_Y;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  {/* Shadow rect */}
                  <rect
                    x={tx + 0.5}
                    y={ty + 0.5}
                    width={TOOLTIP_W}
                    height={TOOLTIP_H}
                    rx={TOOLTIP_RX}
                    fill="rgba(0,0,0,0.08)"
                  />
                  {/* Background */}
                  <rect
                    x={tx}
                    y={ty}
                    width={TOOLTIP_W}
                    height={TOOLTIP_H}
                    rx={TOOLTIP_RX}
                    fill="#0e2e50"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.5"
                  />
                  {/* Country name */}
                  <text
                    x={hoveredCountry.cx}
                    y={ty + 14}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="600"
                    letterSpacing="-0.02em"
                  >
                    {hoveredCountry.name}
                  </text>
                  {/* Divider */}
                  <line
                    x1={hoveredCountry.cx - TOOLTIP_W * 0.32}
                    y1={ty + 19.5}
                    x2={hoveredCountry.cx + TOOLTIP_W * 0.32}
                    y2={ty + 19.5}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="0.5"
                  />
                  {/* Agent count */}
                  <text
                    x={hoveredCountry.cx}
                    y={ty + 30}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.78)"
                    fontSize="8"
                  >
                    {hoveredCountry.agents} {hoveredCountry.agents === 1 ? 'agent active' : 'agents active'}
                  </text>
                </g>
              );
            })()}
          </svg>
        </motion.div>

        {/* Reinforcement line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 text-[11px] tracking-[0.2em] uppercase text-muted-foreground/50 font-medium"
        >
          {t('agents.mapReinforcement')}
        </motion.p>
      </div>
    </section>
  );
};
