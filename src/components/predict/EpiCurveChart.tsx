// src/components/predict/EpiCurveChart.tsx
// Simple SVG-based epidemic curve visualization

import type { DataPoint } from '../../types/predict';

interface EpiCurveChartProps {
  historicalData: DataPoint[];
  predictedData?: DataPoint[];
  actualData?: DataPoint[];
  showActual?: boolean;
  height?: number;
}

export function EpiCurveChart({
  historicalData,
  predictedData,
  actualData,
  showActual = false,
}: EpiCurveChartProps) {
  // Handle year-wraparound weeks (e.g., week 52 -> week 1 becomes week 53)
  const normalizeWeeks = (data: DataPoint[], baseWeek: number): DataPoint[] => {
    return data.map(d => ({
      ...d,
      week: d.week < baseWeek - 10 ? d.week + 52 : d.week // If week is much lower, it's next year
    }));
  };

  const baseWeek = historicalData.length > 0 ? historicalData[0].week : 1;

  // Normalize all data to handle year wraparound
  const normalizedHistorical = normalizeWeeks(historicalData, baseWeek);
  const normalizedPredicted = predictedData ? normalizeWeeks(predictedData, baseWeek) : [];
  const normalizedActual = actualData ? normalizeWeeks(actualData, baseWeek) : [];

  // Combine all data to find scale
  const allData = [
    ...normalizedHistorical,
    ...normalizedPredicted,
    ...(showActual && normalizedActual.length > 0 ? normalizedActual : []),
  ];

  const maxCases = Math.max(...allData.map(d => d.cases), 1);
  const allWeeks = allData.map(d => d.week);
  const minWeek = Math.min(...allWeeks);
  const maxWeek = Math.max(...allWeeks);
  const weekSpan = maxWeek - minWeek + 1;

  // Fixed viewBox dimensions for consistent aspect ratio
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  const padding = { top: 15, right: 20, bottom: 35, left: 45 };
  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  const xScale = (week: number) => padding.left + ((week - minWeek) / weekSpan) * chartWidth;
  const yScale = (cases: number) => padding.top + chartHeight - (cases / maxCases) * chartHeight;

  // Create path for data
  const createPath = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.week)} ${yScale(d.cases)}`)
      .join(' ');
  };

  // Create area path
  const createArea = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    const linePath = createPath(data);
    const firstX = xScale(data[0].week);
    const lastX = xScale(data[data.length - 1].week);
    const baseY = yScale(0);
    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  // Y-axis tick values
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => Math.round(maxCases * pct));

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full"
        style={{ maxHeight: '320px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(ratio => (
          <line
            key={ratio}
            x1={padding.left}
            y1={padding.top + chartHeight * (1 - ratio)}
            x2={viewBoxWidth - padding.right}
            y2={padding.top + chartHeight * (1 - ratio)}
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((val, i) => {
          const y = yScale(val);
          return (
            <text
              key={`y-${i}`}
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              className="text-[11px] fill-slate-400"
            >
              {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            </text>
          );
        })}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={viewBoxWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Predicted area (if exists) */}
        {normalizedPredicted.length > 0 && (
          <path
            d={createArea(normalizedPredicted)}
            fill="#3b82f6"
            fillOpacity="0.1"
          />
        )}

        {/* Historical area */}
        <path
          d={createArea(normalizedHistorical)}
          fill="#64748b"
          fillOpacity="0.2"
        />

        {/* Actual area (if showing) */}
        {showActual && normalizedActual.length > 0 && (
          <path
            d={createArea(normalizedActual)}
            fill="#22c55e"
            fillOpacity="0.2"
          />
        )}

        {/* Historical line */}
        <path
          d={createPath(normalizedHistorical)}
          fill="none"
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Predicted line */}
        {normalizedPredicted.length > 0 && (
          <path
            d={createPath(normalizedPredicted)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="4 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Actual line (if showing) */}
        {showActual && normalizedActual.length > 0 && (
          <path
            d={createPath(normalizedActual)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Data points for historical */}
        {normalizedHistorical.map((d, i) => (
          <circle
            key={`hist-${i}`}
            cx={xScale(d.week)}
            cy={yScale(d.cases)}
            r="2"
            fill="#64748b"
          />
        ))}

        {/* Week labels - show every few weeks based on data density */}
        {allData
          .filter((_, i, arr) => i % Math.max(1, Math.floor(arr.length / 8)) === 0)
          .map((d, i) => {
            // Display original week number (handle year wraparound)
            const displayWeek = d.week > 52 ? d.week - 52 : d.week;
            return (
              <text
                key={`label-${i}`}
                x={xScale(d.week)}
                y={viewBoxHeight - 10}
                textAnchor="middle"
                className="text-[11px] fill-slate-500"
              >
                W{displayWeek}
              </text>
            );
          })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-slate-500" />
          <span className="text-slate-600">Historical</span>
        </div>
        {normalizedPredicted.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-500 border-dashed" style={{ borderTopWidth: 2, borderStyle: 'dashed' }} />
            <span className="text-slate-600">Your Prediction</span>
          </div>
        )}
        {showActual && normalizedActual.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-green-500" />
            <span className="text-slate-600">Actual</span>
          </div>
        )}
      </div>
    </div>
  );
}
