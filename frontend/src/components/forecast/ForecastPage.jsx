import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Info,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";

import ForecastSummary from "../components/forecast/ForecastSummary";
import ForecastChart from "../components/dashboard/ForecastChart";

const DEMO_DATA = [
  { day: "Day 1", actual: 105, forecast: 112, upper: 128, lower: 96 },
  { day: "Day 2", actual: 110, forecast: 118, upper: 135, lower: 101 },
  { day: "Day 3", actual: 108, forecast: 124, upper: 142, lower: 106 },
  { day: "Day 4", actual: 119, forecast: 131, upper: 149, lower: 113 },
  { day: "Day 5", actual: 124, forecast: 140, upper: 159, lower: 121 },
  { day: "Day 6", actual: null, forecast: 148, upper: 169, lower: 127 },
  { day: "Day 7", actual: null, forecast: 158, upper: 180, lower: 136 },
];

const DEMO_SUMMARY = {
  currentDemand: 124,
  predictedDemand: 158,
  previousDemand: 112,
  capacity: 180,
  confidence: null,
  horizon: "Next 24 hours",
  updatedAt: "Demo snapshot",
};

export default function ForecastPage() {
  const [period, setPeriod] = useState("7");
  const [refreshing, setRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [temperatureThreshold, setTemperatureThreshold] = useState(35);
  const [capacityThreshold, setCapacityThreshold] = useState(85);

  const predictedDemand = DEMO_SUMMARY.predictedDemand;
  const capacity = DEMO_SUMMARY.capacity;
  const utilization = capacity > 0 ? (predictedDemand / capacity) * 100 : 0;

  const refreshForecast = async () => {
    setRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setRefreshing(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Day",
      "Observed Demand",
      "Illustrative Forecast",
      "Upper Range",
      "Lower Range",
    ];

    const rows = DEMO_DATA.map((item) => [
      item.day,
      item.actual ?? "",
      item.forecast,
      item.upper,
      item.lower,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "heatcare-demo-forecast.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const visibleData = DEMO_DATA.slice(
    0,
    Number(period) === 7 ? 7 : 5
  );

  return (
    <div className="hc-forecast-page">
      <style>{`
        .hc-forecast-page {
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: 100%;
          min-width: 0;
          color: #172033;
          font-family: Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }

        .hc-forecast-page *,
        .hc-forecast-page *::before,
        .hc-forecast-page *::after {
          box-sizing: border-box;
        }

        .hc-forecast-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .hc-forecast-page-heading {
          min-width: 0;
        }

        .hc-forecast-breadcrumb {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 10px;
          color: #8992a4;
          font-size: 11px;
          font-weight: 600;
        }

        .hc-forecast-breadcrumb span:last-child {
          color: #2563eb;
        }

        .hc-forecast-page-title {
          margin: 0;
          color: #172033;
          font-size: clamp(23px,3vw,31px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -1px;
        }

        .hc-forecast-page-description {
          max-width: 650px;
          margin: 9px 0 0;
          color: #7b8497;
          font-size: 13px;
          line-height: 1.8;
        }

        .hc-forecast-page-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .hc-forecast-page-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 39px;
          padding: 0 13px;
          border: 1px solid #e3e8f0;
          border-radius: 11px;
          background: #fff;
          color: #526079;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
          transition: all .2s ease;
        }

        .hc-forecast-page-button:hover {
          border-color: #bfdbfe;
          background: #f8fbff;
          color: #2563eb;
        }

        .hc-forecast-page-button.primary {
          border-color: #2563eb;
          background: #2563eb;
          color: #fff;
          box-shadow: 0 4px 12px rgba(37,99,235,.16);
        }

        .hc-forecast-page-button.primary:hover {
          background: #1d4ed8;
        }

        .hc-forecast-page-button:disabled {
          opacity: .6;
          cursor: wait;
        }

        .hc-forecast-demo-banner {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 14px 16px;
          border: 1px solid #fed7aa;
          border-radius: 14px;
          background: #fffaf5;
        }

        .hc-forecast-demo-banner-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #ffedd5;
          color: #ea580c;
        }

        .hc-forecast-demo-banner-title {
          margin: 0;
          color: #9a3412;
          font-size: 12px;
          font-weight: 800;
        }

        .hc-forecast-demo-banner-text {
          margin: 4px 0 0;
          color: #9a654d;
          font-size: 11px;
          line-height: 1.7;
        }

        .hc-forecast-section {
          min-width: 0;
        }

        .hc-forecast-chart-card {
          padding: 21px;
          border: 1px solid #e8edf5;
          border-radius: 21px;
          background: #fff;
          box-shadow: 0 8px 30px rgba(20,38,75,.04);
        }

        .hc-forecast-chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .hc-forecast-chart-title {
          margin: 0;
          color: #172033;
          font-size: 16px;
          font-weight: 800;
        }

        .hc-forecast-chart-description {
          margin: 6px 0 0;
          color: #8992a4;
          font-size: 11px;
          line-height: 1.7;
        }

        .hc-forecast-period-switch {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          border: 1px solid #edf0f5;
          border-radius: 11px;
          background: #f8fafc;
        }

        .hc-forecast-period-option {
          padding: 7px 11px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #7b8497;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
        }

        .hc-forecast-period-option.active {
          background: #fff;
          color: #2563eb;
          box-shadow: 0 1px 5px rgba(20,38,75,.08);
        }

        .hc-forecast-settings {
          padding: 18px;
          border: 1px solid #e3eaf5;
          border-radius: 16px;
          background: #f8fbff;
        }

        .hc-forecast-settings-header {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 16px;
        }

        .hc-forecast-settings-header h3 {
          margin: 0;
          color: #263247;
          font-size: 13px;
          font-weight: 800;
        }

        .hc-forecast-settings-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 20px;
        }

        .hc-forecast-setting-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
          color: #526079;
          font-size: 11px;
          font-weight: 650;
        }

        .hc-forecast-setting-value {
          color: #2563eb;
          font-weight: 800;
        }

        .hc-forecast-setting-range {
          width: 100%;
          accent-color: #2563eb;
          cursor: pointer;
        }

        .hc-forecast-setting-help {
          margin: 7px 0 0;
          color: #8992a4;
          font-size: 10px;
          line-height: 1.6;
        }

        .hc-forecast-bottom-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 18px;
        }

        .hc-forecast-info-card {
          min-width: 0;
          padding: 20px;
          border: 1px solid #e8edf5;
          border-radius: 19px;
          background: #fff;
          box-shadow: 0 8px 30px rgba(20,38,75,.035);
        }

        .hc-forecast-info-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .hc-forecast-info-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
          background: #eff6ff;
          color: #2563eb;
        }

        .hc-forecast-info-title {
          margin: 0;
          color: #263247;
          font-size: 14px;
          font-weight: 800;
        }

        .hc-forecast-info-subtitle {
          margin: 4px 0 0;
          color: #8992a4;
          font-size: 10px;
          line-height: 1.5;
        }

        .hc-forecast-capacity-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          color: #64748b;
          font-size: 11px;
        }

        .hc-forecast-capacity-row strong {
          color: #263247;
          font-weight: 800;
        }

        .hc-forecast-capacity-track {
          width: 100%;
          height: 8px;
          margin-bottom: 16px;
          overflow: hidden;
          border-radius: 999px;
          background: #edf1f7;
        }

        .hc-forecast-capacity-fill {
          height: 100%;
          border-radius: inherit;
          background: #2563eb;
        }

        .hc-forecast-capacity-fill.warning {
          background: #ea580c;
        }

        .hc-forecast-capacity-fill.critical {
          background: #dc2626;
        }

        .hc-forecast-recommendation {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border: 1px solid #edf0f5;
          border-radius: 12px;
          background: #fafbfe;
        }

        .hc-forecast-recommendation + .hc-forecast-recommendation {
          margin-top: 9px;
        }

        .hc-forecast-recommendation-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #eff6ff;
          color: #2563eb;
        }

        .hc-forecast-recommendation h4 {
          margin: 0;
          color: #334155;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.5;
        }

        .hc-forecast-recommendation p {
          margin: 4px 0 0;
          color: #7b8497;
          font-size: 10px;
          line-height: 1.7;
        }

        .hc-forecast-last-updated {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8992a4;
          font-size: 10px;
        }

        @media(max-width:850px) {
          .hc-forecast-bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media(max-width:600px) {
          .hc-forecast-chart-card,
          .hc-forecast-info-card {
            padding: 15px;
            border-radius: 17px;
          }

          .hc-forecast-settings-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .hc-forecast-page-description {
            font-size: 12px;
          }

          .hc-forecast-page-actions {
            width: 100%;
          }

          .hc-forecast-page-button {
            flex: 1;
          }
        }
      `}</style>

      <header className="hc-forecast-page-header">
        <div className="hc-forecast-page-heading">
          <div className="hc-forecast-breadcrumb">
            <span>HeatCare AI</span>
            <span>/</span>
            <span>Demand Forecast</span>
          </div>

          <h1 className="hc-forecast-page-title">
            Hospital Demand Forecast
          </h1>

          <p className="hc-forecast-page-description">
            Explore projected emergency demand, compare it with available
            capacity, and review preparedness actions for periods of extreme
            heat.
          </p>
        </div>

        <div className="hc-forecast-page-actions">
          <button
            type="button"
            className="hc-forecast-page-button"
            onClick={() => setShowSettings((previous) => !previous)}
          >
            <SlidersHorizontal size={15} />
            Forecast settings
          </button>

          <button
            type="button"
            className="hc-forecast-page-button"
            onClick={exportCSV}
          >
            <Download size={15} />
            Export CSV
          </button>

          <button
            type="button"
            className="hc-forecast-page-button primary"
            onClick={refreshForecast}
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              style={{
                animation: refreshing ? "spin 1s linear infinite" : "none",
              }}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="hc-forecast-demo-banner">
        <div className="hc-forecast-demo-banner-icon">
          <AlertTriangle size={17} />
        </div>

        <div>
          <h3 className="hc-forecast-demo-banner-title">
            Demonstration mode — not connected to a validated prediction model
          </h3>

          <p className="hc-forecast-demo-banner-text">
            The values displayed on this page are illustrative demo data.
            Refreshing does not run an AI model or retrieve live hospital
            records. Connect verified weather and hospital data before
            using forecasts for operational planning.
          </p>
        </div>
      </div>

      {showSettings && (
        <section className="hc-forecast-settings">
          <div className="hc-forecast-settings-header">
            <SlidersHorizontal size={17} color="#2563eb" />
            <h3>Forecast Display Settings</h3>
          </div>

          <div className="hc-forecast-settings-grid">
            <div>
              <div className="hc-forecast-setting-label">
                <label htmlFor="heat-threshold">
                  Heat monitoring threshold
                </label>

                <span className="hc-forecast-setting-value">
                  {temperatureThreshold}°C
                </span>
              </div>

              <input
                id="heat-threshold"
                className="hc-forecast-setting-range"
                type="range"
                min="25"
                max="45"
                value={temperatureThreshold}
                onChange={(event) =>
                  setTemperatureThreshold(Number(event.target.value))
                }
              />

              <p className="hc-forecast-setting-help">
                Display setting only. It does not change the forecast model.
              </p>
            </div>

            <div>
              <div className="hc-forecast-setting-label">
                <label htmlFor="capacity-threshold">
                  Capacity warning threshold
                </label>

                <span className="hc-forecast-setting-value">
                  {capacityThreshold}%
                </span>
              </div>

              <input
                id="capacity-threshold"
                className="hc-forecast-setting-range"
                type="range"
                min="50"
                max="100"
                value={capacityThreshold}
                onChange={(event) =>
                  setCapacityThreshold(Number(event.target.value))
                }
              />

              <p className="hc-forecast-setting-help">
                Used to display the illustrative capacity warning below.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="hc-forecast-section">
        <ForecastSummary data={DEMO_SUMMARY} />
      </section>

      <section className="hc-forecast-chart-card">
        <div className="hc-forecast-chart-header">
          <div>
            <h2 className="hc-forecast-chart-title">
              Demand Trend & Projection
            </h2>

            <p className="hc-forecast-chart-description">
              Illustrative demand history and projected emergency visits.
            </p>
          </div>

          <div className="hc-forecast-period-switch">
            {[
              { value: "5", label: "5 points" },
              { value: "7", label: "7 points" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={`hc-forecast-period-option ${
                  period === item.value ? "active" : ""
                }`}
                onClick={() => setPeriod(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <ForecastChart data={visibleData} />
      </section>

      <div className="hc-forecast-bottom-grid">
        <section className="hc-forecast-info-card">
          <div className="hc-forecast-info-heading">
            <div className="hc-forecast-info-icon">
              <Users size={18} />
            </div>

            <div>
              <h2 className="hc-forecast-info-title">
                Capacity Readiness
              </h2>

              <p className="hc-forecast-info-subtitle">
                Compare illustrative demand against configured capacity.
              </p>
            </div>
          </div>

          {[
            {
              label: "Emergency department capacity",
              value: predictedDemand,
              max: capacity,
            },
            {
              label: "Configured capacity warning",
              value: utilization,
              max: 100,
              percent: true,
            },
          ].map((item) => {
            const percentage =
              item.max > 0 ? (item.value / item.max) * 100 : 0;

            const warning = percentage >= capacityThreshold;
            const critical = percentage >= 100;

            return (
              <React.Fragment key={item.label}>
                <div className="hc-forecast-capacity-row">
                  <span>{item.label}</span>

                  <strong>
                    {item.percent
                      ? `${Number(item.value).toFixed(1)}%`
                      : `${item.value} / ${item.max}`}
                  </strong>
                </div>

                <div className="hc-forecast-capacity-track">
                  <div
                    className={`hc-forecast-capacity-fill ${
                      critical
                        ? "critical"
                        : warning
                        ? "warning"
                        : ""
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, percentage))}%`,
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}

          <div className="hc-forecast-last-updated">
            <Clock size={12} />
            Illustrative snapshot: {DEMO_SUMMARY.updatedAt}
          </div>
        </section>

        <section className="hc-forecast-info-card">
          <div className="hc-forecast-info-heading">
            <div className="hc-forecast-info-icon">
              <ShieldAlert size={18} />
            </div>

            <div>
              <h2 className="hc-forecast-info-title">
                Preparedness Recommendations
              </h2>

              <p className="hc-forecast-info-subtitle">
                General planning prompts, not automated clinical instructions.
              </p>
            </div>
          </div>

          <div className="hc-forecast-recommendation">
            <div className="hc-forecast-recommendation-icon">
              <Users size={15} />
            </div>

            <div>
              <h4>Review staff availability</h4>

              <p>
                Compare scheduled staff with expected workload and review
                contingency arrangements.
              </p>
            </div>
          </div>

          <div className="hc-forecast-recommendation">
            <div className="hc-forecast-recommendation-icon">
              <Activity size={15} />
            </div>

            <div>
              <h4>Review bed and emergency capacity</h4>

              <p>
                Check the configured capacity values and confirm current
                availability with hospital teams.
              </p>
            </div>
          </div>

          <div className="hc-forecast-recommendation">
            <div className="hc-forecast-recommendation-icon">
              <CalendarDays size={15} />
            </div>

            <div>
              <h4>Monitor heat conditions</h4>

              <p>
                Review official weather advisories and follow the hospital's
                established heat preparedness plan.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="hc-forecast-last-updated">
        <Info size={13} />
        Demo application · No live patient data · No validated prediction
        accuracy
      </div>
    </div>
  );
}