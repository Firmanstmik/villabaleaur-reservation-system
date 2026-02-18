import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
  strokeDasharray?: string;
}

interface LineChartBlockProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  xKey: string;
  lines: LineConfig[];
  yAxisLabel?: string;
  yAxisSuffix?: string;
}

const NAVY = '#0e2e50';
const GRID_COLOR = '#e8eaed';
const AXIS_COLOR = '#9ca3af';

export const LineChartBlock = ({
  title,
  description,
  data,
  xKey,
  lines,
  yAxisLabel,
  yAxisSuffix = '',
}: LineChartBlockProps) => {
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
          <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
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
              label={
                yAxisLabel
                  ? {
                      value: yAxisLabel,
                      angle: -90,
                      position: 'insideLeft',
                      offset: 0,
                      style: { fontSize: 10, fill: AXIS_COLOR, textAnchor: 'middle' },
                    }
                  : undefined
              }
            />
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
            />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.label}
                stroke={line.color}
                strokeWidth={1.5}
                strokeDasharray={line.strokeDasharray}
                dot={false}
                activeDot={{ r: 3, fill: line.color, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {lines.length > 1 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
          {lines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-2">
              <span
                className="w-4 h-px inline-block"
                style={{
                  backgroundColor: line.color,
                  borderTop: line.strokeDasharray ? `1.5px dashed ${line.color}` : undefined,
                  height: line.strokeDasharray ? 0 : 1.5,
                }}
              />
              <span className="text-[10px] text-muted-foreground/60">{line.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
