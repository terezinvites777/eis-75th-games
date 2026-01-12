// src/components/predict/CurveDrawer.tsx
// Interactive curve drawing tool for epidemic predictions

import { useState, useRef, useCallback, useEffect } from 'react';
import type { DataPoint } from '../../types/predict';
import { Pencil, RotateCcw } from 'lucide-react';

interface CurveDrawerProps {
  historicalData: DataPoint[];
  minWeek?: number;
  maxWeek?: number;
  maxCases?: number;
  onCurveChange: (predictedCurve: DataPoint[]) => void;
  height?: number;
}

export function CurveDrawer({
  historicalData,
  minWeek,
  maxWeek,
  maxCases,
  onCurveChange,
  height = 280,
}: CurveDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predictedPoints, setPredictedPoints] = useState<DataPoint[]>([]);

  const lastHistorical = historicalData[historicalData.length - 1];
  const effectiveMinWeek = minWeek ?? Math.min(...historicalData.map(d => d.week));
  const effectiveMaxWeek = maxWeek ?? (lastHistorical.week + 12);
  const effectiveMaxCases = maxCases ?? Math.max(...historicalData.map(d => d.cases)) * 5;

  // SVG viewBox dimensions
  const viewBoxWidth = 100;
  const viewBoxHeight = 70;
  const padding = { left: 8, right: 4, top: 8, bottom: 12 };
  const chartWidth = viewBoxWidth - padding.left - padding.right;
  const chartHeight = viewBoxHeight - padding.top - padding.bottom;

  // Convert week/cases to SVG coordinates
  const weekToX = useCallback((week: number) => {
    return padding.left + ((week - effectiveMinWeek) / (effectiveMaxWeek - effectiveMinWeek)) * chartWidth;
  }, [effectiveMinWeek, effectiveMaxWeek, chartWidth]);

  const casesToY = useCallback((cases: number) => {
    return padding.top + chartHeight - (cases / effectiveMaxCases) * chartHeight;
  }, [effectiveMaxCases, chartHeight]);

  // Convert SVG coordinates to week/cases
  const xToWeek = useCallback((x: number) => {
    const week = effectiveMinWeek + ((x - padding.left) / chartWidth) * (effectiveMaxWeek - effectiveMinWeek);
    return Math.round(week);
  }, [effectiveMinWeek, effectiveMaxWeek, chartWidth]);

  const yToCases = useCallback((y: number) => {
    const cases = ((padding.top + chartHeight - y) / chartHeight) * effectiveMaxCases;
    return Math.max(0, Math.round(cases));
  }, [effectiveMaxCases, chartHeight]);

  // Convert mouse/touch position to SVG coordinates
  const getEventPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return null;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const pt = svg.createSVGPoint();

    // Handle both mouse and touch events
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    pt.x = clientX - rect.left;
    pt.y = clientY - rect.top;

    // Scale to viewBox coordinates
    const svgX = (pt.x / rect.width) * viewBoxWidth;
    const svgY = (pt.y / rect.height) * viewBoxHeight;

    return { x: svgX, y: svgY };
  }, []);

  // Handle drawing
  const handleDrawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);

    const pos = getEventPosition(e);
    if (!pos) return;

    const week = xToWeek(pos.x);
    const cases = yToCases(pos.y);

    // Only allow drawing after historical data
    if (week > lastHistorical.week) {
      setPredictedPoints([{ week, cases }]);
    }
  }, [getEventPosition, xToWeek, yToCases, lastHistorical.week]);

  const handleDrawMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getEventPosition(e);
    if (!pos) return;

    const week = xToWeek(pos.x);
    const cases = yToCases(pos.y);

    // Only allow drawing after historical data
    if (week > lastHistorical.week && week <= effectiveMaxWeek) {
      setPredictedPoints(prev => {
        // Remove any existing point at this week and add new one
        const filtered = prev.filter(p => p.week !== week);
        return [...filtered, { week, cases }].sort((a, b) => a.week - b.week);
      });
    }
  }, [isDrawing, getEventPosition, xToWeek, yToCases, lastHistorical.week, effectiveMaxWeek]);

  const handleDrawEnd = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Notify parent of curve changes
  useEffect(() => {
    onCurveChange(predictedPoints);
  }, [predictedPoints, onCurveChange]);

  // Create path string from points
  const createPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${weekToX(p.week)} ${casesToY(p.cases)}`)
      .join(' ');
  };

  // Create area path (for fill)
  const createAreaPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    const baseline = casesToY(0);
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${weekToX(p.week)} ${casesToY(p.cases)}`).join(' ');
    return `${path} L ${weekToX(points[points.length - 1].week)} ${baseline} L ${weekToX(points[0].week)} ${baseline} Z`;
  };

  // Clear drawing
  const handleClear = () => {
    setPredictedPoints([]);
    onCurveChange([]);
  };

  // Calculate stats from prediction
  const getPredictionStats = () => {
    if (predictedPoints.length === 0) return null;
    const maxPoint = predictedPoints.reduce((max, p) => p.cases > max.cases ? p : max, predictedPoints[0]);
    const totalCases = [...historicalData, ...predictedPoints].reduce((sum, p) => sum + p.cases, 0);
    return {
      peakWeek: maxPoint.week,
      peakCases: maxPoint.cases,
      totalCases,
    };
  };

  const stats = getPredictionStats();

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border-2 border-blue-500/30">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Pencil size={14} className="text-blue-400" />
          Draw Your Prediction
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={12} />
          Clear
        </button>
      </div>

      {/* Chart */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full cursor-crosshair select-none touch-none"
        style={{ height }}
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
        onTouchStart={handleDrawStart}
        onTouchMove={handleDrawMove}
        onTouchEnd={handleDrawEnd}
      >
        {/* Background */}
        <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="#0f172a" />

        {/* Grid */}
        <defs>
          <pattern id="grid-predict" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#grid-predict)" />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const cases = Math.round(effectiveMaxCases * (1 - pct));
          const y = padding.top + chartHeight * pct;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke="#334155" strokeWidth="0.2" />
              <text x={padding.left - 1} y={y} textAnchor="end" className="text-[3px] fill-slate-500">{cases.toLocaleString()}</text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {Array.from({ length: Math.min(8, effectiveMaxWeek - effectiveMinWeek + 1) }, (_, i) => {
          const step = Math.ceil((effectiveMaxWeek - effectiveMinWeek) / 7);
          const week = effectiveMinWeek + i * step;
          if (week > effectiveMaxWeek) return null;
          const x = weekToX(week);
          return (
            <text key={i} x={x} y={viewBoxHeight - 2} textAnchor="middle" className="text-[3px] fill-slate-500">
              W{week}
            </text>
          );
        })}

        {/* Historical data area fill */}
        <path
          d={createAreaPath(historicalData)}
          fill="rgba(100, 116, 139, 0.2)"
        />

        {/* Historical data line */}
        <path
          d={createPath(historicalData)}
          fill="none"
          stroke="#64748b"
          strokeWidth="1"
        />

        {/* Historical data points */}
        {historicalData.map((p, i) => (
          <circle
            key={i}
            cx={weekToX(p.week)}
            cy={casesToY(p.cases)}
            r="1.2"
            fill="#94a3b8"
          />
        ))}

        {/* "NOW" divider line */}
        <line
          x1={weekToX(lastHistorical.week)}
          y1={padding.top}
          x2={weekToX(lastHistorical.week)}
          y2={padding.top + chartHeight}
          stroke="#fbbf24"
          strokeWidth="0.5"
          strokeDasharray="2 1"
        />
        <text
          x={weekToX(lastHistorical.week) + 1}
          y={padding.top + 3}
          className="text-[3px] fill-amber-400 font-bold"
        >
          NOW
        </text>

        {/* Drawing zone indicator */}
        <rect
          x={weekToX(lastHistorical.week)}
          y={padding.top}
          width={chartWidth - (weekToX(lastHistorical.week) - padding.left)}
          height={chartHeight}
          fill="rgba(59, 130, 246, 0.05)"
        />

        {/* Predicted curve - area fill */}
        {predictedPoints.length > 0 && (
          <path
            d={createAreaPath(predictedPoints)}
            fill="rgba(59, 130, 246, 0.15)"
          />
        )}

        {/* Connection line from last historical to first predicted */}
        {predictedPoints.length > 0 && (
          <line
            x1={weekToX(lastHistorical.week)}
            y1={casesToY(lastHistorical.cases)}
            x2={weekToX(predictedPoints[0].week)}
            y2={casesToY(predictedPoints[0].cases)}
            stroke="#3b82f6"
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
        )}

        {/* Predicted curve line */}
        {predictedPoints.length > 0 && (
          <path
            d={createPath(predictedPoints)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))' }}
          />
        )}

        {/* Predicted points */}
        {predictedPoints.map((p, i) => (
          <circle
            key={i}
            cx={weekToX(p.week)}
            cy={casesToY(p.cases)}
            r="1.5"
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="0.4"
          />
        ))}

        {/* Peak marker on prediction */}
        {stats && (
          <g>
            <circle
              cx={weekToX(stats.peakWeek)}
              cy={casesToY(stats.peakCases)}
              r="2.5"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="0.5"
            />
            <text
              x={weekToX(stats.peakWeek)}
              y={casesToY(stats.peakCases) - 3}
              textAnchor="middle"
              className="text-[3px] fill-amber-400 font-bold"
            >
              PEAK
            </text>
          </g>
        )}
      </svg>

      {/* Footer with stats */}
      <div className="bg-slate-800 px-4 py-3 border-t border-slate-700">
        {stats ? (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-slate-500 uppercase">Peak Week</div>
              <div className="text-lg font-bold text-blue-400">Week {stats.peakWeek}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">Peak Cases</div>
              <div className="text-lg font-bold text-amber-400">{stats.peakCases.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase">Total Cases</div>
              <div className="text-lg font-bold text-green-400">{stats.totalCases.toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-sm">
            Click and drag in the blue zone to draw your predicted epidemic curve
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-center gap-6 text-xs border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-slate-500 rounded" />
          <span className="text-slate-400">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500 rounded" />
          <span className="text-slate-400">Your Prediction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border-2 border-amber-400" />
          <span className="text-slate-400">Peak</span>
        </div>
      </div>
    </div>
  );
}

export default CurveDrawer;
