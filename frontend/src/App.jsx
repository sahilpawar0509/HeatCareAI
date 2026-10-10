import HeatwaveMap from "./components/heatwave/HeatwaveMap";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Bell,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CloudSun,
  Download,
  Droplets,
  FileBarChart,
  Flame,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Stethoscope,
  Thermometer,
  TrendingUp,
  Users,
  Wind,
  X,
  Zap,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

import "./App.css";

const forecastData = [
  { time: "06 AM", actual: 18, predicted: 22 },
  { time: "08 AM", actual: 26, predicted: 29 },
  { time: "10 AM", actual: 42, predicted: 46 },
  { time: "12 PM", actual: 57, predicted: 63 },
  { time: "02 PM", actual: 76, predicted: 82 },
  { time: "04 PM", actual: 69, predicted: 74 },
  { time: "06 PM", actual: 53, predicted: 58 },
  { time: "08 PM", actual: 37, predicted: 42 },
  { time: "10 PM", actual: 25, predicted: 29 },
];

const hourlyWeather = [
  { time: "12 PM", temp: 38, icon: "☀️" },
  { time: "01 PM", temp: 40, icon: "☀️" },
  { time: "02 PM", temp: 42, icon: "🌤️" },
  { time: "03 PM", temp: 41, icon: "🌤️" },
  { time: "04 PM", temp: 39, icon: "☀️" },
  { time: "05 PM", temp: 37, icon: "🌤️" },
];

const initialAlerts = [
  {
    id: 1,
    title: "Emergency demand may exceed normal capacity",
    description: "Forecast indicates elevated emergency visits during peak afternoon hours.",
    time: "10 min ago",
    level: "Critical",
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: 2,
    title: "High temperature warning",
    description: "Forecast temperature is above the configured heat-risk threshold.",
    time: "24 min ago",
    level: "High",
    icon: Flame,
    color: "orange",
  },
  {
    id: 3,
    title: "Review available cooling resources",
    description: "Check hydration supplies and cooling arrangements in emergency care.",
    time: "42 min ago",
    level: "Medium",
    icon: Droplets,
    color: "blue",
  },
];

const navigationGroups = [
  {
    title: "WORKSPACE",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Heatwave Monitor", icon: Thermometer },
      { label: "Demand Forecast", icon: TrendingUp },
      { label: "Bed & ICU Capacity", icon: BedDouble },
    ],
  },
  {
    title: "HOSPITAL OPERATIONS",
    items: [
      { label: "Resource Management", icon: Package },
      { label: "Staff Management", icon: Users },
      { label: "Medicine Inventory", icon: ShieldCheck },
      { label: "Ambulance Management", icon: Ambulance },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      { label: "Risk & Alerts", icon: Siren, badge: "3" },
      { label: "Analytics & Reports", icon: FileBarChart },
    ],
  },
];

const moduleDescriptions = {
  "Heatwave Monitor": {
    title: "Heatwave Monitor",
    subtitle: "Monitor environmental conditions and heat-related hospital risk.",
    icon: Thermometer,
  },
  "Demand Forecast": {
    title: "Demand Forecast",
    subtitle: "Explore forecast emergency demand and expected capacity requirements.",
    icon: TrendingUp,
  },
  "Bed & ICU Capacity": {
    title: "Bed & ICU Capacity",
    subtitle: "Review hospital bed availability and critical care capacity.",
    icon: BedDouble,
  },
  "Resource Management": {
    title: "Resource Management",
    subtitle: "Coordinate essential hospital resources and readiness.",
    icon: Package,
  },
  "Staff Management": {
    title: "Staff Management",
    subtitle: "Review staffing availability and operational preparedness.",
    icon: Users,
  },
  "Medicine Inventory": {
    title: "Medicine Inventory",
    subtitle: "Review medicine and essential supply inventory.",
    icon: ShieldCheck,
  },
  "Ambulance Management": {
    title: "Ambulance Management",
    subtitle: "Monitor ambulance availability and emergency readiness.",
    icon: Ambulance,
  },
  "Risk & Alerts": {
    title: "Risk & Alerts",
    subtitle: "Review operational alerts and suggested preparedness actions.",
    icon: Siren,
  },
  "Analytics & Reports": {
    title: "Analytics & Reports",
    subtitle: "Review hospital demand trends and generate reports.",
    icon: FileBarChart,
  },
  "User Management": {
    title: "User Management",
    subtitle: "Manage access to the HeatCare AI workspace.",
    icon: Users,
  },
  Settings: {
    title: "Settings",
    subtitle: "Configure your dashboard preferences.",
    icon: Settings,
  },
};

function StatCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon: Icon,
  tone,
  progress,
}) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-icon ${tone}`}>
          <Icon size={21} strokeWidth={1.8} />
        </div>

        <button className="icon-button subtle-button" aria-label={`More options for ${title}`}>
          <MoreHorizontal size={19} />
        </button>
      </div>

      <p className="stat-title">{title}</p>

      <div className="stat-value-row">
        <h2>{value}</h2>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>

      <div className="stat-bottom">
        <span className={`change-pill ${change?.startsWith("-") ? "negative" : "positive"}`}>
          {change?.startsWith("-") ? (
            <ArrowDownRight size={14} />
          ) : (
            <ArrowUpRight size={14} />
          )}
          {change}
        </span>
        <span className="stat-change-label">{changeLabel}</span>
      </div>

      {progress !== undefined && (
        <div className="progress-track">
          <div
            className={`progress-fill ${tone}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </article>
  );
}

function SectionHeading({ title, subtitle, action, onAction }) {
  return (
    <div className="section-heading">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action && (
        <button className="text-action" onClick={onAction}>
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function Dashboard({
  setActivePage,
  alerts,
  dismissAlert,
}) {
  const [forecastRange, setForecastRange] = useState("Today");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      try {
        const response = await fetch("http://localhost:5000/api/weather");
        if (!response.ok) throw new Error("Weather request failed");
        const result = await response.json();
        if (isMounted) {
          setWeatherData(result);
          setWeatherError(false);
        }
      } catch (error) {
        if (isMounted) setWeatherError(true);
      }
    }

    loadWeather();
    const intervalId = window.setInterval(loadWeather, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const currentWeather = weatherData?.current || {};
  const temperature = Number.isFinite(Number(currentWeather.temperature_2m))
    ? Math.round(Number(currentWeather.temperature_2m))
    : null;
  const humidity = Number.isFinite(Number(currentWeather.relative_humidity_2m))
    ? Math.round(Number(currentWeather.relative_humidity_2m))
    : null;
  const windSpeed = Number.isFinite(Number(currentWeather.wind_speed_10m))
    ? Math.round(Number(currentWeather.wind_speed_10m))
    : null;
  const apparentTemperature = Number.isFinite(Number(currentWeather.apparent_temperature))
    ? Math.round(Number(currentWeather.apparent_temperature))
    : null;

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Zap size={13} fill="currentColor" />
            HOSPITAL INTELLIGENCE PLATFORM
          </div>

          <h2>
            Prepared for the heat.
            <br />
            <span>Ready for every patient.</span>
          </h2>

          <p>
            Predict heat-related emergency demand, anticipate resource
            pressure, and prepare your hospital before demand peaks.
          </p>

          <div className="welcome-actions">
            <button
              className="primary-button"
              onClick={() => setActivePage("Demand Forecast")}
            >
              View demand forecast
              <ArrowRight size={16} />
            </button>

            <button
              className="welcome-secondary"
              onClick={() => setActivePage("Heatwave Monitor")}
            >
              <CloudSun size={17} />
              Heatwave conditions
            </button>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-glow" />

          <div className="visual-center">
            <HeartPulse size={57} strokeWidth={1.35} />
          </div>

          <div className="floating-chip chip-top">
            <span className="chip-dot green-dot" />
            Hospital readiness
            <strong>Monitor</strong>
          </div>

          <div className="floating-chip chip-bottom">
            <Flame size={16} />
            <span>Heat risk</span>
            <strong>Elevated</strong>
          </div>
        </div>

        <div className="welcome-decoration decoration-one" />
        <div className="welcome-decoration decoration-two" />
      </div>

      <div className="dashboard-section-title">
        <div>
          <h2>Hospital overview</h2>
          <p>Key operational indicators at a glance.</p>
        </div>

        <div className="last-updated">
          <span className="live-dot" />
          Illustrative demo data
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Emergency visits"
          value="124"
          change="+18.4%"
          changeLabel="vs. usual baseline"
          icon={Activity}
          tone="blue"
        />

        <StatCard
          title="Available beds"
          value="38"
          unit="/ 120"
          change="-8.2%"
          changeLabel="availability trend"
          icon={BedDouble}
          tone="teal"
          progress={32}
        />

        <StatCard
          title="ICU occupancy"
          value="82"
          unit="%"
          change="+6.5%"
          changeLabel="vs. previous period"
          icon={HeartPulse}
          tone="purple"
          progress={82}
        />

        <StatCard
          title="Active alerts"
          value={String(alerts.length).padStart(2, "0")}
          change={alerts.length > 0 ? "Attention" : "Clear"}
          changeLabel="operational alerts"
          icon={Bell}
          tone="orange"
        />
      </div>

      <div className="dashboard-main-grid">
        <section className="panel forecast-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title-row">
                <div className="mini-icon blue">
                  <BrainCircuit size={18} />
                </div>
                <h3>Emergency demand forecast</h3>
              </div>
              <p className="panel-subtitle">
                Illustrative hourly visits · Not a validated prediction
              </p>
            </div>

            <div className="select-wrapper">
              <CalendarDays size={15} />
              <select
                value={forecastRange}
                onChange={(event) => setForecastRange(event.target.value)}
                aria-label="Forecast time range"
              >
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Next 7 days</option>
              </select>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="chart-summary">
            <div>
              <span className="summary-label">Expected peak</span>
              <strong>
                {forecastRange === "Tomorrow"
                  ? "96"
                  : forecastRange === "Next 7 days"
                    ? "112"
                    : "82"}{" "}
                <small>visits</small>
              </strong>
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-dot actual-dot" />
                Observed
              </span>
              <span>
                <i className="legend-dot predicted-dot" />
                Illustrative forecast
              </span>
            </div>
          </div>

          <div className="forecast-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={forecastData.map((item, index) => ({
                  ...item,
                  predicted:
                    forecastRange === "Tomorrow"
                      ? Math.round(item.predicted * 1.12)
                      : forecastRange === "Next 7 days"
                        ? Math.round(item.predicted * 1.25)
                        : item.predicted,
                  actual:
                    forecastRange === "Tomorrow"
                      ? Math.round(item.actual * 1.08)
                      : forecastRange === "Next 7 days"
                        ? Math.round(item.actual * 1.15)
                        : item.actual,
                }))}
                margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                  </linearGradient>

                  <linearGradient id="observedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#E9EEF5"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="time"
                  tick={{ fill: "#8994A6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />

                <YAxis
                  tick={{ fill: "#8994A6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8EDF4",
                    boxShadow: "0 8px 30px rgba(24, 39, 75, 0.08)",
                    fontSize: 12,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Observed"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#observedGradient)"
                  activeDot={{ r: 4 }}
                />

                <Area
                  type="monotone"
                  dataKey="predicted"
                  name="Illustrative forecast"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#forecastGradient)"
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-note">
            <div className="note-icon">
              <BrainCircuit size={16} />
            </div>
            <p>
              <strong>Demo mode:</strong> These values are illustrative.
              Connect verified hospital records and weather data before
              using forecasts for operational decisions.
            </p>
          </div>
        </section>

        <section className="panel weather-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title-row">
                <div className="mini-icon orange">
                  <CloudSun size={18} />
                </div>
                <h3>Heatwave monitor</h3>
              </div>
              <p className="panel-subtitle">Pune, Maharashtra · {weatherData ? "Live weather feed" : "Connecting to weather feed"}</p>
            </div>

            <button
              className="icon-button"
              aria-label="Open heatwave monitor"
              onClick={() => setActivePage("Heatwave Monitor")}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="weather-current">
            <div>
              <div className="weather-condition">
                <span className="weather-sun">☀</span>
                <span>Hot conditions</span>
              </div>

              <div className="temperature">
                {temperature === null ? "--" : temperature}<span>°C</span>
              </div>

              <p className="temperature-caption">
                {apparentTemperature === null
                  ? (weatherError ? "Weather feed unavailable" : "Loading current forecast...")
                  : `Feels like ${apparentTemperature}°C · Open-Meteo forecast`}
              </p>
            </div>

            <div className="weather-illustration">
              <div className="sun-halo">
                <div className="sun-core" />
              </div>
              <div className="sun-cloud cloud-one" />
              <div className="sun-cloud cloud-two" />
            </div>
          </div>

          <div className="weather-metrics">
            <div className="weather-metric">
              <Droplets size={17} />
              <div>
                <span>Humidity</span>
                <strong>{humidity === null ? "--" : `${humidity}%`}</strong>
              </div>
            </div>

            <div className="weather-metric">
              <Wind size={17} />
              <div>
                <span>Wind speed</span>
                <strong>{windSpeed === null ? "--" : `${windSpeed} km/h`}</strong>
              </div>
            </div>
          </div>

          <div className="heat-risk-box">
            <div className="heat-risk-top">
              <span>Heat-risk interpretation</span>
              <span className="risk-badge">{temperature === null ? "Pending" : temperature >= 40 ? "High" : temperature >= 35 ? "Elevated" : temperature >= 30 ? "Moderate" : "Lower"}</span>
            </div>

            <div className="risk-meter">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="risk-meter-labels">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>

          <button
            className="full-width-link"
            onClick={() => setActivePage("Heatwave Monitor")}
          >
            View environmental monitor
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      <div className="dashboard-bottom-grid">
        <section className="panel capacity-panel">
          <SectionHeading
            title="Hospital capacity"
            subtitle="Illustrative bed allocation"
            action="View capacity"
            onAction={() => setActivePage("Bed & ICU Capacity")}
          />

          <div className="capacity-total">
            <div>
              <strong>120</strong>
              <span>Total beds</span>
            </div>

            <div className="capacity-availability">
              <span className="capacity-dot" />
              38 available
            </div>
          </div>

          <div className="capacity-bar">
            <span className="capacity-used" />
            <span className="capacity-reserved" />
            <span className="capacity-free" />
          </div>

          <div className="capacity-legend">
            <div>
              <i className="used-dot" />
              <span>Occupied</span>
              <strong>68</strong>
            </div>

            <div>
              <i className="reserved-dot" />
              <span>Reserved</span>
              <strong>14</strong>
            </div>

            <div>
              <i className="free-dot" />
              <span>Available</span>
              <strong>38</strong>
            </div>
          </div>

          <div className="capacity-divider" />

          <div className="icu-row">
            <div className="icu-symbol">
              <HeartPulse size={18} />
            </div>

            <div className="icu-info">
              <strong>ICU capacity</strong>
              <span>18 of 22 beds occupied</span>
            </div>

            <div className="icu-percentage">
              <strong>82%</strong>
              <span>Occupancy</span>
            </div>
          </div>

          <div className="small-progress">
            <span style={{ width: "82%" }} />
          </div>
        </section>

        <section className="panel alerts-panel">
          <SectionHeading
            title="Recent alerts"
            subtitle="Operational items requiring attention"
            action="View all"
            onAction={() => setActivePage("Risk & Alerts")}
          />

          <div className="alert-list">
            {alerts.length === 0 ? (
              <div className="empty-alerts">
                <CheckCircle2 size={28} />
                <strong>All caught up</strong>
                <span>No active demo alerts remain.</span>
              </div>
            ) : (
              alerts.slice(0, 3).map((alert) => {
                const AlertIcon = alert.icon;

                return (
                  <div className="alert-item" key={alert.id}>
                    <div className={`alert-icon ${alert.color}`}>
                      <AlertIcon size={18} />
                    </div>

                    <div className="alert-content">
                      <div className="alert-title-row">
                        <strong>{alert.title}</strong>
                        <span className={`alert-level ${alert.color}`}>
                          {alert.level}
                        </span>
                      </div>

                      <p>{alert.description}</p>

                      <span className="alert-time">
                        <Clock3 size={12} />
                        {alert.time}
                      </span>
                    </div>

                    <button
                      className="dismiss-alert"
                      aria-label={`Dismiss ${alert.title}`}
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <div className="bottom-info-strip">
        <div className="bottom-info-icon">
          <ShieldCheck size={19} />
        </div>

        <div>
          <strong>Designed for responsible hospital preparedness</strong>
          <p>
            HeatCare AI supports planning and resource awareness. It does not
            diagnose patients or replace clinical judgment.
          </p>
        </div>

        <button
          className="bottom-info-action"
          onClick={() => setActivePage("Analytics & Reports")}
        >
          Explore analytics
          <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}

function HeatwavePage() {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      try {
        const response = await fetch("http://localhost:5000/api/weather");
        if (!response.ok) throw new Error("Weather request failed");
        const result = await response.json();
        if (isMounted) {
          setWeatherData(result);
          setWeatherError(false);
        }
      } catch (error) {
        if (isMounted) setWeatherError(true);
      }
    }

    loadWeather();
    const intervalId = window.setInterval(loadWeather, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const current = weatherData?.current || {};
  const daily = weatherData?.daily || {};
  const temperature = Number.isFinite(Number(current.temperature_2m)) ? Math.round(Number(current.temperature_2m)) : null;
  const humidity = Number.isFinite(Number(current.relative_humidity_2m)) ? Math.round(Number(current.relative_humidity_2m)) : null;
  const windSpeed = Number.isFinite(Number(current.wind_speed_10m)) ? Math.round(Number(current.wind_speed_10m)) : null;
  const apparentTemperature = Number.isFinite(Number(current.apparent_temperature)) ? Math.round(Number(current.apparent_temperature)) : null;
  const riskStatus = temperature === null ? "Pending" : temperature >= 40 ? "High" : temperature >= 35 ? "Elevated" : temperature >= 30 ? "Moderate" : "Lower";
  const dailyForecast = (daily.time || []).map((date, index) => ({
    date,
    max: daily.temperature_2m_max?.[index],
    min: daily.temperature_2m_min?.[index],
    rain: daily.precipitation_probability_max?.[index],
  }));

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon orange"><Thermometer size={28} /></div>
        <div>
          <span className="eyebrow">ENVIRONMENTAL INTELLIGENCE</span>
          <h2>Heatwave monitoring</h2>
          <p>Live weather conditions for Pune that may influence emergency department demand.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Temperature" value={temperature === null ? "--" : String(temperature)} unit="°C" change={weatherData ? "Live feed" : "Loading"} changeLabel="Open-Meteo current forecast" icon={Thermometer} tone="orange" />
        <StatCard title="Feels like" value={apparentTemperature === null ? "--" : String(apparentTemperature)} unit="°C" change={weatherData ? "Live feed" : "Loading"} changeLabel="Apparent temperature" icon={Flame} tone="orange" />
        <StatCard title="Relative humidity" value={humidity === null ? "--" : String(humidity)} unit="%" change={weatherData ? "Live feed" : "Loading"} changeLabel="Relative humidity" icon={Droplets} tone="blue" />
        <StatCard title="Wind speed" value={windSpeed === null ? "--" : String(windSpeed)} unit="km/h" change={weatherData ? "Live feed" : "Loading"} changeLabel="10-metre wind speed" icon={Wind} tone="teal" />
      </div>

      <section className="panel page-panel">
        <SectionHeading title="5-day weather outlook" subtitle="Open-Meteo forecast for Pune, Maharashtra" />
        {dailyForecast.length > 0 ? (
          <div className="hourly-weather-grid">
            {dailyForecast.map((item) => (
              <div className="hourly-weather-card" key={item.date}>
                <span>{new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}</span>
                <span className="hourly-weather-icon">☀️</span>
                <strong>{item.max === undefined ? "--" : `${Math.round(item.max)}°`}</strong>
                <span className="hourly-condition">Low {item.min === undefined ? "--" : `${Math.round(item.min)}°`}</span>
                <span className="hourly-condition">Rain chance {item.rain === undefined ? "--" : `${item.rain}%`}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-alerts page-empty">
            <CloudSun size={30} />
            <strong>{weatherError ? "Weather feed unavailable" : "Loading weather forecast"}</strong>
            <span>{weatherError ? "Check that the backend is running on port 5000 and try again." : "Connecting to Open-Meteo..."}</span>
          </div>
        )}
        <div className="chart-note">
          <div className="note-icon"><ShieldCheck size={16} /></div>
          <p>Weather values come from Open-Meteo and are forecast data, not hospital demand predictions. Heat-risk labels are simple temperature-based indicators, not official warnings.</p>
        </div>
      </section>

      <section className="panel page-panel">
        <SectionHeading title="Satellite thermal detections" subtitle="Recent NASA FIRMS detections across the Maharashtra region" />
        <HeatwaveMap />
        <div className="chart-note">
          <div className="note-icon"><ShieldCheck size={16} /></div>
          <p>NASA FIRMS detects satellite thermal anomalies; detections do not represent ambient temperature or confirm a heatwave. Use the map as a separate environmental context layer.</p>
        </div>
      </section>
    </>
  );
}

function ForecastPage() {
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      try {
        const response = await fetch("http://localhost:5000/api/demand-analysis");
        if (!response.ok) throw new Error("Demand analysis request failed");
        const result = await response.json();
        if (isMounted) {
          setAnalysis(result);
          setAnalysisError(false);
          setAnalysisLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setAnalysisError(true);
          setAnalysisLoading(false);
        }
      }
    }

    loadAnalysis();
    const intervalId = window.setInterval(loadAnalysis, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const environment = analysis?.environment || {};
  const score = analysis?.analysis?.heat_risk_score;
  const riskLevel = analysis?.analysis?.risk_level || "Unavailable";
  const components = analysis?.analysis?.components || {};

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon blue">
          <BrainCircuit size={28} />
        </div>
        <div>
          <span className="eyebrow">PREDICTIVE INTELLIGENCE</span>
          <h2>Heat risk & demand analysis</h2>
          <p>Live environmental inputs with an explainable prototype heat-risk indicator for Pune.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Environmental heat-risk score"
          value={score === undefined ? (analysisLoading ? "Loading" : "--") : String(score)}
          unit={score === undefined ? "" : "/100"}
          change={analysisLoading ? "Connecting" : analysisError ? "Unavailable" : "Live weather"}
          changeLabel="Illustrative indicator, not a validated warning"
          icon={Thermometer}
          tone="orange"
        />
        <StatCard
          title="Risk category"
          value={riskLevel}
          change={analysis ? "Calculated" : "Pending"}
          changeLabel="Based on transparent prototype rules"
          icon={Activity}
          tone="purple"
        />
        <StatCard
          title="Current temperature"
          value={environment.temperature_c === undefined ? "--" : String(environment.temperature_c)}
          unit="°C"
          change={analysis ? "Open-Meteo" : "Pending"}
          changeLabel="Current forecast value"
          icon={CloudSun}
          tone="blue"
        />
        <StatCard
          title="Hospital demand model"
          value="Not trained"
          change="Data required"
          changeLabel="No admission prediction is being made"
          icon={BrainCircuit}
          tone="teal"
        />
      </div>

      <section className="panel page-panel">
        <SectionHeading title="Why this risk score?" subtitle="Live weather factors used by the prototype calculation" />
        {analysis ? (
          <>
            <div className="stats-grid">
              <StatCard title="Temperature factor" value={String(Math.round(components.temperature_score ?? 0))} unit="/100" change="45% weight" changeLabel="Illustrative model weight" icon={Thermometer} tone="orange" />
              <StatCard title="Feels-like factor" value={String(Math.round(components.apparent_temperature_score ?? 0))} unit="/100" change="40% weight" changeLabel="Illustrative model weight" icon={Flame} tone="purple" />
              <StatCard title="Humidity factor" value={String(Math.round(components.humidity_score ?? 0))} unit="/100" change="15% weight" changeLabel="Illustrative model weight" icon={Droplets} tone="blue" />
              <StatCard title="Wind speed" value={environment.wind_speed_kmh === undefined ? "--" : String(environment.wind_speed_kmh)} unit="km/h" change="Live input" changeLabel="Not included in score formula" icon={Wind} tone="teal" />
            </div>
            <div className="chart-note">
              <div className="note-icon"><ShieldCheck size={16} /></div>
              <p><strong>Suggested preparedness review:</strong> {analysis.recommended_action} The score uses transparent illustrative weights and thresholds; it is not an official heat alert or a clinical risk assessment.</p>
            </div>
          </>
        ) : (
          <div className="empty-alerts page-empty">
            <CloudSun size={30} />
            <strong>{analysisLoading ? "Loading live analysis" : "Analysis service unavailable"}</strong>
            <span>{analysisError ? "Check that the backend is running and /api/demand-analysis returns JSON." : "Connecting to the weather and analysis API..."}</span>
          </div>
        )}
      </section>

      <section className="panel page-panel">
        <SectionHeading title="Illustrative hospital-demand pattern" subtitle="Example values only — not a trained or validated forecast" />
        <div className="large-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="largeForecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E9EEF5" strokeDasharray="4 5" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#8994A6", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8994A6", fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="actual" name="Illustrative reference values" stroke="#10B981" strokeWidth={2} fillOpacity={0} />
              <Area type="monotone" dataKey="predicted" name="Illustrative example values" stroke="#3B82F6" strokeWidth={2.5} fill="url(#largeForecastGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-note">
          <div className="note-icon"><ShieldCheck size={16} /></div>
          <p>Live weather is connected, but actual hospital-demand prediction requires historical admissions, local context, model training, and validation. Do not use this demo chart for operational decisions.</p>
        </div>
      </section>
    </>
  );
}

function CapacityPage() {
  const API_URL = "http://localhost:5000/api/capacity";

  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Ward",
    total: "",
    occupied: "",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [demoData, setDemoData] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const loadCapacity = async (showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const response = await fetch(API_URL, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Capacity API returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setDepartments(Array.isArray(data.units) ? data.units : []);
      setUpdatedAt(data.updated_at || null);
      setDemoData(Boolean(data.demo_data));
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setError("");
    } catch (requestError) {
      setError(
        "Cannot connect to the hospital capacity server. Check that the backend is running on port 5000."
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadCapacity(true);
    const intervalId = window.setInterval(() => loadCapacity(false), 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const totalBeds = departments.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );
  const occupiedBeds = departments.reduce(
    (sum, item) => sum + Number(item.occupied || 0),
    0
  );
  const availableBeds = Math.max(totalBeds - occupiedBeds, 0);
  const occupancy = totalBeds
    ? Math.round((occupiedBeds / totalBeds) * 100)
    : 0;

  const icuBeds = departments.filter((item) => item.category === "ICU");
  const totalIcuBeds = icuBeds.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );
  const occupiedIcuBeds = icuBeds.reduce(
    (sum, item) => sum + Number(item.occupied || 0),
    0
  );
  const icuOccupancy = totalIcuBeds
    ? Math.round((occupiedIcuBeds / totalIcuBeds) * 100)
    : 0;

  const persistUnitChange = async (id, field, value) => {
    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 0) {
      setNotice("");
      setError("Enter a valid non-negative whole number.");
      loadCapacity(false);
      return;
    }

    const unit = departments.find((item) => item.id === id);
    if (!unit) return;

    const proposedTotal =
      field === "total" ? numericValue : Number(unit.total);
    const proposedOccupied =
      field === "occupied" ? numericValue : Number(unit.occupied);

    if (proposedTotal < 1 || proposedOccupied > proposedTotal) {
      setError("Total beds must be at least 1, and occupied beds cannot exceed total beds.");
      loadCapacity(false);
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: numericValue }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to update this unit."
        );
      }

      setNotice("Capacity record updated on the server.");
      await loadCapacity(false);
    } catch (requestError) {
      setError(requestError.message || "Could not save the capacity update.");
      await loadCapacity(false);
    } finally {
      setSaving(false);
    }
  };

  const addDepartment = async (event) => {
    event.preventDefault();

    const total = Number(form.total);
    const occupied = Number(form.occupied);

    if (
      !form.name.trim() ||
      !Number.isInteger(total) ||
      total < 1 ||
      !Number.isInteger(occupied) ||
      occupied < 0 ||
      occupied > total
    ) {
      setError(
        "Enter a unit name, a positive whole-number capacity, and occupancy between 0 and total beds."
      );
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          total,
          occupied,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to add the unit."
        );
      }

      setForm({
        name: "",
        category: "Ward",
        total: "",
        occupied: "",
      });
      setShowForm(false);
      setNotice("New unit added and saved on the server.");
      await loadCapacity(false);
    } catch (requestError) {
      setError(requestError.message || "Could not add the unit.");
    } finally {
      setSaving(false);
    }
  };

  const removeDepartment = async (id) => {
    const unit = departments.find((item) => item.id === id);
    if (!unit) return;

    if (!window.confirm(`Remove "${unit.name}" from the capacity register?`)) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to remove the unit."
        );
      }

      setNotice("Unit removed from the server capacity register.");
      await loadCapacity(false);
    } catch (requestError) {
      setError(requestError.message || "Could not remove the unit.");
    } finally {
      setSaving(false);
    }
  };

  const resetDemo = async () => {
    if (
      !window.confirm(
        "Restore the four illustrative demo units? Current capacity entries will be replaced. Continue only if you intend to reset the demo data."
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Unable to reset demo data."
        );
      }

      setNotice("Illustrative demo records restored on the server.");
      await loadCapacity(false);
    } catch (requestError) {
      setError(requestError.message || "Could not reset demo records.");
    } finally {
      setSaving(false);
    }
  };

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString()
    : "Not yet synced";

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon purple"><BedDouble size={28} /></div>
        <div>
          <span className="eyebrow">HOSPITAL OPERATIONS</span>
          <h2>Bed &amp; ICU capacity</h2>
          <p>Manage unit capacity and occupancy with server-saved records and automatic refresh.</p>
        </div>
      </div>

      <div className="chart-note" style={{ marginBottom: 20 }}>
        <div className="note-icon"><ShieldCheck size={16} /></div>
        <p>
          <strong>{demoData ? "Illustrative demo data:" : "Hospital register:"}</strong>{" "}
          {demoData
            ? "The initial bed counts are examples, not verified hospital records."
            : "Records are saved by this application's backend and shared by clients using the same server."}
          {" "}The page refreshes from the server every 5 seconds. It is not connected to a live hospital information system.
        </p>
      </div>

      <div className="panel page-panel" style={{ marginBottom: 20, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: error ? "#b91c1c" : "#475569", fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: error ? "#dc2626" : "#16a34a", display: "inline-block" }} />
          {error ? "Server connection / operation issue" : loading ? "Connecting to capacity server..." : saving ? "Saving changes..." : "Connected · automatic refresh every 5 seconds"}
        </div>
        <div style={{ color: "#64748b", fontSize: 12 }}>
          Last server update: <strong>{formattedUpdatedAt}</strong>
        </div>
      </div>

      {error && (
        <div role="alert" style={{ padding: "12px 14px", marginBottom: 16, borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>
          {error}
          <button type="button" onClick={() => loadCapacity(true)} style={{ marginLeft: 10, border: "1px solid #fecaca", background: "#fff", borderRadius: 7, padding: "5px 9px", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {notice && (
        <div role="status" style={{ padding: "10px 12px", marginBottom: 16, borderRadius: 10, background: "#eff6ff", color: "#1d4ed8", fontSize: 13 }}>
          {notice}
        </div>
      )}

      <div className="stats-grid">
        <StatCard title="Total beds" value={totalBeds.toLocaleString()} change="All units" changeLabel="configured capacity" icon={BedDouble} tone="blue" />
        <StatCard title="Occupied beds" value={occupiedBeds.toLocaleString()} change={`${occupancy}%`} changeLabel="overall occupancy" icon={Activity} tone="purple" />
        <StatCard title="Available beds" value={availableBeds.toLocaleString()} change="Calculated" changeLabel="total minus occupied" icon={CheckCircle2} tone="teal" />
        <StatCard title="ICU occupancy" value={`${icuOccupancy}%`} change={`${occupiedIcuBeds}/${totalIcuBeds}`} changeLabel="occupied / total ICU beds" icon={HeartPulse} tone="orange" />
      </div>

      {alerts.length > 0 && (
        <section className="panel page-panel" style={{ marginBottom: 20 }}>
          <SectionHeading title="Capacity alerts" subtitle="Automatically calculated from the latest server records" />
          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            {alerts.map((alert, index) => (
              <div key={`${alert.title}-${index}`} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, border: `1px solid ${alert.level === "Critical" ? "#fecaca" : "#fed7aa"}`, background: alert.level === "Critical" ? "#fff7f7" : "#fffaf2" }}>
                <AlertTriangle size={18} color={alert.level === "Critical" ? "#dc2626" : "#c2410c"} />
                <div>
                  <strong style={{ display: "block", fontSize: 13, color: alert.level === "Critical" ? "#991b1b" : "#9a3412" }}>{alert.title}</strong>
                  <span style={{ display: "block", fontSize: 12, color: "#64748b", marginTop: 4 }}>{alert.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel page-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <SectionHeading title="Unit-wise capacity" subtitle="Edit values and save them to the backend capacity register" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="secondary-button" disabled={saving} onClick={resetDemo}>Reset demo</button>
            <button type="button" className="primary-button" disabled={saving} onClick={() => { setShowForm((value) => !value); setError(""); setNotice(""); }}>
              {showForm ? "Cancel" : "+ Add unit"}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={addDepartment} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, padding: 16, marginBottom: 20, border: "1px solid #e5eaf2", borderRadius: 14, background: "#f8fbff" }}>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Unit name
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Paediatric ward" style={capacityInputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Unit type
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} style={capacityInputStyle}>
                <option>Ward</option><option>ICU</option><option>Emergency</option><option>Other</option>
              </select>
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Total beds
              <input required type="number" min="1" step="1" value={form.total} onChange={(event) => setForm({ ...form, total: event.target.value })} placeholder="Total" style={capacityInputStyle} />
            </label>
            <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Occupied beds
              <input required type="number" min="0" step="1" value={form.occupied} onChange={(event) => setForm({ ...form, occupied: event.target.value })} placeholder="Occupied" style={capacityInputStyle} />
            </label>
            <div style={{ display: "flex", alignItems: "end" }}>
              <button className="primary-button" type="submit" disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save unit"}</button>
            </div>
          </form>
        )}

        {loading && departments.length === 0 ? (
          <p style={{ padding: 20, color: "#64748b" }}>Loading capacity records...</p>
        ) : (
          <div className="department-list">
            {departments.map((department) => {
              const total = Number(department.total || 0);
              const occupied = Number(department.occupied || 0);
              const available = Math.max(total - occupied, 0);
              const percentage = total ? Math.round((occupied / total) * 100) : 0;
              const color = percentage >= 90 ? "orange" : percentage >= 75 ? "purple" : "blue";

              return (
                <div className="department-row" key={department.id} style={{ alignItems: "flex-start", gap: 14 }}>
                  <div className={`department-icon ${color}`}><BedDouble size={20} /></div>
                  <div className="department-main" style={{ minWidth: 0 }}>
                    <div className="department-title" style={{ gap: 10, flexWrap: "wrap" }}>
                      <strong>{department.name}</strong>
                      <span>{department.category}</span>
                      <span style={{ fontWeight: 700, color: percentage >= 90 ? "#dc2626" : "#475569" }}>{percentage}% occupied</span>
                    </div>
                    <div className="department-progress"><span className={color} style={{ width: `${Math.min(percentage, 100)}%` }} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginTop: 12 }}>
                      <label style={{ display: "grid", gap: 5, fontSize: 11, color: "#64748b" }}>Total beds
                        <input aria-label={`${department.name} total beds`} type="number" min="1" step="1" defaultValue={total} key={`${department.id}-total-${total}`} onBlur={(event) => { if (Number(event.target.value) !== total) persistUnitChange(department.id, "total", event.target.value); }} style={capacityInputStyle} />
                      </label>
                      <label style={{ display: "grid", gap: 5, fontSize: 11, color: "#64748b" }}>Occupied beds
                        <input aria-label={`${department.name} occupied beds`} type="number" min="0" max={total} step="1" defaultValue={occupied} key={`${department.id}-occupied-${occupied}`} onBlur={(event) => { if (Number(event.target.value) !== occupied) persistUnitChange(department.id, "occupied", event.target.value); }} style={capacityInputStyle} />
                      </label>
                      <div style={{ display: "flex", alignItems: "end", paddingBottom: 9, fontSize: 12, color: "#64748b" }}>{available} beds available</div>
                    </div>
                  </div>
                  <button type="button" disabled={saving} onClick={() => removeDepartment(department.id)} aria-label={`Remove ${department.name}`} title="Remove unit" style={{ border: "1px solid #fee2e2", background: "#fff7f7", color: "#b91c1c", borderRadius: 9, padding: "7px 10px", cursor: saving ? "not-allowed" : "pointer", fontSize: 12 }}>Remove</button>
                </div>
              );
            })}
            {departments.length === 0 && <p style={{ padding: 20, color: "#64748b" }}>No units configured. Select “Add unit” to create one.</p>}
          </div>
        )}
      </section>
    </>
  );
}

const capacityInputStyle = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  border: "1px solid #dbe3ef",
  borderRadius: 9,
  padding: "9px 10px",
  background: "#ffffff",
  color: "#1e293b",
  fontSize: 13,
  outline: "none",
};

function AlertsPage({ alerts, dismissAlert }) {
  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon orange">
          <Siren size={28} />
        </div>

        <div>
          <span className="eyebrow">OPERATIONAL AWARENESS</span>
          <h2>Risk & alerts</h2>
          <p>Review demo alerts and dismiss them when you have finished reviewing.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Active alerts" value={String(alerts.length).padStart(2, "0")} change="Demo" changeLabel="illustrative alerts" icon={Bell} tone="orange" />
        <StatCard title="Critical alerts" value={alerts.filter((item) => item.level === "Critical").length.toString()} change="Review" changeLabel="check operational data" icon={AlertTriangle} tone="purple" />
        <StatCard title="Recommended action" value="Review" change="Suggested" changeLabel="not an automated decision" icon={ShieldCheck} tone="blue" />
        <StatCard title="Alert engine" value="Demo" change="Not connected" changeLabel="backend integration pending" icon={BrainCircuit} tone="teal" />
      </div>

      <section className="panel page-panel">
        <SectionHeading title="Alert centre" subtitle={`${alerts.length} active illustrative alerts`} />

        {alerts.length === 0 ? (
          <div className="empty-alerts page-empty">
            <CheckCircle2 size={32} />
            <strong>No active demo alerts</strong>
            <span>There are no remaining illustrative alerts to review.</span>
          </div>
        ) : (
          <div className="full-alert-list">
            {alerts.map((alert) => {
              const Icon = alert.icon;

              return (
                <div className="full-alert-row" key={alert.id}>
                  <div className={`alert-icon ${alert.color}`}>
                    <Icon size={20} />
                  </div>

                  <div className="full-alert-content">
                    <div className="alert-title-row">
                      <strong>{alert.title}</strong>
                      <span className={`alert-level ${alert.color}`}>{alert.level}</span>
                    </div>
                    <p>{alert.description}</p>
                    <span className="alert-time"><Clock3 size={12} /> {alert.time}</span>
                  </div>

                  <button className="outline-button" onClick={() => dismissAlert(alert.id)}>
                    Dismiss
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="chart-note">
          <div className="note-icon"><ShieldCheck size={16} /></div>
          <p>
            These alerts are examples for interface demonstration. They are
            not generated from live hospital systems and should not be used
            as real emergency notifications.
          </p>
        </div>
      </section>
    </>
  );
}

function AnalyticsPage() {
  const [reportMessage, setReportMessage] = useState("");

  function downloadReport() {
    const content = [
      "HeatCare AI - Illustrative Dashboard Report",
      "",
      "IMPORTANT: This report contains demonstration data only.",
      "It is not a clinical or operational forecast.",
      "",
      "Illustrative emergency visits: 124",
      "Illustrative available beds: 38 of 120",
      "Illustrative ICU occupancy: 82%",
      "Illustrative temperature: 40 C",
      "",
      "Connect verified hospital data and weather data before using results.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "heatcare-demo-report.txt";
    link.click();

    URL.revokeObjectURL(url);
    setReportMessage("Illustrative report downloaded successfully.");
  }

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon blue">
          <FileBarChart size={28} />
        </div>

        <div>
          <span className="eyebrow">HOSPITAL ANALYTICS</span>
          <h2>Analytics & reports</h2>
          <p>Review illustrative indicators and export a demo report.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Emergency visits" value="124" change="Demo" changeLabel="illustrative figure" icon={Activity} tone="blue" />
        <StatCard title="Bed availability" value="32%" change="Demo" changeLabel="illustrative figure" icon={BedDouble} tone="teal" />
        <StatCard title="ICU occupancy" value="82%" change="Demo" changeLabel="illustrative figure" icon={HeartPulse} tone="purple" />
        <StatCard title="Data quality" value="Pending" change="Not assessed" changeLabel="real data not connected" icon={ShieldCheck} tone="orange" />
      </div>

      <section className="panel page-panel">
        <SectionHeading title="Demand analytics" subtitle="Illustrative daily emergency demand pattern" />

        <div className="large-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#E9EEF5" strokeDasharray="4 5" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#8994A6", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8994A6", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="actual" name="Observed demo values" fill="#10B981" radius={[5, 5, 0, 0]} />
              <Bar dataKey="predicted" name="Illustrative forecast" fill="#3B82F6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <button className="primary-button report-button" onClick={downloadReport}>
          <Download size={16} />
          Download demo report
        </button>

        {reportMessage && <p className="success-message"><CheckCircle2 size={15} />{reportMessage}</p>}
      </section>
    </>
  );
}

function ResourceManagementPage() {
  const API_URL = "http://localhost:5000/api/resources";
  const [resources, setResources] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [demoData, setDemoData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Medical gas", quantity: "", unit: "units", minimum_stock: "" });

  async function loadResources(showLoader = false) {
    if (showLoader) setLoading(true);
    try {
      const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : `Resource API returned HTTP ${response.status}`);
      setResources(Array.isArray(data.resources) ? data.resources : []);
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setUpdatedAt(data.updated_at || null);
      setDemoData(Boolean(data.demo_data));
      setError("");
    } catch (err) {
      setError("Cannot connect to the resource inventory server. Check that the backend is running on port 5000 and the resource router is registered.");
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  useEffect(() => {
    loadResources(true);
    const timer = window.setInterval(() => loadResources(false), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const totalItems = resources.length;
  const lowStockCount = alerts.filter((item) => item.level === "Warning").length;
  const criticalCount = alerts.filter((item) => item.level === "Critical").length;
  const totalQuantity = resources.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const filteredResources = resources.filter((item) => `${item.name} ${item.category} ${item.unit}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const updatedLabel = updatedAt ? new Date(updatedAt).toLocaleString() : "Not yet synced";

  async function addResource(event) {
    event.preventDefault();
    const quantity = Number(form.quantity);
    const minimum_stock = Number(form.minimum_stock);
    if (!form.name.trim() || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(minimum_stock) || minimum_stock < 0 || !form.unit.trim()) {
      setError("Enter a resource name, valid quantity, unit, and minimum stock level.");
      return;
    }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), category: form.category, quantity, unit: form.unit.trim(), minimum_stock }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to add resource.");
      setForm({ name: "", category: "Medical gas", quantity: "", unit: "units", minimum_stock: "" });
      setShowForm(false); setNotice("Resource added and saved on the server."); await loadResources(false);
    } catch (err) { setError(err.message || "Could not add resource."); }
    finally { setSaving(false); }
  }

  async function updateResource(id, field, rawValue) {
    const value = ["quantity", "minimum_stock"].includes(field) ? Number(rawValue) : rawValue;
    if (["quantity", "minimum_stock"].includes(field) && (!Number.isInteger(value) || value < 0)) {
      setError("Quantity and minimum stock must be non-negative whole numbers."); await loadResources(false); return;
    }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to update resource.");
      setNotice("Inventory record updated on the server."); await loadResources(false);
    } catch (err) { setError(err.message || "Could not update resource."); await loadResources(false); }
    finally { setSaving(false); }
  }

  async function removeResource(resource) {
    if (!window.confirm(`Remove “${resource.name}” from the inventory register?`)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${resource.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to remove resource.");
      setNotice("Resource removed from the server inventory."); await loadResources(false);
    } catch (err) { setError(err.message || "Could not remove resource."); }
    finally { setSaving(false); }
  }

  async function resetDemo() {
    if (!window.confirm("Restore the five illustrative demo inventory records? Current resource entries will be replaced. Continue only if you intend to reset the demo data.")) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/reset`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to reset demo inventory.");
      setNotice("Illustrative demo inventory restored."); await loadResources(false);
    } catch (err) { setError(err.message || "Could not reset demo inventory."); }
    finally { setSaving(false); }
  }

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon blue"><Package size={28} /></div>
        <div><span className="eyebrow">HOSPITAL OPERATIONS</span><h2>Resource management</h2><p>Track essential supplies and equipment, update stock levels, and identify items that need replenishment.</p></div>
      </div>

      <div className="chart-note" style={{ marginBottom: 18 }}><div className="note-icon"><ShieldCheck size={16} /></div><p><strong>{demoData ? "Illustrative demo inventory:" : "Hospital inventory register:"}</strong> {demoData ? "These starting quantities are examples, not verified hospital stock." : "Changes are saved by the backend and shared with clients using the same server."} The page refreshes every five seconds; it is not connected to a live hospital inventory system.</p></div>

      <div className="panel page-panel" style={{ marginBottom: 18, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: error ? "#b91c1c" : "#475569", fontSize: 12 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: error ? "#dc2626" : "#16a34a", display: "inline-block" }} />{error ? "Server connection / operation issue" : loading ? "Connecting to inventory server..." : saving ? "Saving changes..." : "Connected · automatic refresh every 5 seconds"}</div>
        <div style={{ color: "#64748b", fontSize: 12 }}>Last server update: <strong>{updatedLabel}</strong></div>
      </div>
      {error && <div role="alert" style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>{error}<button type="button" onClick={() => loadResources(true)} style={{ marginLeft: 10, border: "1px solid #fecaca", background: "#fff", borderRadius: 7, padding: "5px 9px", cursor: "pointer" }}>Retry</button></div>}
      {notice && <div role="status" style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "#eff6ff", color: "#1d4ed8", fontSize: 13 }}>{notice}</div>}

      <div className="stats-grid">
        <StatCard title="Tracked resources" value={totalItems.toLocaleString()} change="Inventory register" changeLabel="configured resource types" icon={Package} tone="blue" />
        <StatCard title="Total stock units" value={totalQuantity.toLocaleString()} change="Calculated" changeLabel="sum of listed quantities" icon={Activity} tone="teal" />
        <StatCard title="Low stock" value={lowStockCount.toLocaleString()} change="Replenishment" changeLabel="at or below minimum" icon={AlertTriangle} tone="orange" />
        <StatCard title="Out of stock" value={criticalCount.toLocaleString()} change="Critical" changeLabel="items with zero quantity" icon={Siren} tone="purple" />
      </div>

      {alerts.length > 0 && <section className="panel page-panel" style={{ marginBottom: 18 }}><SectionHeading title="Inventory alerts" subtitle="Automatically calculated from current inventory quantities" /><div style={{ display: "grid", gap: 9, marginTop: 14 }}>{alerts.map((alert) => <div key={alert.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, borderRadius: 11, background: alert.level === "Critical" ? "#fff7f7" : "#fffaf2", border: `1px solid ${alert.level === "Critical" ? "#fecaca" : "#fed7aa"}` }}><AlertTriangle size={18} color={alert.level === "Critical" ? "#dc2626" : "#c2410c"} /><div><strong style={{ display: "block", fontSize: 13, color: alert.level === "Critical" ? "#991b1b" : "#9a3412" }}>{alert.level}: {alert.title}</strong><span style={{ fontSize: 12, color: "#64748b" }}>Review stock and arrange replenishment according to hospital procedures.</span></div></div>)}</div></section>}

      <section className="panel page-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}><SectionHeading title="Resource inventory" subtitle="Update quantities and minimum stock thresholds" /><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" className="secondary-button" disabled={saving} onClick={resetDemo}>Reset demo</button><button type="button" className="primary-button" disabled={saving} onClick={() => { setShowForm((value) => !value); setError(""); setNotice(""); }}>{showForm ? "Cancel" : "+ Add resource"}</button></div></div>
        {showForm && <form onSubmit={addResource} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 12, padding: 16, marginBottom: 18, border: "1px solid #e5eaf2", borderRadius: 14, background: "#f8fbff" }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Resource name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Face masks" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={capacityInputStyle}><option>Medical gas</option><option>Critical equipment</option><option>Protective supplies</option><option>Hydration supplies</option><option>Cooling equipment</option><option>Other</option></select></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Quantity<input required type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Current stock" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Unit<input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="units, kits, packets" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Minimum stock<input required type="number" min="0" step="1" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} placeholder="Reorder threshold" style={capacityInputStyle} /></label>
          <div style={{ display: "flex", alignItems: "end" }}><button type="submit" className="primary-button" disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save resource"}</button></div>
        </form>}
        <div className="table-toolbar"><div className="table-search"><Search size={16} /><input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search inventory..." /></div><span className="demo-tag">{demoData ? "DEMO RECORDS" : "SERVER RECORDS"}</span></div>
        {loading && resources.length === 0 ? <p style={{ padding: 20, color: "#64748b" }}>Loading inventory...</p> : <div className="responsive-table"><table><thead><tr><th>RESOURCE</th><th>CATEGORY</th><th>QUANTITY</th><th>MINIMUM STOCK</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filteredResources.map((resource) => { const low = Number(resource.quantity) <= Number(resource.minimum_stock); const critical = Number(resource.quantity) === 0; return <tr key={resource.id}><td><strong>{resource.name}</strong><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>ID {resource.id}</div></td><td>{resource.category}</td><td><input aria-label={`${resource.name} quantity`} type="number" min="0" step="1" defaultValue={resource.quantity} key={`${resource.id}-quantity-${resource.quantity}`} onBlur={(e) => { if (Number(e.target.value) !== Number(resource.quantity)) updateResource(resource.id, "quantity", e.target.value); }} style={{ ...capacityInputStyle, maxWidth: 110 }} /> <span style={{ fontSize: 11, color: "#64748b" }}>{resource.unit}</span></td><td><input aria-label={`${resource.name} minimum stock`} type="number" min="0" step="1" defaultValue={resource.minimum_stock} key={`${resource.id}-minimum-${resource.minimum_stock}`} onBlur={(e) => { if (Number(e.target.value) !== Number(resource.minimum_stock)) updateResource(resource.id, "minimum_stock", e.target.value); }} style={{ ...capacityInputStyle, maxWidth: 110 }} /></td><td><span className="table-status" style={{ background: critical ? "#fee2e2" : low ? "#ffedd5" : "#dcfce7", color: critical ? "#991b1b" : low ? "#9a3412" : "#166534" }}>{critical ? "Out of stock" : low ? "Low stock" : "In stock"}</span></td><td><button type="button" disabled={saving} onClick={() => removeResource(resource)} style={{ border: "1px solid #fee2e2", background: "#fff7f7", color: "#b91c1c", borderRadius: 8, padding: "7px 10px", cursor: saving ? "not-allowed" : "pointer", fontSize: 12 }}>Remove</button></td></tr>; })}{filteredResources.length === 0 && <tr><td colSpan="6" className="table-empty">{resources.length ? "No matching resources found." : "No resources configured. Select Add resource to create one."}</td></tr>}</tbody></table></div>}
      </section>
    </>
  );
}


function StaffManagementPage() {
  const API_URL = "http://localhost:5000/api/staff";
  const emptyForm = {
    name: "",
    role: "Staff Nurse",
    department: "Emergency",
    shift: "Morning",
    status: "Available",
    phone: "",
  };

  const [staff, setStaff] = useState([]);
  const [summary, setSummary] = useState({ total: 0, on_duty: 0, available: 0, on_leave: 0, departments: 0 });
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [demoData, setDemoData] = useState(true);

  const loadStaff = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : `Staff API returned HTTP ${response.status}`);
      setStaff(Array.isArray(data.staff) ? data.staff : []);
      setSummary(data.summary || { total: 0, on_duty: 0, available: 0, on_leave: 0, departments: 0 });
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setUpdatedAt(data.updated_at || null);
      setDemoData(Boolean(data.demo_data));
      setError("");
    } catch (requestError) {
      setError("Cannot connect to the staff management server. Check the backend and CORS settings for your current frontend port.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff(true);
    const timer = window.setInterval(() => loadStaff(false), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredStaff = staff.filter((person) => {
    const matchesSearch = [person.name, person.role, person.department, person.shift, person.status]
      .join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (statusFilter === "All" || person.status === statusFilter);
  });

  const updatedLabel = updatedAt ? new Date(updatedAt).toLocaleString() : "Not yet synced";

  const addStaff = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.department.trim()) {
      setError("Name, role, and department are required.");
      return;
    }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), phone: form.phone.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not add staff member.");
      setForm(emptyForm); setShowForm(false); setNotice("Staff member added to the server roster.");
      await loadStaff(false);
    } catch (requestError) {
      setError(requestError.message || "Could not add staff member.");
    } finally { setSaving(false); }
  };

  const updateStaff = async (id, field, value) => {
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not update staff record.");
      setNotice("Staff record updated on the server.");
      await loadStaff(false);
    } catch (requestError) {
      setError(requestError.message || "Could not update staff record.");
      await loadStaff(false);
    } finally { setSaving(false); }
  };

  const removeStaff = async (person) => {
    if (!window.confirm(`Remove ${person.name} from the staff roster?`)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${person.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not remove staff member.");
      setNotice("Staff member removed from the server roster.");
      await loadStaff(false);
    } catch (requestError) {
      setError(requestError.message || "Could not remove staff member.");
    } finally { setSaving(false); }
  };

  const resetDemo = async () => {
    if (!window.confirm("Restore the five illustrative demo staff records? Current roster entries will be replaced.")) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/reset`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not reset demo roster.");
      setNotice("Illustrative demo roster restored.");
      await loadStaff(false);
    } catch (requestError) {
      setError(requestError.message || "Could not reset demo roster.");
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon blue"><Users size={28} /></div>
        <div><span className="eyebrow">HOSPITAL OPERATIONS</span><h2>Staff management</h2><p>Maintain the staff roster, track shift assignments, and review availability.</p></div>
      </div>

      <div className="chart-note" style={{ marginBottom: 18 }}>
        <div className="note-icon"><ShieldCheck size={16} /></div>
        <p><strong>{demoData ? "Illustrative demo roster:" : "Hospital staff register:"}</strong> {demoData ? "These are example records, not verified hospital staffing information." : "Changes are saved by the backend and shared with clients using the same server."} The roster refreshes every five seconds. It is not connected to hospital HR or scheduling software.</p>
      </div>

      <div className="panel page-panel" style={{ marginBottom: 18, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: error ? "#b91c1c" : "#475569", fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: error ? "#dc2626" : "#16a34a", display: "inline-block" }} />
          {error ? "Server connection / operation issue" : loading ? "Connecting to staff server..." : saving ? "Saving changes..." : "Connected · automatic refresh every 5 seconds"}
        </div>
        <div style={{ color: "#64748b", fontSize: 12 }}>Last server update: <strong>{updatedLabel}</strong></div>
      </div>

      {error && <div role="alert" style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>{error}<button type="button" onClick={() => loadStaff(true)} style={{ marginLeft: 10, border: "1px solid #fecaca", background: "#fff", borderRadius: 7, padding: "5px 9px", cursor: "pointer" }}>Retry</button></div>}
      {notice && <div role="status" style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "#eff6ff", color: "#1d4ed8", fontSize: 13 }}>{notice}</div>}

      <div className="stats-grid">
        <StatCard title="Staff registered" value={summary.total.toLocaleString()} change="Roster" changeLabel="listed personnel" icon={Users} tone="blue" />
        <StatCard title="On duty" value={summary.on_duty.toLocaleString()} change="Current status" changeLabel="marked on duty" icon={CheckCircle2} tone="teal" />
        <StatCard title="Available" value={summary.available.toLocaleString()} change="Roster status" changeLabel="marked available" icon={Activity} tone="purple" />
        <StatCard title="On leave" value={summary.on_leave.toLocaleString()} change="Roster status" changeLabel="marked on leave" icon={CalendarDays} tone="orange" />
      </div>

      {alerts.length > 0 && <section className="panel page-panel" style={{ marginBottom: 18 }}><SectionHeading title="Staffing alerts" subtitle="Checks based on the roster entries recorded in this application" /><div style={{ display: "grid", gap: 9, marginTop: 14 }}>{alerts.map((alert, index) => <div key={`${alert.title}-${index}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, borderRadius: 11, background: "#fffaf2", border: "1px solid #fed7aa" }}><AlertTriangle size={18} color="#c2410c" /><div><strong style={{ display: "block", fontSize: 13, color: "#9a3412" }}>{alert.title}</strong><span style={{ fontSize: 12, color: "#64748b" }}>{alert.description}</span></div></div>)}</div></section>}

      <section className="panel page-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <SectionHeading title="Staff roster" subtitle="Manage personnel, departments, shifts, and current roster status" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" className="secondary-button" disabled={saving} onClick={resetDemo}>Reset demo</button><button type="button" className="primary-button" disabled={saving} onClick={() => { setShowForm((value) => !value); setError(""); setNotice(""); }}>{showForm ? "Cancel" : "+ Add staff"}</button></div>
        </div>

        {showForm && <form onSubmit={addStaff} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 12, padding: 16, marginBottom: 18, border: "1px solid #e5eaf2", borderRadius: 14, background: "#f8fbff" }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Staff member name" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={capacityInputStyle}><option>Medical Officer</option><option>Doctor</option><option>Staff Nurse</option><option>Paramedic</option><option>Technician</option><option>Support Staff</option><option>Administrator</option><option>Other</option></select></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Department<select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={capacityInputStyle}><option>Emergency</option><option>ICU</option><option>General Ward</option><option>Laboratory</option><option>Pharmacy</option><option>Ambulance</option><option>Administration</option><option>Other</option></select></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Shift<select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} style={capacityInputStyle}><option>Morning</option><option>Evening</option><option>Night</option><option>Rotational</option></select></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={capacityInputStyle}><option>Available</option><option>On Duty</option><option>On Leave</option><option>Off Duty</option></select></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Phone (optional)<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Contact number" style={capacityInputStyle} /></label>
          <div style={{ display: "flex", alignItems: "end" }}><button type="submit" className="primary-button" disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save staff member"}</button></div>
        </form>}

        <div className="table-toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
          <div className="table-search"><Search size={16} /><input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, role, department..." /></div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ ...capacityInputStyle, width: "auto", minWidth: 140 }}><option>All</option><option>On Duty</option><option>Available</option><option>On Leave</option><option>Off Duty</option></select>
          <span className="demo-tag">{demoData ? "DEMO ROSTER" : "SERVER RECORDS"}</span>
        </div>

        {loading && staff.length === 0 ? <p style={{ padding: 20, color: "#64748b" }}>Loading staff roster...</p> : <div className="responsive-table"><table><thead><tr><th>STAFF MEMBER</th><th>ROLE</th><th>DEPARTMENT</th><th>SHIFT</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
          {filteredStaff.map((person) => <tr key={person.id}>
            <td><strong>{person.name}</strong><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>ID {person.id}{person.phone ? ` · ${person.phone}` : ""}</div></td>
            <td>{person.role}</td><td>{person.department}</td><td><select aria-label={`${person.name} shift`} value={person.shift} disabled={saving} onChange={(e) => updateStaff(person.id, "shift", e.target.value)} style={{ ...capacityInputStyle, minWidth: 105 }}><option>Morning</option><option>Evening</option><option>Night</option><option>Rotational</option></select></td>
            <td><select aria-label={`${person.name} status`} value={person.status} disabled={saving} onChange={(e) => updateStaff(person.id, "status", e.target.value)} style={{ ...capacityInputStyle, minWidth: 115 }}><option>On Duty</option><option>Available</option><option>On Leave</option><option>Off Duty</option></select></td>
            <td><button type="button" disabled={saving} onClick={() => removeStaff(person)} style={{ border: "1px solid #fee2e2", background: "#fff7f7", color: "#b91c1c", borderRadius: 8, padding: "7px 10px", cursor: saving ? "not-allowed" : "pointer", fontSize: 12 }}>Remove</button></td>
          </tr>)}
          {filteredStaff.length === 0 && <tr><td colSpan="6" className="table-empty">{staff.length ? "No matching staff records found." : "No staff records. Select Add staff to create one."}</td></tr>}
        </tbody></table></div>}
      </section>
    </>
  );
}



function MedicineInventoryPage() {
  const API_URL = "http://localhost:5000/api/medicines";
  const emptyForm = { name: "", category: "Emergency Medicines", quantity: "", unit: "units", minimum_stock: "", expiry_date: "" };

  const [medicines, setMedicines] = useState([]);
  const [summary, setSummary] = useState({ total_items: 0, total_quantity: 0, low_stock: 0, out_of_stock: 0 });
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [demoData, setDemoData] = useState(true);

  const loadMedicines = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : `Medicine API returned HTTP ${response.status}`);
      setMedicines(Array.isArray(data.medicines) ? data.medicines : []);
      setSummary(data.summary || { total_items: 0, total_quantity: 0, low_stock: 0, out_of_stock: 0 });
      setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      setUpdatedAt(data.updated_at || null);
      setDemoData(Boolean(data.demo_data));
      setError("");
    } catch {
      setError("Cannot connect to the medicine inventory server. Check that the backend is running and CORS allows your frontend port.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines(true);
    const timer = window.setInterval(() => loadMedicines(false), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const updatedLabel = updatedAt ? new Date(updatedAt).toLocaleString() : "Not yet synced";
  const filteredMedicines = medicines.filter((item) =>
    [item.name, item.category, item.unit].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    && (categoryFilter === "All" || item.category === categoryFilter)
  );
  const categories = ["All", ...new Set(medicines.map((item) => item.category))];

  const addMedicine = async (event) => {
    event.preventDefault();
    const quantity = Number(form.quantity);
    const minimum_stock = Number(form.minimum_stock);
    if (!form.name.trim() || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(minimum_stock) || minimum_stock < 0 || !form.unit.trim()) {
      setError("Enter a medicine name, valid non-negative whole-number quantities, and a unit.");
      return;
    }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), quantity, minimum_stock, unit: form.unit.trim(), expiry_date: form.expiry_date }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not add medicine.");
      setForm(emptyForm); setShowForm(false); setNotice("Medicine added to the server inventory.");
      await loadMedicines(false);
    } catch (requestError) {
      setError(requestError.message || "Could not add medicine.");
    } finally { setSaving(false); }
  };

  const updateMedicine = async (id, field, value) => {
    const numeric = field === "quantity" || field === "minimum_stock";
    const nextValue = numeric ? Number(value) : value;
    if (numeric && (!Number.isInteger(nextValue) || nextValue < 0)) {
      setError("Quantity and minimum stock must be non-negative whole numbers.");
      await loadMedicines(false);
      return;
    }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: nextValue }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not update medicine.");
      setNotice("Medicine inventory updated on the server.");
      await loadMedicines(false);
    } catch (requestError) {
      setError(requestError.message || "Could not update medicine.");
      await loadMedicines(false);
    } finally { setSaving(false); }
  };

  const removeMedicine = async (item) => {
    if (!window.confirm(`Remove "${item.name}" from the medicine inventory?`)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/${item.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not remove medicine.");
      setNotice("Medicine removed from the server inventory.");
      await loadMedicines(false);
    } catch (requestError) {
      setError(requestError.message || "Could not remove medicine.");
    } finally { setSaving(false); }
  };

  const resetDemo = async () => {
    if (!window.confirm("Restore the five illustrative medicine records? Current inventory entries will be replaced.")) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`${API_URL}/reset`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not reset demo inventory.");
      setNotice("Illustrative medicine inventory restored.");
      await loadMedicines(false);
    } catch (requestError) {
      setError(requestError.message || "Could not reset demo inventory.");
    } finally { setSaving(false); }
  };

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon teal"><Package size={28} /></div>
        <div><span className="eyebrow">HOSPITAL OPERATIONS</span><h2>Medicine inventory</h2><p>Track medicine stock, minimum levels, and expiry dates for hospital preparedness.</p></div>
      </div>

      <div className="chart-note" style={{ marginBottom: 18 }}>
        <div className="note-icon"><ShieldCheck size={16} /></div>
        <p><strong>{demoData ? "Illustrative demo inventory:" : "Hospital medicine register:"}</strong> {demoData ? "These are example quantities, not verified hospital stock. Verify all clinical inventory details before operational use." : "Changes are saved by the backend and shared with clients using the same server."} Inventory refreshes every five seconds and is not connected to pharmacy or hospital inventory software.</p>
      </div>

      <div className="panel page-panel" style={{ marginBottom: 18, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: error ? "#b91c1c" : "#475569", fontSize: 12 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: error ? "#dc2626" : "#16a34a", display: "inline-block" }} />{error ? "Server connection / operation issue" : loading ? "Connecting to medicine server..." : saving ? "Saving changes..." : "Connected · automatic refresh every 5 seconds"}</div>
        <div style={{ color: "#64748b", fontSize: 12 }}>Last server update: <strong>{updatedLabel}</strong></div>
      </div>

      {error && <div role="alert" style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>{error}<button type="button" onClick={() => loadMedicines(true)} style={{ marginLeft: 10, border: "1px solid #fecaca", background: "#fff", borderRadius: 7, padding: "5px 9px", cursor: "pointer" }}>Retry</button></div>}
      {notice && <div role="status" style={{ padding: 12, marginBottom: 14, borderRadius: 10, background: "#eff6ff", color: "#1d4ed8", fontSize: 13 }}>{notice}</div>}

      <div className="stats-grid">
        <StatCard title="Medicine types" value={summary.total_items.toLocaleString()} change="Inventory register" changeLabel="listed items" icon={Package} tone="blue" />
        <StatCard title="Total stock units" value={summary.total_quantity.toLocaleString()} change="Calculated" changeLabel="sum of listed quantities" icon={Activity} tone="teal" />
        <StatCard title="Low stock" value={summary.low_stock.toLocaleString()} change="Replenishment" changeLabel="at or below minimum" icon={AlertTriangle} tone="orange" />
        <StatCard title="Out of stock" value={summary.out_of_stock.toLocaleString()} change="Critical" changeLabel="zero quantity" icon={Siren} tone="purple" />
      </div>

      {alerts.length > 0 && <section className="panel page-panel" style={{ marginBottom: 18 }}><SectionHeading title="Inventory alerts" subtitle="Stock and expiry checks from the saved inventory records" /><div style={{ display: "grid", gap: 9, marginTop: 14 }}>{alerts.map((alert) => <div key={alert.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 12, borderRadius: 11, background: alert.level === "Critical" ? "#fff7f7" : "#fffaf2", border: `1px solid ${alert.level === "Critical" ? "#fecaca" : "#fed7aa"}` }}><AlertTriangle size={18} color={alert.level === "Critical" ? "#dc2626" : "#c2410c"} /><div><strong style={{ display: "block", fontSize: 13, color: alert.level === "Critical" ? "#991b1b" : "#9a3412" }}>{alert.level}: {alert.title}</strong><span style={{ fontSize: 12, color: "#64748b" }}>Verify stock, expiry, and replenishment requirements through the hospital's approved procedures.</span></div></div>)}</div></section>}

      <section className="panel page-panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <SectionHeading title="Medicine register" subtitle="Manage stock counts, minimum stock levels, and expiry dates" />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" className="secondary-button" disabled={saving} onClick={resetDemo}>Reset demo</button><button type="button" className="primary-button" disabled={saving} onClick={() => { setShowForm((value) => !value); setError(""); setNotice(""); }}>{showForm ? "Cancel" : "+ Add medicine"}</button></div>
        </div>

        {showForm && <form onSubmit={addMedicine} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 12, padding: 16, marginBottom: 18, border: "1px solid #e5eaf2", borderRadius: 14, background: "#f8fbff" }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Medicine name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Medicine / supply name" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={capacityInputStyle}><option>Emergency Medicines</option><option>Rehydration</option><option>IV Fluids</option><option>Medical Supplies</option><option>Cooling & First Aid</option><option>Other</option></select></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Quantity<input required type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Current stock" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Unit<input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="tablets, bottles, sachets" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Minimum stock<input required type="number" min="0" step="1" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} placeholder="Reorder threshold" style={capacityInputStyle} /></label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#526078" }}>Expiry date (optional)<input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} style={capacityInputStyle} /></label>
          <div style={{ display: "flex", alignItems: "end" }}><button type="submit" className="primary-button" disabled={saving} style={{ width: "100%" }}>{saving ? "Saving..." : "Save medicine"}</button></div>
        </form>}

        <div className="table-toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
          <div className="table-search"><Search size={16} /><input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search medicines, categories..." /></div>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} style={{ ...capacityInputStyle, width: "auto", minWidth: 155 }}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
          <span className="demo-tag">{demoData ? "DEMO RECORDS" : "SERVER RECORDS"}</span>
        </div>

        {loading && medicines.length === 0 ? <p style={{ padding: 20, color: "#64748b" }}>Loading medicine inventory...</p> : <div className="responsive-table"><table><thead><tr><th>MEDICINE / ITEM</th><th>CATEGORY</th><th>QUANTITY</th><th>MINIMUM STOCK</th><th>EXPIRY DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
          {filteredMedicines.map((item) => {
            const quantity = Number(item.quantity || 0);
            const minimum = Number(item.minimum_stock || 0);
            const critical = quantity === 0;
            const low = !critical && quantity <= minimum;
            const expiry = item.expiry_date ? new Date(`${item.expiry_date}T00:00:00`) : null;
            const expired = expiry && expiry < new Date(new Date().toDateString());
            const expiringSoon = expiry && !expired && (expiry - new Date()) / 86400000 <= 30;
            const status = expired ? "Expired" : critical ? "Out of stock" : low ? "Low stock" : expiringSoon ? "Expiring soon" : "In stock";
            const statusColor = expired || critical ? ["#fee2e2", "#991b1b"] : low || expiringSoon ? ["#ffedd5", "#9a3412"] : ["#dcfce7", "#166534"];
            return <tr key={item.id}>
              <td><strong>{item.name}</strong><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>ID {item.id}</div></td>
              <td>{item.category}</td>
              <td><input aria-label={`${item.name} quantity`} type="number" min="0" step="1" defaultValue={quantity} key={`${item.id}-quantity-${quantity}`} onBlur={(e) => { if (Number(e.target.value) !== quantity) updateMedicine(item.id, "quantity", e.target.value); }} style={{ ...capacityInputStyle, maxWidth: 100 }} /> <span style={{ fontSize: 11, color: "#64748b" }}>{item.unit}</span></td>
              <td><input aria-label={`${item.name} minimum stock`} type="number" min="0" step="1" defaultValue={minimum} key={`${item.id}-minimum-${minimum}`} onBlur={(e) => { if (Number(e.target.value) !== minimum) updateMedicine(item.id, "minimum_stock", e.target.value); }} style={{ ...capacityInputStyle, maxWidth: 100 }} /></td>
              <td><input aria-label={`${item.name} expiry date`} type="date" defaultValue={item.expiry_date || ""} key={`${item.id}-expiry-${item.expiry_date || ""}`} onBlur={(e) => { if (e.target.value !== (item.expiry_date || "")) updateMedicine(item.id, "expiry_date", e.target.value); }} style={{ ...capacityInputStyle, minWidth: 140 }} /></td>
              <td><span className="table-status" style={{ background: statusColor[0], color: statusColor[1] }}>{status}</span></td>
              <td><button type="button" disabled={saving} onClick={() => removeMedicine(item)} style={{ border: "1px solid #fee2e2", background: "#fff7f7", color: "#b91c1c", borderRadius: 8, padding: "7px 10px", cursor: saving ? "not-allowed" : "pointer", fontSize: 12 }}>Remove</button></td>
            </tr>;
          })}
          {filteredMedicines.length === 0 && <tr><td colSpan="7" className="table-empty">{medicines.length ? "No matching medicine records found." : "No medicines configured. Select Add medicine to create one."}</td></tr>}
        </tbody></table></div>}
      </section>
    </>
  );
}


function GenericModulePage({ activePage }) {
  const module = moduleDescriptions[activePage] || moduleDescriptions.Settings;
  const Icon = module.icon;

  const [searchTerm, setSearchTerm] = useState("");

  const moduleRows = {
    "Resource Management": [
      ["Oxygen supplies", "Demo inventory", "Review required"],
      ["Cooling equipment", "Demo inventory", "Review required"],
      ["Hydration supplies", "Demo inventory", "Review required"],
      ["Emergency equipment", "Demo inventory", "Review required"],
    ],
    "Staff Management": [
      ["Emergency department", "Demo staffing", "Schedule review"],
      ["Intensive care unit", "Demo staffing", "Schedule review"],
      ["General medicine", "Demo staffing", "Schedule review"],
      ["Support personnel", "Demo staffing", "Schedule review"],
    ],
    "Medicine Inventory": [
      ["Oral rehydration supplies", "Demo inventory", "Check stock"],
      ["IV fluid supplies", "Demo inventory", "Check stock"],
      ["Basic emergency medicines", "Demo inventory", "Check stock"],
      ["Cooling and first-aid supplies", "Demo inventory", "Check stock"],
    ],
    "Ambulance Management": [
      ["Ambulance A", "Demo vehicle", "Availability unverified"],
      ["Ambulance B", "Demo vehicle", "Availability unverified"],
      ["Ambulance C", "Demo vehicle", "Availability unverified"],
      ["Emergency transport", "Demo service", "Availability unverified"],
    ],
    "User Management": [
      ["Hospital administrator", "Demo role", "Example account"],
      ["Medical officer", "Demo role", "Example account"],
      ["Operations manager", "Demo role", "Example account"],
      ["Read-only viewer", "Demo role", "Example account"],
    ],
    Settings: [
      ["Dashboard preferences", "Local interface", "Available"],
      ["Notification settings", "Demo configuration", "Not connected"],
      ["Hospital profile", "Example profile", "Not configured"],
      ["Data source configuration", "No source connected", "Setup required"],
    ],
  };

  const rows = (moduleRows[activePage] || moduleRows["Resource Management"]).filter((row) =>
    row.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="module-hero">
        <div className="module-hero-icon blue">
          <Icon size={28} />
        </div>

        <div>
          <span className="eyebrow">HOSPITAL OPERATIONS</span>
          <h2>{module.title}</h2>
          <p>{module.subtitle}</p>
        </div>
      </div>

      <div className="module-notice">
        <div className="note-icon"><ShieldCheck size={17} /></div>
        <p>
          This module currently uses placeholder information. Live hospital
          records, role permissions, and database integration have not been
          configured yet.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard title="Module status" value="Demo" change="Interface ready" changeLabel="backend pending" icon={Activity} tone="blue" />
        <StatCard title="Data connection" value="Offline" change="Not connected" changeLabel="database integration pending" icon={ShieldCheck} tone="orange" />
        <StatCard title="Last update" value="Manual" change="Demo mode" changeLabel="no live synchronization" icon={Clock3} tone="purple" />
        <StatCard title="Readiness" value="Review" change="Setup required" changeLabel="verify operational information" icon={CheckCircle2} tone="teal" />
      </div>

      <section className="panel page-panel">
        <SectionHeading
          title={`${module.title} overview`}
          subtitle="Example records for the dashboard interface"
        />

        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search example records..."
            />
          </div>

          <span className="demo-tag">DEMO RECORDS</span>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>NAME / CATEGORY</th>
                <th>INFORMATION</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  <td><strong>{row[0]}</strong></td>
                  <td>{row[1]}</td>
                  <td><span className="table-status">{row[2]}</span></td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan="3" className="table-empty">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const [activePage, setActivePageState] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);

  function setActivePage(page) {
    setActivePageState(page);
    setMobileSidebarOpen(false);
    setSearchOpen(false);
    setGlobalSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function dismissAlert(id) {
    setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert.id !== id));
  }

  const searchItems = [
    "Dashboard",
    ...Object.keys(moduleDescriptions),
  ];

  const filteredSearchItems = searchItems.filter((item) =>
    item.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const pageSubtitle =
    activePage === "Dashboard"
      ? "Your hospital preparedness command centre"
      : moduleDescriptions[activePage]?.subtitle || "Hospital intelligence workspace";

  function renderPage() {
    if (activePage === "Dashboard") {
      return (
        <Dashboard
          setActivePage={setActivePage}
          alerts={alerts}
          dismissAlert={dismissAlert}
        />
      );
    }

    if (activePage === "Heatwave Monitor") {
      return <HeatwavePage />;
    }

    if (activePage === "Demand Forecast") {
      return <ForecastPage />;
    }

    if (activePage === "Bed & ICU Capacity") {
      return <CapacityPage />;
    }

    if (activePage === "Resource Management") {
      return <ResourceManagementPage />;
    }

    if (activePage === "Staff Management") {
      return <StaffManagementPage />;
    }

    if (activePage === "Medicine Inventory") {
      return <MedicineInventoryPage />;
    }

    if (activePage === "Risk & Alerts") {
      return <AlertsPage alerts={alerts} dismissAlert={dismissAlert} />;
    }

    if (activePage === "Analytics & Reports") {
      return <AnalyticsPage />;
    }

    return <GenericModulePage activePage={activePage} />;
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {mobileSidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="brand-area">
          <div className="brand-logo">
            <HeartPulse size={25} strokeWidth={2.2} />
            <span className="brand-logo-pulse" />
          </div>

          <div className="brand-copy">
            <h1>HeatCare<span>AI</span></h1>
            <p>Hospital Intelligence</p>
          </div>

          <button
            className="collapse-button"
            aria-label="Collapse sidebar"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="hospital-switcher">
          <div className="hospital-avatar">HC</div>

          <div className="hospital-copy">
            <strong>City General Hospital</strong>
            <span>Hospital workspace</span>
          </div>

          <ChevronDown size={15} />
        </div>

        <div className="sidebar-scroll">
          <div className="nav-group">
            <span className="nav-group-title">MAIN MENU</span>

            <button
              className={`nav-item ${activePage === "Dashboard" ? "active" : ""}`}
              onClick={() => setActivePage("Dashboard")}
              title="Dashboard"
            >
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
              <span className="nav-active-indicator" />
            </button>
          </div>

          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <span className="nav-group-title">{group.title}</span>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    className={`nav-item ${activePage === item.label ? "active" : ""}`}
                    key={item.label}
                    onClick={() => setActivePage(item.label)}
                    title={item.label}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>

                    {item.badge && alerts.length > 0 && (
                      <span className="nav-badge">{alerts.length}</span>
                    )}

                    {activePage === item.label && (
                      <span className="nav-active-indicator" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          <div className="nav-group">
            <span className="nav-group-title">PREFERENCES</span>

            {[
              { label: "User Management", icon: Users },
              { label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  className={`nav-item ${activePage === item.label ? "active" : ""}`}
                  onClick={() => setActivePage(item.label)}
                  title={item.label}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                  {activePage === item.label && <span className="nav-active-indicator" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-help-card">
            <div className="help-icon">
              <MessageSquare size={17} />
            </div>

            <strong>Need assistance?</strong>
            <p>Explore the project workspace and its available modules.</p>

            <button onClick={() => setActivePage("Settings")}>
              Open settings
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="profile-card">
            <div className="profile-avatar">HA</div>

            <div className="profile-copy">
              <strong>Hospital Admin</strong>
              <span>Demo administrator</span>
            </div>

            <button
              className="icon-button"
              aria-label="Open user settings"
              onClick={() => setActivePage("User Management")}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button icon-button"
              aria-label="Open navigation"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={14} />
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className={`global-search ${searchOpen ? "search-focused" : ""}`}>
              <Search size={17} />

              <input
                value={globalSearch}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setGlobalSearch(event.target.value);
                  setSearchOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && filteredSearchItems.length > 0) {
                    setActivePage(filteredSearchItems[0]);
                  }

                  if (event.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search anything..."
                aria-label="Search dashboard modules"
              />

              <kbd>⌘ K</kbd>

              {searchOpen && (
                <div className="search-dropdown">
                  <div className="search-dropdown-heading">
                    NAVIGATION
                  </div>

                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.slice(0, 7).map((item) => (
                      <button
                        key={item}
                        onClick={() => setActivePage(item)}
                      >
                        <Search size={15} />
                        <span>{item}</span>
                        <ArrowRight size={14} />
                      </button>
                    ))
                  ) : (
                    <div className="search-no-results">
                      No matching modules found.
                    </div>
                  )}

                  <button
                    className="search-close"
                    onClick={() => {
                      setSearchOpen(false);
                      setGlobalSearch("");
                    }}
                  >
                    Close search
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="topbar-divider" />

            <button
              className={`topbar-icon-button ${notificationsOpen ? "notification-active" : ""}`}
              aria-label="View notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={19} />
              {alerts.length > 0 && <span className="notification-indicator" />}
            </button>

            {notificationsOpen && (
              <div className="notification-popover">
                <div className="notification-popover-header">
                  <strong>Notifications</strong>
                  <span>{alerts.length} active</span>
                </div>

                {alerts.length === 0 ? (
                  <p className="notification-empty">No active demo alerts.</p>
                ) : (
                  alerts.slice(0, 4).map((alert) => (
                    <button
                      className="notification-entry"
                      key={alert.id}
                      onClick={() => {
                        setActivePage("Risk & Alerts");
                        setNotificationsOpen(false);
                      }}
                    >
                      <span className={`notification-entry-dot ${alert.color}`} />
                      <span>
                        <strong>{alert.title}</strong>
                        <small>{alert.time}</small>
                      </span>
                    </button>
                  ))
                )}

                <button
                  className="notification-view-all"
                  onClick={() => {
                    setActivePage("Risk & Alerts");
                    setNotificationsOpen(false);
                  }}
                >
                  Open alert centre
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            <div className="topbar-divider" />

            <button
              className="topbar-profile"
              onClick={() => setActivePage("User Management")}
            >
              <div className="topbar-avatar">HA</div>
              <div className="topbar-profile-copy">
                <strong>Hospital Admin</strong>
                <span>Administrator</span>
              </div>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <div
          className="content-scroll"
          onClick={() => {
            if (searchOpen) setSearchOpen(false);
          }}
        >
          <div className="page-header">
            <div>
              <div className="page-eyebrow">
                <span className="page-eyebrow-dot" />
                HEATCARE AI WORKSPACE
              </div>

              <h1>{activePage === "Dashboard" ? "Dashboard overview" : activePage}</h1>
              <p>{pageSubtitle}</p>
            </div>

            <div className="page-header-actions">
              <div className="date-display">
                <CalendarDays size={16} />
                <span>{new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}</span>
              </div>

              <button
                className="header-action-button"
                onClick={() => setActivePage("Analytics & Reports")}
              >
                <FileBarChart size={16} />
                <span>Reports</span>
              </button>
            </div>
          </div>

          <div className="demo-mode-banner">
            <div className="demo-mode-icon">
              <ShieldCheck size={17} />
            </div>

            <div>
              <strong>Prototype mode</strong>
              <span>
Weather is connected through Open-Meteo. Hospital records and a trained
                emergency-demand prediction model are still not connected.
              </span>
            </div>

            <button
              aria-label="Open settings"
              onClick={() => setActivePage("Settings")}
            >
              Configure
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="page-content">
            {renderPage()}
          </div>

          <footer className="app-footer">
            <div className="footer-brand">
              <HeartPulse size={15} />
              <span>HeatCare AI</span>
            </div>

            <span>Hospital preparedness intelligence · Prototype</span>

            <div className="footer-status">
              <span className="footer-status-dot" />
              Frontend running
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}