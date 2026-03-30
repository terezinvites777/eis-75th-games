// src/components/predict/CurveDrawer.tsx
// Interactive curve drawing - THE main game feature
// Styled to match Disease Detective aesthetic

import { useState, useRef, useCallback, useEffect } from 'react';
import type { DataPoint } from '../../types/predict';
import { Pencil, RotateCcw, Target, TrendingUp, Calendar, Zap } from 'lucide-react';

interface CurveDrawerProps {
  historicalData: DataPoint[];
  minWeek?: number;
  maxWeek?: number;
  maxCases?: number;
  onCurveChange: (predictedCurve: DataPoint[]) => void;
  onStatsChange?: (stats: { peakWeek: number; peakCases: number; totalCases: number } | null) => void;
}

export function CurveDrawer({
  historicalData,
  minWeek,
  maxWeek,
  maxCases,
  onCurveChange,
  onStatsChange,
}: CurveDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predictedPoints, setPredictedPoints] = useState<DataPoint[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  const lastHistorical = historicalData[historicalData.length - 1];
  const effectiveMinWeek = minWeek ?? Math.min(...historicalData.map(d => d.week));
  const effectiveMaxWeek = maxWeek ?? (lastHistorical.week + 12);

  // Calculate nice round Y-axis scale
  // Use 5x multiplier - actual peaks are typically 2-4x historical max
  const rawMaxCases = maxCases ?? Math.max(...historicalData.map(d => d.cases)) * 5;

  // Get nice tick values for the scale
  const getNiceScale = (max: number): { ticks: number[]; scaleMax: number } => {
    if (max <= 0) return { ticks: [0], scaleMax: 1 };
    const roughStep = max / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const residual = roughStep / magnitude;
    let niceStep: number;
    if (residual <= 1.5) niceStep = magnitude;
    else if (residual <= 3) niceStep = 2 * magnitude;
    else if (residual <= 7) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;
    const ticks: number[] = [];
    for (let tick = 0; tick <= max * 1.1; tick += niceStep) {
      ticks.push(tick);
      if (ticks.length >= 6) break;
    }
    return { ticks: ticks.reverse(), scaleMax: ticks[0] }; // Reversed, max is first
  };

  const { ticks: yAxisTicks, scaleMax } = getNiceScale(rawMaxCases);
  const effectiveMaxCases = scaleMax; // Use nice round number for scale

  // SVG viewBox dimensions - wider for better drawing
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  const padding = { left: 45, right: 20, top: 25, bottom: 30 };
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

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const svgX = ((clientX - rect.left) / rect.width) * viewBoxWidth;
    const svgY = ((clientY - rect.top) / rect.height) * viewBoxHeight;

    return { x: svgX, y: svgY };
  }, []);

  // Handle drawing
  const handleDrawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);

    const pos = getEventPosition(e);
    if (!pos) return;

    const week = xToWeek(pos.x);
    const cases = yToCases(pos.y);

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

    if (week > lastHistorical.week && week <= effectiveMaxWeek) {
      setPredictedPoints(prev => {
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

  // Calculate and notify stats
  useEffect(() => {
    if (predictedPoints.length > 0 && onStatsChange) {
      const maxPoint = predictedPoints.reduce((max, p) => p.cases > max.cases ? p : max, predictedPoints[0]);
      const totalCases = [...historicalData, ...predictedPoints].reduce((sum, p) => sum + p.cases, 0);
      onStatsChange({
        peakWeek: maxPoint.week,
        peakCases: maxPoint.cases,
        totalCases,
      });
    } else if (onStatsChange) {
      onStatsChange(null);
    }
  }, [predictedPoints, historicalData, onStatsChange]);

  // Create smooth path
  const createPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${weekToX(p.week)} ${casesToY(p.cases)}`).join(' ');
  };

  // Create area path for gradient fill
  const createAreaPath = (points: DataPoint[]) => {
    if (points.length === 0) return '';
    const baseline = casesToY(0);
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${weekToX(p.week)} ${casesToY(p.cases)}`).join(' ');
    return `${path} L ${weekToX(points[points.length - 1].week)} ${baseline} L ${weekToX(points[0].week)} ${baseline} Z`;
  };

  const handleClear = () => {
    setPredictedPoints([]);
    setHasDrawn(false);
  };

  // Get prediction stats
  const stats = predictedPoints.length > 0 ? (() => {
    const maxPoint = predictedPoints.reduce((max, p) => p.cases > max.cases ? p : max, predictedPoints[0]);
    const totalCases = [...historicalData, ...predictedPoints].reduce((sum, p) => sum + p.cases, 0);
    return { peakWeek: maxPoint.week, peakCases: maxPoint.cases, totalCases };
  })() : null;

  // X-axis week labels
  const weekRange = effectiveMaxWeek - effectiveMinWeek;
  const weekStep = Math.max(1, Math.ceil(weekRange / 8));
  const xTicks: number[] = [];
  for (let w = effectiveMinWeek; w <= effectiveMaxWeek; w += weekStep) {
    xTicks.push(w);
  }

  return (
    <div className="panel overflow-hidden flex flex-col h-full">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />

      {/* Header with instructions */}
      <div className="section-header mb-4 pt-1">
        <Pencil size={18} className="text-[var(--theme-primary)]" />
        <span className="section-title">Draw Your Prediction</span>
        <div className="section-header-line" />
        {hasDrawn && (
          <button
            onClick={handleClear}
            className="btn-emboss btn-emboss-sm"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500 mb-3">Click and drag in the shaded area to forecast the epidemic curve</p>

      {/* Main Chart */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 flex-1 min-h-[220px]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full cursor-crosshair select-none touch-none bg-slate-50"
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleDrawStart}
          onMouseMove={handleDrawMove}
          onMouseUp={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
          onTouchStart={handleDrawStart}
          onTouchMove={handleDrawMove}
          onTouchEnd={handleDrawEnd}
        >
          {/* Definitions */}
          <defs>
            {/* Grid pattern */}
            <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="0.5" />
            </pattern>

            {/* Historical area gradient */}
            <linearGradient id="historical-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(100, 116, 139, 0.3)" />
              <stop offset="100%" stopColor="rgba(100, 116, 139, 0.02)" />
            </linearGradient>

            {/* Predicted area gradient - using theme colors */}
            <linearGradient id="predicted-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(37, 99, 235, 0.4)" />
              <stop offset="100%" stopColor="rgba(37, 99, 235, 0.02)" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="#f8fafc" />
          <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="url(#grid-pattern)" />

          {/* Y-axis gridlines and labels */}
          {yAxisTicks.map((val, i) => {
            const y = casesToY(val);
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={padding.left + chartWidth} y2={y} stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.5" />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {xTicks.map((week, i) => {
            const x = weekToX(week);
            return (
              <text key={i} x={x} y={viewBoxHeight - 8} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">
                W{week}
              </text>
            );
          })}

          {/* Drawing zone highlight */}
          <rect
            x={weekToX(lastHistorical.week)}
            y={padding.top}
            width={chartWidth - (weekToX(lastHistorical.week) - padding.left)}
            height={chartHeight}
            fill="rgba(37, 99, 235, 0.05)"
            className={isDrawing ? 'animate-pulse' : ''}
          />

          {/* Historical data area */}
          <path d={createAreaPath(historicalData)} fill="url(#historical-gradient)" />

          {/* Historical data line */}
          <path
            d={createPath(historicalData)}
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Historical data points */}
          {historicalData.map((p, i) => (
            <circle
              key={i}
              cx={weekToX(p.week)}
              cy={casesToY(p.cases)}
              r="4"
              fill="#64748b"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* NOW divider */}
          <line
            x1={weekToX(lastHistorical.week)}
            y1={padding.top}
            x2={weekToX(lastHistorical.week)}
            y2={padding.top + chartHeight}
            stroke="var(--theme-primary, #2563eb)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <rect
            x={weekToX(lastHistorical.week) - 18}
            y={padding.top - 2}
            width="36"
            height="14"
            rx="3"
            fill="var(--theme-primary, #2563eb)"
          />
          <text
            x={weekToX(lastHistorical.week)}
            y={padding.top + 8}
            textAnchor="middle"
            className="text-[8px] fill-white font-bold"
          >
            NOW
          </text>

          {/* Connection line to first predicted point */}
          {predictedPoints.length > 0 && (
            <line
              x1={weekToX(lastHistorical.week)}
              y1={casesToY(lastHistorical.cases)}
              x2={weekToX(predictedPoints[0].week)}
              y2={casesToY(predictedPoints[0].cases)}
              stroke="var(--theme-primary, #2563eb)"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.7"
            />
          )}

          {/* Predicted curve area */}
          {predictedPoints.length > 0 && (
            <path d={createAreaPath(predictedPoints)} fill="url(#predicted-gradient)" />
          )}

          {/* Predicted curve line */}
          {predictedPoints.length > 0 && (
            <path
              d={createPath(predictedPoints)}
              fill="none"
              stroke="var(--theme-primary, #2563eb)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          )}

          {/* Predicted points */}
          {predictedPoints.map((p, i) => (
            <circle
              key={i}
              cx={weekToX(p.week)}
              cy={casesToY(p.cases)}
              r="5"
              fill="var(--theme-primary, #2563eb)"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Peak marker */}
          {stats && (
            <g>
              <circle
                cx={weekToX(stats.peakWeek)}
                cy={casesToY(stats.peakCases)}
                r="12"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                className="animate-ping"
                style={{ animationDuration: '2s' }}
              />
              <circle
                cx={weekToX(stats.peakWeek)}
                cy={casesToY(stats.peakCases)}
                r="8"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={weekToX(stats.peakWeek)}
                y={casesToY(stats.peakCases) - 16}
                textAnchor="middle"
                className="text-[10px] fill-amber-500 font-bold"
              >
                PEAK
              </text>
            </g>
          )}

          {/* Instructions overlay when not drawn */}
          {!hasDrawn && (
            <g>
              <rect
                x={weekToX(lastHistorical.week) + 20}
                y={viewBoxHeight / 2 - 20}
                width="120"
                height="40"
                rx="8"
                fill="rgba(37, 99, 235, 0.1)"
                stroke="rgba(37, 99, 235, 0.3)"
                strokeWidth="1"
              />
              <text
                x={weekToX(lastHistorical.week) + 80}
                y={viewBoxHeight / 2 - 2}
                textAnchor="middle"
                className="text-[10px] fill-blue-600 font-medium"
              >
                Draw here
              </text>
              <text
                x={weekToX(lastHistorical.week) + 80}
                y={viewBoxHeight / 2 + 10}
                textAnchor="middle"
                className="text-[8px] fill-blue-400"
              >
                Click & drag to predict
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Stats Footer */}
      <div className="mt-4">
        {stats ? (
          <div className="grid grid-cols-3 gap-3">
            <div className="stat-card">
              <div className="stat-value text-[var(--theme-primary)]">Week {stats.peakWeek}</div>
              <div className="stat-label flex items-center justify-center gap-1">
                <Calendar size={10} />
                Peak Week
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-amber-500">{stats.peakCases.toLocaleString()}</div>
              <div className="stat-label flex items-center justify-center gap-1">
                <TrendingUp size={10} />
                Peak (1 Week)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-green-600">{stats.totalCases.toLocaleString()}</div>
              <div className="stat-label flex items-center justify-center gap-1">
                <Target size={10} />
                Total (All Weeks)
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-[var(--theme-surface)] rounded-lg">
            <div className="flex items-center justify-center gap-2 text-[var(--theme-primary)]">
              <Zap size={16} className="animate-pulse" />
              <span className="text-sm font-medium">Draw your prediction curve to see stats</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-slate-500 rounded" />
          <span>Historical Data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[var(--theme-primary)] rounded" style={{ boxShadow: '0 0 4px var(--theme-primary)' }} />
          <span>Your Prediction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Peak</span>
        </div>
      </div>
    </div>
  );
}

export default CurveDrawer;
