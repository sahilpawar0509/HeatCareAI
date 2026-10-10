import React, { useMemo } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

const DEMO_FORECAST = {
  currentDemand: 124,
  predictedDemand: 158,
  previousDemand: 112,
  capacity: 180,
  confidence: 82,
  horizon: "Next 24 hours",
  updatedAt: "Demo snapshot",
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

export default function ForecastSummary({
  data = DEMO_FORECAST,
  title = "Demand Forecast Summary",
  subtitle = "A snapshot of projected emergency department demand.",
  loading = false,
  onViewForecast,
  className = "",
}) {
  const forecast = data || DEMO_FORECAST;

  const currentDemand = Number(forecast.currentDemand ?? 0);
  const predictedDemand = Number(forecast.predictedDemand ?? 0);
  const previousDemand = Number(forecast.previousDemand ?? 0);
  const capacity = Number(forecast.capacity ?? 0);

  const demandChange =
    previousDemand > 0
      ? ((predictedDemand - previousDemand) / previousDemand) * 100
      : 0;

  const capacityUsage =
    capacity > 0 ? (predictedDemand / capacity) * 100 : 0;

  const capacityStatus = useMemo(() => {
    if (capacityUsage >= 100) {
      return {
        label: "Capacity exceeded",
        color: "#dc2626",
        background: "#fef2f2",
      };
    }

    if (capacityUsage >= 85) {
      return {
        label: "High utilization",
        color: "#ea580c",
        background: "#fff7ed",
      };
    }

    return {
      label: "Within capacity",
      color: "#059669",
      background: "#ecfdf5",
    };
  }, [capacityUsage]);

  const metrics = [
    {
      label: "Current Demand",
      value: formatNumber(currentDemand),
      unit: "visits",
      description: "Illustrative current baseline",
      icon: Activity,
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      label: "Predicted Demand",
      value: formatNumber(predictedDemand),
      unit: "visits",
      description: forecast.horizon || "Forecast period",
      icon: TrendingUp,
      color: "#7c3aed",
      background: "#f5f3ff",
    },
    {
      label: "Demand Change",
      value: `${demandChange > 0 ? "+" : ""}${demandChange.toFixed(1)}%`,
      unit: "vs previous baseline",
      description:
        demandChange > 0
          ? "Projected demand increase"
          : demandChange < 0
          ? "Projected demand decrease"
          : "No projected change",
      icon: demandChange >= 0 ? ArrowUpRight : ArrowDownRight,
      color: demandChange > 0 ? "#ea580c" : "#059669",
      background: demandChange > 0 ? "#fff7ed" : "#ecfdf5",
    },
    {
      label: "Capacity Utilization",
      value: `${capacityUsage.toFixed(1)}%`,
      unit: `${formatNumber(predictedDemand)} / ${formatNumber(capacity)}`,
      description: capacityStatus.label,
      icon: Users,
      color: capacityStatus.color,
      background: capacityStatus.background,
    },
  ];

  return (
    <section className={`hc-forecast-summary ${className}`}>
      <style>{`
        .hc-forecast-summary {
          width: 100%;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e8edf5;
          border-radius: 22px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 8px 30px rgba(20,38,75,.045);
          color: #172033;
          font-family: Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          box-sizing: border-box;
        }

        .hc-forecast-summary *,
        .hc-forecast-summary *::before,
        .hc-forecast-summary *::after {
          box-sizing: border-box;
        }

        .hc-forecast-summary-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 21px;
        }

        .hc-forecast-summary-heading {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          min-width: 0;
        }

        .hc-forecast-summary-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #eff6ff;
          color: #2563eb;
        }

        .hc-forecast-summary-title {
          margin: 0;
          color: #172033;
          font-size: 17px;
          font-weight: 750;
          line-height: 1.4;
          letter-spacing: -.35px;
        }

        .hc-forecast-summary-subtitle {
          margin: 5px 0 0;
          color: #7b8497;
          font-size: 12px;
          line-height: 1.6;
        }

        .hc-forecast-summary-period {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 8px 10px;
          border: 1px solid #e7ebf2;
          border-radius: 10px;
          background: #fff;
          color: #64748b;
          font-size: 10px;
          font-weight: 700;
        }

        .hc-forecast-summary-grid {
          display: grid;
          grid-template-columns: repeat(4,minmax(0,1fr));
          gap: 12px;
        }

        .hc-forecast-metric {
          min-width: 0;
          padding: 16px;
          border: 1px solid #edf0f5;
          border-radius: 16px;
          background: #fff;
          transition: transform .2s,border-color .2s,box-shadow .2s;
        }

        .hc-forecast-metric:hover {
          transform: translateY(-2px);
          border-color: #dbe5f3;
          box-shadow: 0 5px 16px rgba(20,38,75,.04);
        }

        .hc-forecast-metric-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 15px;
        }

        .hc-forecast-metric-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .hc-forecast-metric-trend {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #8992a4;
          font-size: 9px;
          font-weight: 700;
        }

        .hc-forecast-metric-label {
          margin: 0 0 8px;
          color: #7b8497;
          font-size: 11px;
          font-weight: 650;
          line-height: 1.5;
        }

        .hc-forecast-metric-value {
          color: #172033;
          font-size: clamp(21px,2vw,29px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -.8px;
          overflow-wrap: anywhere;
        }

        .hc-forecast-metric-unit {
          margin-top: 4px;
          color: #8992a4;
          font-size: 10px;
          font-weight: 550;
          line-height: 1.5;
        }

        .hc-forecast-metric-description {
          margin-top: 11px;
          padding-top: 10px;
          border-top: 1px solid #f0f2f6;
          color: #64748b;
          font-size: 10px;
          line-height: 1.5;
        }

        .hc-forecast-capacity {
          margin-top: 19px;
          padding: 17px;
          border: 1px solid #edf0f5;
          border-radius: 15px;
          background: #fafbfe;
        }

        .hc-forecast-capacity-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 13px;
        }

        .hc-forecast-capacity-title {
          margin: 0;
          color: #263247;
          font-size: 12px;
          font-weight: 800;
        }

        .hc-forecast-capacity-description {
          margin: 5px 0 0;
          color: #8992a4;
          font-size: 10px;
          line-height: 1.6;
        }

        .hc-forecast-capacity-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .hc-forecast-capacity-track {
          width: 100%;
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: #e9edf5;
        }

        .hc-forecast-capacity-fill {
          height: 100%;
          border-radius: inherit;
          transition: width .4s ease;
        }

        .hc-forecast-capacity-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 9px;
          color: #8992a4;
          font-size: 10px;
        }

        .hc-forecast-capacity-footer strong {
          color: #263247;
          font-weight: 800;
        }

        .hc-forecast-insight {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 15px;
          padding: 13px;
          border: 1px solid #dbeafe;
          border-radius: 13px;
          background: #f8fbff;
        }

        .hc-forecast-insight-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #dbeafe;
          color: #2563eb;
        }

        .hc-forecast-insight-title {
          margin: 0;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.5;
        }

        .hc-forecast-insight-text {
          margin: 4px 0 0;
          color: #53647e;
          font-size: 10px;
          line-height: 1.7;
        }

        .hc-forecast-summary-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #edf0f5;
        }

        .hc-forecast-summary-note {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          max-width: 440px;
          color: #8992a4;
          font-size: 10px;
          line-height: 1.7;
        }

        .hc-forecast-summary-note svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .hc-forecast-summary-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          transition: all .2s;
        }

        .hc-forecast-summary-button:hover {
          border-color: #93c5fd;
          background: #dbeafe;
        }

        .hc-forecast-summary-skeleton {
          height: 145px;
          border-radius: 15px;
          background: linear-gradient(90deg,#f1f5f9 25%,#e8eef6 50%,#f1f5f9 75%);
          background-size: 200% 100%;
          animation: hc-forecast-shimmer 1.4s infinite;
        }

        @keyframes hc-forecast-shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }

        @media(max-width:1000px) {
          .hc-forecast-summary-grid {
            grid-template-columns: repeat(2,minmax(0,1fr));
          }

          .hc-forecast-metric-value {
            font-size: 26px;
          }
        }

        @media(max-width:600px) {
          .hc-forecast-summary {
            padding: 15px;
            border-radius: 17px;
          }

          .hc-forecast-summary-title {
            font-size: 15px;
          }

          .hc-forecast-summary-subtitle {
            font-size: 11px;
          }

          .hc-forecast-summary-period {
            padding: 7px;
            font-size: 9px;
          }

          .hc-forecast-summary-grid {
            gap: 8px;
          }

          .hc-forecast-metric {
            padding: 12px;
          }

          .hc-forecast-metric-value {
            font-size: 23px;
          }

          .hc-forecast-capacity {
            padding: 13px;
          }
        }

        @media(max-width:380px) {
          .hc-forecast-summary-header {
            flex-direction: column;
          }

          .hc-forecast-summary-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(prefers-reduced-motion:reduce) {
          .hc-forecast-summary *,
          .hc-forecast-summary *::before,
          .hc-forecast-summary *::after {
            animation-duration:.01ms !important;
            transition-duration:.01ms !important;
          }
        }
      `}</style>

      {loading ? (
        <div className="hc-forecast-summary-skeleton" />
      ) : (
        <>
          <div className="hc-forecast-summary-header">
            <div className="hc-forecast-summary-heading">
              <div className="hc-forecast-summary-icon">
                <TrendingUp size={21} />
              </div>

              <div>
                <h2 className="hc-forecast-summary-title">{title}</h2>
                <p className="hc-forecast-summary-subtitle">{subtitle}</p>
              </div>
            </div>

            <div className="hc-forecast-summary-period">
              <CalendarDays size={13} />
              {forecast.horizon || "Forecast period"}
            </div>
          </div>

          <div className="hc-forecast-summary-grid">
            {metrics.map((metric, index) => {
              const MetricIcon = metric.icon;

              return (
                <article className="hc-forecast-metric" key={metric.label}>
                  <div className="hc-forecast-metric-top">
                    <div
                      className="hc-forecast-metric-icon"
                      style={{
                        color: metric.color,
                        background: metric.background,
                      }}
                    >
                      <MetricIcon size={18} />
                    </div>

                    {index === 2 && (
                      <span className="hc-forecast-metric-trend">
                        {demandChange > 0 ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        Comparison
                      </span>
                    )}
                  </div>

                  <p className="hc-forecast-metric-label">
                    {metric.label}
                  </p>

                  <div className="hc-forecast-metric-value">
                    {metric.value}
                  </div>

                  <div className="hc-forecast-metric-unit">
                    {metric.unit}
                  </div>

                  <div className="hc-forecast-metric-description">
                    {metric.description}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hc-forecast-capacity">
            <div className="hc-forecast-capacity-header">
              <div>
                <h3 className="hc-forecast-capacity-title">
                  Forecast vs. Available Capacity
                </h3>

                <p className="hc-forecast-capacity-description">
                  Compare projected demand against the configured capacity.
                </p>
              </div>

              <span
                className="hc-forecast-capacity-badge"
                style={{
                  color: capacityStatus.color,
                  background: capacityStatus.background,
                }}
              >
                <Target size={12} />
                {capacityStatus.label}
              </span>
            </div>

            <div
              className="hc-forecast-capacity-track"
              role="progressbar"
              aria-label="Forecast capacity utilization"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(100, Math.max(0, capacityUsage))}
            >
              <div
                className="hc-forecast-capacity-fill"
                style={{
                  width: `${Math.min(100, Math.max(0, capacityUsage))}%`,
                  background: capacityStatus.color,
                }}
              />
            </div>

            <div className="hc-forecast-capacity-footer">
              <span>
                Predicted: <strong>{formatNumber(predictedDemand)}</strong>
              </span>

              <span>
                Capacity: <strong>{formatNumber(capacity)}</strong>
              </span>
            </div>
          </div>

          <div className="hc-forecast-insight">
            <div className="hc-forecast-insight-icon">
              {capacityUsage >= 85 ? (
                <ShieldAlert size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}
            </div>

            <div>
              <h3 className="hc-forecast-insight-title">
                {capacityUsage >= 100
                  ? "Projected demand exceeds configured capacity"
                  : capacityUsage >= 85
                  ? "Review hospital readiness"
                  : "Projected demand is within configured capacity"}
              </h3>

              <p className="hc-forecast-insight-text">
                {capacityUsage >= 100
                  ? "Review escalation procedures, staffing availability, and bed planning. This demo calculation is not an operational prediction."
                  : capacityUsage >= 85
                  ? "Consider reviewing emergency staffing, bed availability, and essential supplies. Verify all inputs before making operational decisions."
                  : "Continue monitoring demand and available resources. Forecast values should be validated against real hospital data before operational use."}
              </p>
            </div>
          </div>

          <div className="hc-forecast-summary-footer">
            <div className="hc-forecast-summary-note">
              <Info size={13} />
              <span>
                Illustrative demo metrics. Forecast values and comparisons
                are not validated predictions. Confidence must come from
                measured model evaluation, not a fixed demo percentage.
                Last updated: {forecast.updatedAt || "Not available"}.
              </span>
            </div>

            <button
              type="button"
              className="hc-forecast-summary-button"
              onClick={() => {
                if (onViewForecast) onViewForecast(forecast);
              }}
            >
              View full forecast
              <ArrowRight size={13} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}