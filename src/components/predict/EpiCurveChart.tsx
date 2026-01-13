// src/components/predict/EpiCurveChart.tsx
// Polished SVG-based epidemic curve visualization with smooth connected curves

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
      week: d.week < baseWeek - 10 ? d.week + 52 : d.week
    }));
  };

  const baseWeek = historicalData.length > 0 ? historicalData[0].week : 1;

  // Normalize all data to handle year wraparound
  const normalizedHistorical = normalizeWeeks(historicalData, baseWeek);
  const normalizedPredicted = predictedData ? normalizeWeeks(predictedData, baseWeek) : [];
  const normalizedActual = actualData ? normalizeWeeks(actualData, baseWeek) : [];

  // Create combined continuous data for the full outbreak view
  const combinedFullCurve = showActual && normalizedActual.length > 0
    ? [...normalizedHistorical, ...normalizedActual]
    : normalizedHistorical;

  // Combine all data to find scale
  const allData = [
    ...normalizedHistorical,
    ...normalizedPredicted,
    ...(showActual && normalizedActual.length > 0 ? normalizedActual : []),
  ];

  const maxDataCases = Math.max(...allData.map(d => d.cases), 1);
  const allWeeks = allData.map(d => d.week);
  const minWeek = Math.min(...allWeeks);
  const maxWeek = Math.max(...allWeeks);
  const weekSpan = maxWeek - minWeek + 1;

  // Calculate nice round Y-axis tick values
  const getNiceYTicks = (max: number): number[] => {
    if (max <= 0) return [0];

    // Find a nice step size (1, 2, 5, 10, 20, 50, 100, etc.)
    const roughStep = max / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const residual = roughStep / magnitude;

    let niceStep: number;
    if (residual <= 1.5) niceStep = magnitude;
    else if (residual <= 3) niceStep = 2 * magnitude;
    else if (residual <= 7) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;

    // Generate ticks from 0 up to and beyond max
    const ticks: number[] = [];
    for (let tick = 0; tick <= max * 1.1; tick += niceStep) {
      ticks.push(tick);
      if (ticks.length >= 6) break; // Max 6 ticks
    }

    return ticks;
  };

  const yTicks = getNiceYTicks(maxDataCases);
  const maxCases = yTicks[yTicks.length - 1] || maxDataCases; // Use max tick for scale

  // Fixed viewBox dimensions for consistent aspect ratio
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  const padding = { top: 20, right: 25, bottom: 40, left: 50 };
  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  const xScale = (week: number) => padding.left + ((week - minWeek) / weekSpan) * chartWidth;
  const yScale = (cases: number) => padding.top + chartHeight - (cases / maxCases) * chartHeight;

  // Create smooth bezier curve path
  const createSmoothPath = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    if (data.length === 1) return `M ${xScale(data[0].week)} ${yScale(data[0].cases)}`;

    let path = `M ${xScale(data[0].week)} ${yScale(data[0].cases)}`;

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const prevX = xScale(prev.week);
      const prevY = yScale(prev.cases);
      const currX = xScale(curr.week);
      const currY = yScale(curr.cases);

      // Control points for smooth curve
      const cpX = (prevX + currX) / 2;
      path += ` C ${cpX} ${prevY}, ${cpX} ${currY}, ${currX} ${currY}`;
    }

    return path;
  };

  // Create smooth area path with filled region
  const createSmoothArea = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    const linePath = createSmoothPath(data);
    const firstX = xScale(data[0].week);
    const lastX = xScale(data[data.length - 1].week);
    const baseY = yScale(0);
    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  // Get unique week labels with good spacing
  const getWeekLabels = () => {
    const uniqueWeeks = [...new Set(allData.map(d => d.week))].sort((a, b) => a - b);
    const step = Math.max(1, Math.ceil(uniqueWeeks.length / 8));
    return uniqueWeeks.filter((_, i) => i % step === 0);
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full"
        style={{ maxHeight: '320px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for historical area */}
          <linearGradient id="historicalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.05" />
          </linearGradient>
          {/* Gradient for actual outbreak area */}
          <linearGradient id="actualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
          </linearGradient>
          {/* Gradient for predicted area */}
          <linearGradient id="predictedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          {/* Combined gradient for full curve */}
          <linearGradient id="combinedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.08" />
          </linearGradient>
        </defs>

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
            strokeDasharray="3 3"
          />
        ))}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={viewBoxWidth - padding.right}
          y2={padding.top + chartHeight}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {yTicks.map((val, i) => {
          const y = yScale(val);
          return (
            <text
              key={`y-${i}`}
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
            </text>
          );
        })}

        {/* Y-axis title */}
        <text
          x={12}
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          fontSize="9"
          fill="#94a3b8"
          transform={`rotate(-90, 12, ${padding.top + chartHeight / 2})`}
        >
          Cases
        </text>

        {/* When showing actual: render combined smooth curve */}
        {showActual && normalizedActual.length > 0 ? (
          <>
            {/* Combined area fill */}
            <path
              d={createSmoothArea(combinedFullCurve)}
              fill="url(#combinedGradient)"
            />

            {/* Historical portion line */}
            <path
              d={createSmoothPath(normalizedHistorical)}
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Connecting line from last historical to first actual */}
            {normalizedHistorical.length > 0 && normalizedActual.length > 0 && (
              <line
                x1={xScale(normalizedHistorical[normalizedHistorical.length - 1].week)}
                y1={yScale(normalizedHistorical[normalizedHistorical.length - 1].cases)}
                x2={xScale(normalizedActual[0].week)}
                y2={yScale(normalizedActual[0].cases)}
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Actual outbreak line */}
            <path
              d={createSmoothPath(normalizedActual)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points for historical */}
            {normalizedHistorical.map((d, i) => (
              <circle
                key={`hist-${i}`}
                cx={xScale(d.week)}
                cy={yScale(d.cases)}
                r="3"
                fill="#fff"
                stroke="#64748b"
                strokeWidth="2"
              />
            ))}

            {/* Data points for actual */}
            {normalizedActual.map((d, i) => (
              <circle
                key={`actual-${i}`}
                cx={xScale(d.week)}
                cy={yScale(d.cases)}
                r="3"
                fill="#fff"
                stroke="#22c55e"
                strokeWidth="2"
              />
            ))}
          </>
        ) : (
          <>
            {/* Historical area only */}
            <path
              d={createSmoothArea(normalizedHistorical)}
              fill="url(#historicalGradient)"
            />

            {/* Predicted area (if exists) */}
            {normalizedPredicted.length > 0 && (
              <path
                d={createSmoothArea(normalizedPredicted)}
                fill="url(#predictedGradient)"
              />
            )}

            {/* Historical line */}
            <path
              d={createSmoothPath(normalizedHistorical)}
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Predicted line */}
            {normalizedPredicted.length > 0 && (
              <path
                d={createSmoothPath(normalizedPredicted)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeDasharray="6 3"
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
                r="3"
                fill="#fff"
                stroke="#64748b"
                strokeWidth="2"
              />
            ))}
          </>
        )}

        {/* Week labels */}
        {getWeekLabels().map((week, i) => {
          const displayWeek = week > 52 ? week - 52 : week;
          return (
            <text
              key={`label-${i}`}
              x={xScale(week)}
              y={viewBoxHeight - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              W{displayWeek}
            </text>
          );
        })}

        {/* X-axis title */}
        <text
          x={padding.left + chartWidth / 2}
          y={viewBoxHeight - 2}
          textAnchor="middle"
          fontSize="9"
          fill="#94a3b8"
        >
          Epidemic Week
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded bg-slate-500" />
          <span className="text-slate-600 font-medium">Historical</span>
        </div>
        {normalizedPredicted.length > 0 && !showActual && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded bg-blue-500" style={{ background: 'repeating-linear-gradient(90deg, #3b82f6, #3b82f6 4px, transparent 4px, transparent 7px)' }} />
            <span className="text-slate-600 font-medium">Your Prediction</span>
          </div>
        )}
        {showActual && normalizedActual.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded bg-green-500" />
            <span className="text-slate-600 font-medium">Actual Outbreak</span>
          </div>
        )}
      </div>
    </div>
  );
}
