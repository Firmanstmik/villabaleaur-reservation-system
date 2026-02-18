import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface BarConfig {
  dataKey: string;
  label: string;
  color: string;
}

interface BarChartBlockProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  bars: BarConfig[];
  yAxisSuffix?: string;
  layout?: 'vertical' | 'horizontal';
}

const NAVY = '#0e2e50';
const GRID_COLOR = '#e8eaed';
const AXIS_COLOR = '#9ca3af';

export const BarChartBlock = ({
  title,
  description,
  data,
  xKey,
  bars,
  yAxisSuffix = '',
  layout = 'horizontal',
}: BarChartBlockProps) => {
  const isVertical = layout === 'vertical';

  return (
    <div className="my-10 bg-white border border-border/40 rounded-lg p-6 md:p-8">
      <h4 className="text-sm font-semibold text-foreground tracking-tight mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-muted-foreground/60 mb-6 max-w-lg">
          {description}
        </p>
      )}
      <div className="w-full h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={isVertical ? 'vertical' : 'horizontal'}
            margin={{ top: 8, right: 12, left: isVertical ? 8 : 4, bottom: 4 }}
            barCategoryGap="25%"
          >
            <CartesianGrid
              stroke={GRID_COLOR}
              strokeDasharray="3 3"
              horizontal={!isVertical}
              vertical={isVertical}
            />
            {isVertical ? (
              <>
                <YAxis
                  type="category"
                  dataKey={xKey}
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}${yAxisSuffix}`}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: AXIS_COLOR }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}${yAxisSuffix}`}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: NAVY,
                border: 'none',
                borderRadius: 4,
                padding: '8px 12px',
                fontSize: 11,
                color: 'white',
              }}
              itemStyle={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginBottom: 4 }}
              formatter={(value: number) => [`${value}${yAxisSuffix}`, undefined]}
              cursor={{ fill: 'rgba(14,46,80,0.04)' }}
            />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.label}
                fill={bar.color}
                radius={[2, 2, 0, 0]}
                maxBarSize={48}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {bars.length > 1 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
          {bars.map((bar) => (
            <div key={bar.dataKey} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ backgroundColor: bar.color }}
              />
              <span className="text-[10px] text-muted-foreground/60">{bar.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
