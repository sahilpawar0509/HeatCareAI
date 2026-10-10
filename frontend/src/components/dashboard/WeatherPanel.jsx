import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  ExternalLink,
  Eye,
  Gauge,
  MapPin,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

const DEMO_WEATHER = {
  location: "Pune, Maharashtra",
  temperature: 38,
  feelsLike: 40,
  humidity: 42,
  windSpeed: 18,
  uvIndex: 9,
  visibility: 8,
  condition: "Hot and Sunny",
  apparentRisk: "High",
  source: "Illustrative demo data",
  updatedAt: "Demo snapshot",
  forecast: [
    {
      day: "Today",
      date: "Day 1",
      high: 38,
      low: 25,
      humidity: 42,
      condition: "sunny",
      label: "Hot",
    },
    {
      day: "Tomorrow",
      date: "Day 2",
      high: 39,
      low: 26,
      humidity: 40,
      condition: "sunny",
      label: "Very hot",
    },
    {
      day: "Day 3",
      date: "Day 3",
      high: 37,
      low: 25,
      humidity: 48,
      condition: "cloudy",
      label: "Hot",
    },
    {
      day: "Day 4",
      date: "Day 4",
      high: 35,
      low: 24,
      humidity: 55,
      condition: "rain",
      label: "Warm",
    },
    {
      day: "Day 5",
      date: "Day 5",
      high: 36,
      low: 24,
      humidity: 50,
      condition: "cloudy",
      label: "Warm",
    },
  ],
};

function getHeatLevel(temperature) {
  if (temperature >= 40) {
    return {
      label: "Extreme",
      color: "#dc2626",
      background: "#fef2f2",
    };
  }

  if (temperature >= 35) {
    return {
      label: "High",
      color: "#ea580c",
      background: "#fff7ed",
    };
  }

  if (temperature >= 30) {
    return {
      label: "Moderate",
      color: "#ca8a04",
      background: "#fefce8",
    };
  }

  return {
    label: "Lower",
    color: "#059669",
    background: "#ecfdf5",
  };
}

function WeatherConditionIcon({ condition, size = 24 }) {
  const normalized = String(condition || "").toLowerCase();

  if (normalized.includes("rain")) {
    return <CloudRain size={size} />;
  }

  if (
    normalized.includes("cloud") ||
    normalized.includes("overcast")
  ) {
    return <Cloud size={size} />;
  }

  if (
    normalized.includes("sun") ||
    normalized.includes("clear") ||
    normalized.includes("hot")
  ) {
    return <Sun size={size} />;
  }

  return <CloudSun size={size} />;
}

function ForecastWeatherIcon({ condition }) {
  const normalized = String(condition || "").toLowerCase();

  if (normalized.includes("rain")) {
    return <CloudRain size={21} />;
  }

  if (normalized.includes("cloud")) {
    return <CloudSun size={21} />;
  }

  return <Sun size={21} />;
}

export default function WeatherPanel({
  data = DEMO_WEATHER,
  title = "Heat & Weather Monitor",
  subtitle = "Environmental conditions and heat exposure overview.",
  loading = false,
  onRefresh,
  onViewDetails,
  className = "",
}) {
  const [weather, setWeather] = useState(data || DEMO_WEATHER);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    data?.updatedAt || DEMO_WEATHER.updatedAt
  );

  useEffect(() => {
    setWeather(data || DEMO_WEATHER);
    setLastUpdated(data?.updatedAt || DEMO_WEATHER.updatedAt);
  }, [data]);

  const temperature = Number(weather?.temperature ?? 0);
  const feelsLike = Number(weather?.feelsLike ?? temperature);
  const humidity = Number(weather?.humidity ?? 0);
  const windSpeed = Number(weather?.windSpeed ?? 0);
  const uvIndex = Number(weather?.uvIndex ?? 0);
  const visibility = Number(weather?.visibility ?? 0);

  const heatLevel = getHeatLevel(temperature);

  const forecast = Array.isArray(weather?.forecast)
    ? weather.forecast
    : [];

  const refreshWeather = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const result = await onRefresh();

      if (result && typeof result === "object") {
        setWeather(result);
        setLastUpdated(
          result.updatedAt || new Date().toLocaleTimeString()
        );
      }
    } catch (error) {
      console.error("Unable to refresh weather data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className={`hc-weather-panel ${className}`}>
      <style>{`
        .hc-weather-panel {
          width: 100%;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e8edf5;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 8px 30px rgba(20, 38, 75, 0.045);
          color: #172033;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          box-sizing: border-box;
        }

        .hc-weather-panel *,
        .hc-weather-panel *::before,
        .hc-weather-panel *::after {
          box-sizing: border-box;
        }

        .hc-weather-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 19px;
        }

        .hc-weather-heading {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          min-width: 0;
        }

        .hc-weather-heading-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #fff7ed;
          color: #ea580c;
        }

        .hc-weather-title {
          margin: 0;
          color: #172033;
          font-size: 17px;
          font-weight: 750;
          line-height: 1.4;
          letter-spacing: -0.35px;
        }

        .hc-weather-subtitle {
          margin: 5px 0 0;
          color: #7b8497;
          font-size: 12px;
          line-height: 1.6;
        }

        .hc-weather-refresh {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #e7ebf2;
          border-radius: 10px;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hc-weather-refresh:hover {
          border-color: #fed7aa;
          background: #fff7ed;
          color: #ea580c;
        }

        .hc-weather-refresh:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .hc-weather-location {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 15px;
          color: #64748b;
          font-size: 11px;
          font-weight: 650;
        }

        .hc-weather-location svg {
          color: #2563eb;
        }

        .hc-weather-current {
          position: relative;
          overflow: hidden;
          padding: 19px;
          border: 1px solid #e0eaff;
          border-radius: 18px;
          background: linear-gradient(135deg, #f8fbff 0%, #eff6ff 100%);
        }

        .hc-weather-current::after {
          position: absolute;
          top: -42px;
          right: -35px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(191, 219, 254, 0.22);
          content: "";
          pointer-events: none;
        }

        .hc-weather-current-top {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .hc-weather-current-label {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          font-weight: 650;
        }

        .hc-weather-temperature-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .hc-weather-sun-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 47px;
          height: 47px;
          flex-shrink: 0;
          border-radius: 15px;
          background: #fff;
          color: #f59e0b;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }

        .hc-weather-temperature {
          color: #172033;
          font-size: 43px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -2px;
        }

        .hc-weather-temperature-unit {
          margin-left: 2px;
          color: #64748b;
          font-size: 20px;
          font-weight: 600;
          vertical-align: top;
        }

        .hc-weather-condition {
          margin-top: 6px;
          color: #52627a;
          font-size: 11px;
          font-weight: 650;
        }

        .hc-weather-risk {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 7px;
        }

        .hc-weather-risk-label {
          color: #64748b;
          font-size: 10px;
          font-weight: 650;
        }

        .hc-weather-risk-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 9px;
          border-radius: 9px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .hc-weather-feels {
          position: relative;
          z-index: 1;
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid #dce8fa;
          color: #64748b;
          font-size: 11px;
        }

        .hc-weather-feels strong {
          color: #263247;
          font-size: 12px;
        }

        .hc-weather-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
        }

        .hc-weather-metric {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
          padding: 13px;
          border: 1px solid #edf0f5;
          border-radius: 14px;
          background: #fff;
        }

        .hc-weather-metric-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .hc-weather-metric-info {
          min-width: 0;
        }

        .hc-weather-metric-label {
          margin: 0 0 5px;
          color: #8992a4;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.4;
        }

        .hc-weather-metric-value {
          margin: 0;
          color: #263247;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .hc-weather-metric-unit {
          margin-left: 2px;
          color: #8992a4;
          font-size: 10px;
          font-weight: 600;
        }

        .hc-weather-forecast-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin: 22px 0 13px;
        }

        .hc-weather-section-title {
          margin: 0;
          color: #263247;
          font-size: 13px;
          font-weight: 750;
        }

        .hc-weather-section-caption {
          color: #8992a4;
          font-size: 10px;
        }

        .hc-weather-forecast {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 7px;
        }

        .hc-weather-day {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
          padding: 12px 4px;
          border: 1px solid #edf0f5;
          border-radius: 13px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .hc-weather-day:hover {
          border-color: #dbeafe;
          background: #f8fbff;
          transform: translateY(-2px);
        }

        .hc-weather-day-name {
          margin-bottom: 10px;
          color: #64748b;
          font-size: 10px;
          font-weight: 650;
          text-align: center;
        }

        .hc-weather-day-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 27px;
          margin-bottom: 9px;
          color: #f59e0b;
        }

        .hc-weather-day-temperature {
          color: #263247;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.4;
        }

        .hc-weather-day-low {
          margin-top: 3px;
          color: #8992a4;
          font-size: 10px;
        }

        .hc-weather-day-humidity {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 9px;
          color: #0284c7;
          font-size: 9px;
          font-weight: 650;
        }

        .hc-weather-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 17px;
          padding: 13px;
          border: 1px solid #fed7aa;
          border-radius: 13px;
          background: #fffaf5;
        }

        .hc-weather-alert-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #ffedd5;
          color: #ea580c;
        }

        .hc-weather-alert-title {
          margin: 0;
          color: #9a3412;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.5;
        }

        .hc-weather-alert-text {
          margin: 4px 0 0;
          color: #9a654d;
          font-size: 10px;
          line-height: 1.7;
        }

        .hc-weather-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 15px;
          padding-top: 13px;
          border-top: 1px solid #edf0f5;
        }

        .hc-weather-source {
          color: #8992a4;
          font-size: 9px;
          line-height: 1.6;
        }

        .hc-weather-details-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 0 7px 8px;
          border: 0;
          background: transparent;
          color: #2563eb;
          font-size: 10px;
          font-weight: 750;
          cursor: pointer;
          white-space: nowrap;
        }

        .hc-weather-details-button:hover {
          color: #1d4ed8;
        }

        .hc-weather-skeleton {
          height: 100px;
          margin-bottom: 12px;
          border-radius: 15px;
          background: linear-gradient(
            90deg,
            #f1f5f9 25%,
            #e8eef6 50%,
            #f1f5f9 75%
          );
          background-size: 200% 100%;
          animation: hc-weather-shimmer 1.4s infinite;
        }

        @keyframes hc-weather-shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }

        @media (max-width: 600px) {
          .hc-weather-panel {
            padding: 15px;
            border-radius: 17px;
          }

          .hc-weather-title {
            font-size: 15px;
          }

          .hc-weather-subtitle {
            font-size: 11px;
          }

          .hc-weather-current {
            padding: 15px;
          }

          .hc-weather-temperature {
            font-size: 37px;
          }

          .hc-weather-sun-icon {
            width: 40px;
            height: 40px;
          }

          .hc-weather-metric {
            padding: 10px;
            gap: 8px;
          }

          .hc-weather-metric-icon {
            width: 31px;
            height: 31px;
          }

          .hc-weather-metric-value {
            font-size: 15px;
          }

          .hc-weather-forecast {
            gap: 5px;
          }

          .hc-weather-day {
            padding: 10px 2px;
          }

          .hc-weather-day-name {
            font-size: 9px;
          }
        }

        @media (max-width: 380px) {
          .hc-weather-current-top {
            flex-direction: column;
          }

          .hc-weather-risk {
            align-items: flex-start;
          }

          .hc-weather-forecast {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-weather-panel *,
          .hc-weather-panel *::before,
          .hc-weather-panel *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {loading ? (
        <div aria-label="Loading weather information">
          <div className="hc-weather-skeleton" />
          <div className="hc-weather-skeleton" />
          <div className="hc-weather-skeleton" />
        </div>
      ) : (
        <>
          <div className="hc-weather-header">
            <div className="hc-weather-heading">
              <div className="hc-weather-heading-icon">
                <Thermometer size={21} />
              </div>

              <div>
                <h2 className="hc-weather-title">{title}</h2>
                <p className="hc-weather-subtitle">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              className="hc-weather-refresh"
              onClick={refreshWeather}
              disabled={!onRefresh || isRefreshing}
              title={
                onRefresh
                  ? "Refresh weather data"
                  : "Connect a weather data source to enable refresh"
              }
              aria-label="Refresh weather data"
            >
              <RefreshCw
                size={16}
                style={{
                  animation: isRefreshing
                    ? "hc-weather-shimmer 1s linear infinite"
                    : "none",
                }}
              />
            </button>
          </div>

          <div className="hc-weather-location">
            <MapPin size={14} />
            <span>{weather?.location || "Location unavailable"}</span>
          </div>

          <div className="hc-weather-current">
            <div className="hc-weather-current-top">
              <div>
                <p className="hc-weather-current-label">
                  Current Temperature
                </p>

                <div className="hc-weather-temperature-row">
                  <div className="hc-weather-sun-icon">
                    <WeatherConditionIcon
                      condition={weather?.condition}
                      size={27}
                    />
                  </div>

                  <div>
                    <div className="hc-weather-temperature">
                      {temperature}
                      <span className="hc-weather-temperature-unit">
                        °C
                      </span>
                    </div>

                    <div className="hc-weather-condition">
                      {weather?.condition || "Conditions unavailable"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hc-weather-risk">
                <span className="hc-weather-risk-label">
                  Temperature category
                </span>

                <span
                  className="hc-weather-risk-badge"
                  style={{
                    color: heatLevel.color,
                    background: heatLevel.background,
                  }}
                >
                  <AlertTriangle size={12} />
                  {heatLevel.label}
                </span>
              </div>
            </div>

            <div className="hc-weather-feels">
              Feels like{" "}
              <strong>{feelsLike}°C</strong>
              <span> · Apparent temperature may differ from measured temperature.</span>
            </div>
          </div>

          <div className="hc-weather-metrics">
            <div className="hc-weather-metric">
              <div
                className="hc-weather-metric-icon"
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                }}
              >
                <Droplets size={18} />
              </div>

              <div className="hc-weather-metric-info">
                <p className="hc-weather-metric-label">Humidity</p>
                <p className="hc-weather-metric-value">
                  {humidity}
                  <span className="hc-weather-metric-unit">%</span>
                </p>
              </div>
            </div>

            <div className="hc-weather-metric">
              <div
                className="hc-weather-metric-icon"
                style={{
                  background: "#f0fdf4",
                  color: "#16a34a",
                }}
              >
                <Wind size={18} />
              </div>

              <div className="hc-weather-metric-info">
                <p className="hc-weather-metric-label">Wind Speed</p>
                <p className="hc-weather-metric-value">
                  {windSpeed}
                  <span className="hc-weather-metric-unit">km/h</span>
                </p>
              </div>
            </div>

            <div className="hc-weather-metric">
              <div
                className="hc-weather-metric-icon"
                style={{
                  background: "#fff7ed",
                  color: "#ea580c",
                }}
              >
                <Sun size={18} />
              </div>

              <div className="hc-weather-metric-info">
                <p className="hc-weather-metric-label">UV Index</p>
                <p className="hc-weather-metric-value">{uvIndex}</p>
              </div>
            </div>

            <div className="hc-weather-metric">
              <div
                className="hc-weather-metric-icon"
                style={{
                  background: "#f5f3ff",
                  color: "#7c3aed",
                }}
              >
                <Eye size={18} />
              </div>

              <div className="hc-weather-metric-info">
                <p className="hc-weather-metric-label">Visibility</p>
                <p className="hc-weather-metric-value">
                  {visibility}
                  <span className="hc-weather-metric-unit">km</span>
                </p>
              </div>
            </div>
          </div>

          <div className="hc-weather-forecast-heading">
            <h3 className="hc-weather-section-title">
              5-Day Outlook
            </h3>

            <span className="hc-weather-section-caption">
              Daily high / low
            </span>
          </div>

          {forecast.length > 0 ? (
            <div className="hc-weather-forecast">
              {forecast.slice(0, 5).map((day, index) => (
                <div
                  className="hc-weather-day"
                  key={`${day.date || day.day || "day"}-${index}`}
                >
                  <span className="hc-weather-day-name">
                    {day.day || day.date || `Day ${index + 1}`}
                  </span>

                  <div className="hc-weather-day-icon">
                    <ForecastWeatherIcon
                      condition={day.condition || "sunny"}
                    />
                  </div>

                  <span className="hc-weather-day-temperature">
                    {day.high ?? "--"}°
                  </span>

                  <span className="hc-weather-day-low">
                    {day.low ?? "--"}°
                  </span>

                  <span className="hc-weather-day-humidity">
                    <Droplets size={10} />
                    {day.humidity ?? "--"}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="hc-weather-skeleton" />
          )}

          <div className="hc-weather-alert">
            <div className="hc-weather-alert-icon">
              <AlertTriangle size={17} />
            </div>

            <div>
              <h3 className="hc-weather-alert-title">
                Heat Preparedness Notice
              </h3>

              <p className="hc-weather-alert-text">
                {temperature >= 40
                  ? "The displayed temperature is in the extreme category. Review local heat advisories and hospital preparedness procedures."
                  : temperature >= 35
                  ? "The displayed temperature is in the high category. Review heat-related emergency readiness and monitor official weather advisories."
                  : temperature >= 30
                  ? "Monitor changing temperatures and review routine heat preparedness procedures."
                  : "Continue monitoring official weather information and follow established hospital preparedness procedures."}
              </p>
            </div>
          </div>

          <div className="hc-weather-footer">
            <span className="hc-weather-source">
              Source: {weather?.source || "Source not specified"}
              <br />
              Updated: {lastUpdated}
              <br />
              Demo values are not live weather observations.
            </span>

            <button
              type="button"
              className="hc-weather-details-button"
              onClick={() => {
                if (onViewDetails) onViewDetails(weather);
              }}
            >
              View details
              <ExternalLink size={12} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}