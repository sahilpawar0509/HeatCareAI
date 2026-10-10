import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  CalendarDays,
  Download,
  Info,
} from "lucide-react";

const DEMO_FORECAST_DATA = [
  { day: "Mon", actual: 68, forecast: 72, upper: 82, lower: 62 },
  { day: "Tue", actual: 74, forecast: 76, upper: 88, lower: 64 },
  { day: "Wed", actual: 82, forecast: 85, upper: 98, lower: 72 },
  { day: "Thu", actual: 91, forecast: 94, upper: 109, lower: 79 },
  { day: "Fri", actual: 105, forecast: 108, upper: 124, lower: 92 },
  { day: "Sat", actual: 112, forecast: 116, upper: 133, lower: 99 },
  { day: "Sun", actual: 98, forecast: 104, upper: 120, lower: 88 },
  { day: "Mon", actual: null, forecast: 121, upper: 140, lower: 102 },
  { day: "Tue", actual: null, forecast: 128, upper: 148, lower: 108 },
  { day: "Wed", actual: null, forecast: 136, upper: 157, lower: 115 },
  { day: "Thu", actual: null, forecast: 142, upper: 164, lower: 120 },
  { day: "Fri", actual: null, forecast: 151, upper: 174, lower: 128 },
  { day: "Sat", actual: null, forecast: 159, upper: 183, lower: 135 },
  { day: "Sun", actual: null, forecast: 146, upper: 168, lower: 124 },
];

const PERIODS = {
  "7 days": 7,
  "14 days": 14,
};

function ForecastTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;

  return (
    <div className="forecast-tooltip">
      <p className="forecast-tooltip-title">{label}</p>

      {point?.actual !== null && point?.actual !== undefined && (
        <div className="forecast-tooltip-row">
          <span className="forecast-tooltip-dot actual-dot" />
          <span>Actual demand</span>
          <strong>{point.actual}</strong>
        </div>
      )}

      <div className="forecast-tooltip-row">
        <span className="forecast-tooltip-dot forecast-dot" />
        <span>Forecast demand</span>
        <strong>{point?.forecast ?? "—"}</strong>
      </div>

      <div className="forecast-tooltip-divider" />

      <div className="forecast-tooltip-row muted">
        <span>Lower estimate</span>
        <strong>{point?.lower ?? "—"}</strong>
      </div>

      <div className="forecast-tooltip-row muted">
        <span>Upper estimate</span>
        <strong>{point?.upper ?? "—"}</strong>
      </div>

      <p className="forecast-tooltip-note">
        Illustrative demonstration values
      </p>
    </div>
  );
}

export default function ForecastChart({
  data,
  title = "Emergency Demand Forecast",
  subtitle = "Historical demand and projected emergency attendance",
  loading = false,
  showActual = true,
  showRange = true,
  onExport,
  className = "",
}) {
  const [period, setPeriod] = useState("14 days");
  const [chartType, setChartType] = useState("area");

  const sourceData =
    Array.isArray(data) && data.length > 0
      ? data
      : DEMO_FORECAST_DATA;

  const chartData = useMemo(() => {
    return sourceData.slice(0, PERIODS[period]).map((item, index) => ({
      day: item.day ?? item.date ?? `Day ${index + 1}`,
      actual:
        item.actual === undefined
          ? null
          : item.actual,
      forecast:
        item.forecast ??
        item.predicted ??
        item.demand ??
        null,
      upper:
        item.upper ??
        item.upper_bound ??
        null,
      lower:
        item.lower ??
        item.lower_bound ??
        null,
    }));
  }, [sourceData, period]);

  const hasActualData = chartData.some(
    (item) => item.actual !== null && item.actual !== undefined
  );

  const forecastValues = chartData
    .map((item) => Number(item.forecast))
    .filter(Number.isFinite);

  const averageForecast =
    forecastValues.length > 0
      ? Math.round(
          forecastValues.reduce((sum, value) => sum + value, 0) /
            forecastValues.length
        )
      : null;

  const peakForecast =
    forecastValues.length > 0
      ? Math.max(...forecastValues)
      : null;

  const exportCSV = () => {
    if (onExport) {
      onExport(chartData);
      return;
    }

    const columns = ["Day", "Actual Demand", "Forecast Demand", "Lower Estimate", "Upper Estimate"];

    const rows = chartData.map((item) => [
      item.day,
      item.actual ?? "",
      item.forecast ?? "",
      item.lower ?? "",
      item.upper ?? "",
    ]);

    const csvContent = [
      columns,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "heatcare-demand-forecast.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className={`forecast-chart-card ${className}`}>
      <div className="forecast-chart-header">
        <div className="forecast-chart-heading">
          <div className="forecast-chart-title-row">
            <div className="forecast-chart-icon">
              <TrendingUp size={19} />
            </div>

            <div>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="forecast-chart-actions">
          <div className="forecast-period-selector">
            <CalendarDays size={14} />

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Forecast period"
            >
              <option value="7 days">7 days</option>
              <option value="14 days">14 days</option>
            </select>
          </div>

          <button
            type="button"
            className="forecast-export-button"
            onClick={exportCSV}
            title="Export forecast as CSV"
          >
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="forecast-chart-summary">
        <div className="forecast-summary-item">
          <span className="forecast-summary-label">
            Average forecast
          </span>

          <strong>
            {loading ? "—" : averageForecast ?? "—"}
          </strong>

          <span className="forecast-summary-unit">
            visits / day
          </span>
        </div>

        <div className="forecast-summary-divider" />

        <div className="forecast-summary-item">
          <span className="forecast-summary-label">
            Peak forecast
          </span>

          <strong>
            {loading ? "—" : peakForecast ?? "—"}
          </strong>

          <span className="forecast-summary-unit">
            visits / day
          </span>
        </div>

        <div className="forecast-summary-divider" />

        <div className="forecast-summary-item">
          <span className="forecast-summary-label">
            Forecast horizon
          </span>

          <strong>{period === "7 days" ? "7" : "14"}</strong>

          <span className="forecast-summary-unit">
            days
          </span>
        </div>
      </div>

      <div className="forecast-chart-legend">
        <div className="forecast-legend-items">
          {showActual && hasActualData && (
            <span className="forecast-legend-item">
              <span className="legend-line legend-actual" />
              Actual demand
            </span>
          )}

          <span className="forecast-legend-item">
            <span className="legend-line legend-predicted" />
            Forecast demand
          </span>

          {showRange && (
            <span className="forecast-legend-item">
              <span className="legend-range" />
              Estimated range
            </span>
          )}
        </div>

        <div className="forecast-chart-type">
          <button
            type="button"
            className={chartType === "area" ? "selected" : ""}
            onClick={() => setChartType("area")}
          >
            Area
          </button>

          <button
            type="button"
            className={chartType === "line" ? "selected" : ""}
            onClick={() => setChartType("line")}
          >
            Line
          </button>
        </div>
      </div>

      <div className="forecast-chart-body">
        {loading ? (
          <div className="forecast-chart-loading">
            <div className="forecast-chart-loader" />
            <p>Loading forecast data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={310}>
            {chartType === "area" ? (
              <AreaChart
                data={chartData}
                margin={{
                  top: 12,
                  right: 8,
                  left: -15,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="forecastAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3b82f6"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0.015}
                    />
                  </linearGradient>

                  <linearGradient
                    id="actualAreaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#10b981"
                      stopOpacity={0.14}
                    />

                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#edf2f7"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  padding={{ left: 8, right: 8 }}
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  allowDecimals={false}
                />

                <Tooltip
                  content={<ForecastTooltip />}
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeDasharray: "4 4",
                  }}
                />

                {showRange && (
                  <ReferenceLine
                    y={averageForecast}
                    stroke="#cbd5e1"
                    strokeDasharray="5 5"
                    label={{
                      value: "Forecast average",
                      position: "insideTopRight",
                      fill: "#94a3b8",
                      fontSize: 10,
                    }}
                  />
                )}

                {showActual && hasActualData && (
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual demand"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#actualAreaGradient)"
                    connectNulls={false}
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                )}

                <Area
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast demand"
                  stroke="#3b82f6"
                  strokeWidth={2.7}
                  fill="url(#forecastAreaGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            ) : (
              <LineChart
                data={chartData}
                margin={{
                  top: 12,
                  right: 8,
                  left: -15,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="#edf2f7"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  allowDecimals={false}
                />

                <Tooltip content={<ForecastTooltip />} />

                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingTop: "12px",
                  }}
                />

                {showActual && hasActualData && (
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual demand"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast demand"
                  stroke="#3b82f6"
                  strokeWidth={2.7}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      <div className="forecast-chart-disclaimer">
        <Info size={15} />

        <p>
          <strong>Demo data:</strong> These values are illustrative
          and are not live hospital observations or validated AI
          predictions. Connect verified historical attendance data
          and a trained forecasting model before using forecasts
          for operational decisions.
        </p>
      </div>

      <style>{`
        .forecast-chart-card {
          min-width: 0;
          padding: 23px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #e8edf4;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(15, 23, 42, 0.025);
        }

        .forecast-chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 22px;
        }

        .forecast-chart-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .forecast-chart-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          color: #2563eb;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 13px;
        }

        .forecast-chart-heading h3 {
          margin: 0;
          color: #0f172a;
          font-size: 15px;
          font-weight: 750;
          letter-spacing: -0.3px;
          line-height: 1.5;
        }

        .forecast-chart-heading p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.6;
        }

        .forecast-chart-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .forecast-period-selector {
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 9px;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .forecast-period-selector select {
          max-width: 105px;
          padding: 8px 0;
          color: #475569;
          font-size: 11px;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
        }

        .forecast-export-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 8px 11px;
          color: #475569;
          font-size: 11px;
          font-weight: 600;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .forecast-export-button:hover {
          color: #2563eb;
          background: #f8fbff;
          border-color: #bfdbfe;
        }

        .forecast-chart-summary {
          display: flex;
          align-items: center;
          gap: 26px;
          padding: 16px 18px;
          margin-bottom: 22px;
          background: linear-gradient(110deg, #f8fbff, #f8fafc);
          border: 1px solid #edf2f7;
          border-radius: 14px;
        }

        .forecast-summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .forecast-summary-label {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 550;
        }

        .forecast-summary-item strong {
          color: #0f172a;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.6px;
        }

        .forecast-summary-unit {
          color: #94a3b8;
          font-size: 10px;
        }

        .forecast-summary-divider {
          width: 1px;
          height: 46px;
          flex-shrink: 0;
          background: #e2e8f0;
        }

        .forecast-chart-legend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .forecast-legend-items {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 17px;
        }

        .forecast-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #64748b;
          font-size: 10px;
        }

        .legend-line {
          display: inline-block;
          width: 19px;
          height: 3px;
          border-radius: 4px;
        }

        .legend-actual {
          background: #10b981;
        }

        .legend-predicted {
          background: #3b82f6;
        }

        .legend-range {
          display: inline-block;
          width: 13px;
          height: 10px;
          background: #dbeafe;
          border: 1px solid #bfdbfe;
          border-radius: 3px;
        }

        .forecast-chart-type {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 3px;
          background: #f1f5f9;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .forecast-chart-type button {
          padding: 6px 9px;
          color: #64748b;
          font-size: 10px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .forecast-chart-type button.selected {
          color: #1d4ed8;
          font-weight: 700;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
        }

        .forecast-chart-body {
          width: 100%;
          min-width: 0;
          min-height: 310px;
        }

        .forecast-tooltip {
          min-width: 185px;
          padding: 13px;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
        }

        .forecast-tooltip-title {
          margin: 0 0 10px;
          color: #0f172a;
          font-size: 12px;
          font-weight: 750;
        }

        .forecast-tooltip-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 8px 0;
          color: #64748b;
          font-size: 10px;
        }

        .forecast-tooltip-row strong {
          margin-left: auto;
          color: #0f172a;
          font-size: 11px;
        }

        .forecast-tooltip-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
        }

        .actual-dot {
          background: #10b981;
        }

        .forecast-dot {
          background: #3b82f6;
        }

        .forecast-tooltip-divider {
          height: 1px;
          margin: 10px 0;
          background: #edf2f7;
        }

        .forecast-tooltip-row.muted {
          color: #94a3b8;
        }

        .forecast-tooltip-note {
          padding-top: 8px;
          margin: 8px 0 0;
          color: #94a3b8;
          font-size: 9px;
          border-top: 1px solid #edf2f7;
        }

        .forecast-chart-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 12px 13px;
          margin-top: 13px;
          color: #64748b;
          background: #f8fafc;
          border: 1px solid #edf2f7;
          border-radius: 11px;
        }

        .forecast-chart-disclaimer svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: #64748b;
        }

        .forecast-chart-disclaimer p {
          margin: 0;
          font-size: 10px;
          line-height: 1.7;
        }

        .forecast-chart-disclaimer strong {
          color: #475569;
        }

        .forecast-chart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 310px;
          gap: 12px;
        }

        .forecast-chart-loading p {
          color: #94a3b8;
          font-size: 12px;
        }

        .forecast-chart-loader {
          width: 30px;
          height: 30px;
          border: 3px solid #dbeafe;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: forecast-chart-spin 0.8s linear infinite;
        }

        @keyframes forecast-chart-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .forecast-chart-card {
            padding: 17px;
            border-radius: 17px;
          }

          .forecast-chart-header {
            flex-direction: column;
            gap: 15px;
          }

          .forecast-chart-actions {
            justify-content: flex-start;
            width: 100%;
          }

          .forecast-chart-summary {
            gap: 14px;
            padding: 13px;
          }

          .forecast-summary-item strong {
            font-size: 19px;
          }

          .forecast-chart-legend {
            align-items: flex-start;
            flex-direction: column;
          }

          .forecast-chart-body {
            min-height: 280px;
          }
        }

        @media (max-width: 480px) {
          .forecast-chart-card {
            padding: 14px;
          }

          .forecast-chart-title-row {
            align-items: flex-start;
            gap: 9px;
          }

          .forecast-chart-icon {
            width: 36px;
            height: 36px;
          }

          .forecast-chart-heading h3 {
            font-size: 13px;
          }

          .forecast-chart-heading p {
            font-size: 10px;
          }

          .forecast-chart-summary {
            align-items: stretch;
            gap: 8px;
            padding: 11px 8px;
          }

          .forecast-summary-item {
            flex: 1;
          }

          .forecast-summary-item strong {
            font-size: 17px;
          }

          .forecast-summary-label,
          .forecast-summary-unit {
            font-size: 9px;
          }

          .forecast-summary-divider {
            height: auto;
          }

          .forecast-legend-items {
            gap: 10px;
          }

          .forecast-legend-item {
            font-size: 9px;
          }

          .forecast-chart-body {
            min-height: 260px;
          }

          .forecast-export-button {
            padding: 8px;
          }

          .forecast-chart-disclaimer p {
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .forecast-chart-loader {
            animation: none;
          }

          .forecast-export-button {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}