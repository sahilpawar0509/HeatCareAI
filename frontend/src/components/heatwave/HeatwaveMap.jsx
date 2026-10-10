import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function FitMapToMarkers({ detections }) {
  const map = useMap();

  useEffect(() => {
    if (!detections.length) return;

    const bounds = L.latLngBounds(
      detections.map((item) => [item.latitude, item.longitude])
    );

    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 10,
    });
  }, [detections, map]);

  return null;
}

function formatTime(value) {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }

  const time = String(value).padStart(4, "0");
  return `${time.slice(0, 2)}:${time.slice(2, 4)} UTC`;
}

function formatNumber(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "Unavailable";
}

export default function HeatwaveMap() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDetections = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/firms");

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      const sourceRecords = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.sources)
          ? result.sources.flatMap((source) =>
              Array.isArray(source.data) ? source.data : []
            )
          : [];

      const validRecords = sourceRecords
        .map((item) => ({
          ...item,
          latitude: Number(item.latitude ?? item.lat),
          longitude: Number(item.longitude ?? item.lon),
          frp: Number(item.frp) || 0,
          brightness: Number(item.brightness) || 0,
        }))
        .filter(
          (item) =>
            Number.isFinite(item.latitude) &&
            Number.isFinite(item.longitude) &&
            item.latitude >= -90 &&
            item.latitude <= 90 &&
            item.longitude >= -180 &&
            item.longitude <= 180
        );

      setDetections(validRecords);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        "Unable to load NASA FIRMS data. Check that the HeatCare backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDetections();
    const interval = setInterval(loadDetections, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadDetections]);

  const highFrpCount = detections.filter((item) => item.frp >= 8).length;

  return (
    <section className="firms-map-card" aria-labelledby="firms-map-title">
      <style>{`
        .firms-map-card {
          width: 100%;
          min-width: 0;
          overflow: hidden;
          color: #334155;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(226, 232, 240, 0.95);
          border-radius: 22px;
          box-shadow: 0 12px 34px rgba(15, 23, 42, 0.055);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .firms-map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 22px 24px;
          border-bottom: 1px solid #edf1f6;
        }
        .firms-map-heading-group { min-width: 0; }
        .firms-map-eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 7px;
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .11em;
          text-transform: uppercase;
        }
        .firms-map-title {
          margin: 0;
          color: #14233b;
          font-size: clamp(16px, 1.6vw, 19px);
          font-weight: 780;
          letter-spacing: -.035em;
          line-height: 1.35;
        }
        .firms-map-subtitle {
          margin: 6px 0 0;
          color: #718096;
          font-size: 12px;
          line-height: 1.55;
        }
        .firms-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          padding: 8px 11px;
          border: 1px solid #cceedd;
          border-radius: 999px;
          background: #f0fdf6;
          color: #167647;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .035em;
        }
        .firms-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a765;
          box-shadow: 0 0 0 3px rgba(22, 167, 101, .13);
        }
        .firms-live-dot.is-loading {
          background: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, .14);
        }
        .firms-map-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          padding: 17px 20px;
          background: linear-gradient(180deg, #fbfdff 0%, #f8faff 100%);
          border-bottom: 1px solid #edf1f6;
        }
        .firms-map-stat {
          min-width: 0;
          padding: 15px 16px;
          background: rgba(255, 255, 255, .9);
          border: 1px solid #e7edf5;
          border-radius: 15px;
          transition: border-color .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .firms-map-stat:hover {
          transform: translateY(-2px);
          border-color: #cbdcf8;
          box-shadow: 0 8px 20px rgba(37, 99, 235, .06);
        }
        .firms-map-stat-label {
          margin-bottom: 9px;
          color: #7b8798;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .055em;
          text-transform: uppercase;
        }
        .firms-map-stat-value {
          color: #172b46;
          font-size: clamp(21px, 2.2vw, 27px);
          font-weight: 800;
          letter-spacing: -.045em;
          line-height: 1.1;
          overflow-wrap: anywhere;
        }
        .firms-map-stat-note {
          margin-top: 7px;
          color: #8995a7;
          font-size: 10px;
          line-height: 1.45;
        }
        .firms-map-container {
          position: relative;
          width: 100%;
          height: 440px;
          background: #eaf1f5;
        }
        .firms-map-container .leaflet-container {
          width: 100%;
          height: 100%;
          font-family: inherit;
          z-index: 1;
        }
        .firms-map-container .leaflet-control-zoom a {
          color: #1e293b;
          border-color: #e2e8f0;
        }
        .firms-map-container .leaflet-control-zoom {
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, .9) !important;
          border-radius: 11px !important;
          box-shadow: 0 4px 14px rgba(15, 23, 42, .12) !important;
        }
        .firms-map-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 14px 20px;
          color: #718096;
          font-size: 11px;
          border-top: 1px solid #edf1f6;
        }
        .firms-map-footer-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .firms-map-footer-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${error ? "#dc2626" : "#16a765"};
          flex-shrink: 0;
        }
        .firms-refresh-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 8px 13px;
          border: 1px solid #dbe5f2;
          border-radius: 11px;
          background: #fff;
          color: #24436c;
          font-size: 11px;
          font-weight: 750;
          box-shadow: 0 2px 5px rgba(15, 23, 42, .025);
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
          cursor: pointer;
        }
        .firms-refresh-button:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #bfd3f7;
          transform: translateY(-1px);
        }
        .firms-refresh-button:disabled { cursor: wait; opacity: .65; }
        .firms-map-error {
          margin: 14px 20px;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 12px;
          background: #fff5f5;
          color: #b42318;
          font-size: 12px;
          line-height: 1.5;
        }
        .firms-map-empty {
          position: absolute;
          z-index: 500;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          max-width: calc(100% - 32px);
          padding: 9px 13px;
          border: 1px solid rgba(226, 232, 240, .95);
          border-radius: 11px;
          background: rgba(255, 255, 255, .94);
          color: #64748b;
          font-size: 11px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(15, 23, 42, .09);
        }
        .firms-map-disclaimer {
          padding: 12px 20px;
          border-top: 1px solid #edf1f6;
          background: #fffcf4;
          color: #7b6740;
          font-size: 10px;
          line-height: 1.7;
        }
        .firms-map-disclaimer strong { color: #6d572e; }
        .firms-popup-title {
          margin-bottom: 9px;
          color: #172b46;
          font-size: 13px;
          font-weight: 800;
        }
        .firms-popup-row {
          margin: 5px 0;
          color: #53647a;
          font-size: 12px;
          line-height: 1.5;
        }
        .firms-popup-row strong { color: #334155; }
        @media (max-width: 700px) {
          .firms-map-header { padding: 17px; }
          .firms-map-stats { gap: 8px; padding: 12px; }
          .firms-map-stat { padding: 12px 10px; border-radius: 12px; }
          .firms-map-stat-label { font-size: 9px; }
          .firms-map-stat-note { font-size: 9px; }
          .firms-map-container { height: 360px; }
          .firms-map-footer { padding: 12px 15px; }
          .firms-map-disclaimer { padding: 12px 15px; }
        }
        @media (max-width: 480px) {
          .firms-map-stats { grid-template-columns: 1fr; }
          .firms-map-stat { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 5px 10px; }
          .firms-map-stat-label { margin: 0; }
          .firms-map-stat-value { grid-column: 2; grid-row: 1 / span 2; text-align: right; }
          .firms-map-stat-note { margin: 0; }
          .firms-map-container { height: 330px; }
          .firms-map-footer { align-items: flex-start; }
        }
        @media (prefers-reduced-motion: reduce) {
          .firms-map-stat, .firms-refresh-button { transition: none; }
        }
      `}</style>

      <header className="firms-map-header">
        <div className="firms-map-heading-group">
          <p className="firms-map-eyebrow">Geospatial intelligence</p>
          <h2 id="firms-map-title" className="firms-map-title">
            Satellite Fire Detection Map
          </h2>
          <p className="firms-map-subtitle">
            Maharashtra, India · NASA FIRMS VIIRS NOAA-21
          </p>
        </div>

        <span className="firms-live-badge" aria-live="polite">
          <span className={`firms-live-dot ${loading ? "is-loading" : ""}`} />
          {loading ? "UPDATING DATA" : error ? "CONNECTION ISSUE" : "API CONNECTED"}
        </span>
      </header>

      <div className="firms-map-stats">
        <div className="firms-map-stat">
          <div className="firms-map-stat-label">Satellite detections</div>
          <div className="firms-map-stat-value">
            {loading && !lastUpdated ? "—" : detections.length.toLocaleString()}
          </div>
          <div className="firms-map-stat-note">Records returned by the latest API request</div>
        </div>

        <div className="firms-map-stat">
          <div className="firms-map-stat-label">High FRP detections</div>
          <div className="firms-map-stat-value">{highFrpCount.toLocaleString()}</div>
          <div className="firms-map-stat-note">FRP ≥ 8 MW · screening threshold only</div>
        </div>

        <div className="firms-map-stat">
          <div className="firms-map-stat-label">Data source</div>
          <div className="firms-map-stat-value" style={{ fontSize: 17 }}>
            NASA FIRMS
          </div>
          <div className="firms-map-stat-note">Satellite observations</div>
        </div>
      </div>

      {error && <div className="firms-map-error" role="alert">{error}</div>}

      <div className="firms-map-container">
        <MapContainer
          center={[18.8, 73.7]}
          zoom={8}
          scrollWheelZoom
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          <FitMapToMarkers detections={detections} />

          {detections.map((item, index) => (
            <CircleMarker
              key={`${item.latitude}-${item.longitude}-${item.acq_date || ""}-${index}`}
              center={[item.latitude, item.longitude]}
              radius={Math.min(7 + item.frp / 3, 17)}
              pathOptions={{
                color: item.frp >= 8 ? "#b91c1c" : "#d97706",
                fillColor: item.frp >= 8 ? "#ef4444" : "#f59e0b",
                fillOpacity: 0.78,
                weight: 2,
              }}
            >
              <Popup>
                <div className="firms-popup-title">NASA FIRMS Detection</div>
                <div className="firms-popup-row"><strong>Latitude:</strong> {formatNumber(item.latitude, 5)}</div>
                <div className="firms-popup-row"><strong>Longitude:</strong> {formatNumber(item.longitude, 5)}</div>
                <div className="firms-popup-row"><strong>Brightness:</strong> {item.brightness || "Unavailable"}</div>
                <div className="firms-popup-row"><strong>Fire Radiative Power:</strong> {item.frp} MW</div>
                <div className="firms-popup-row"><strong>Confidence:</strong> {item.confidence || "Unavailable"}</div>
                <div className="firms-popup-row"><strong>Acquisition date:</strong> {item.acq_date || "Unavailable"}</div>
                <div className="firms-popup-row"><strong>Acquisition time:</strong> {formatTime(item.acq_time)}</div>
                <div className="firms-popup-row"><strong>Day/night:</strong> {item.daynight === "D" ? "Day" : item.daynight === "N" ? "Night" : "Unavailable"}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {!loading && !error && detections.length === 0 && (
          <div className="firms-map-empty">
            No valid detections were returned by the latest API request.
          </div>
        )}
      </div>

      <footer className="firms-map-footer">
        <span className="firms-map-footer-status">
          {lastUpdated
            ? `Last API refresh: ${lastUpdated.toLocaleTimeString()}`
            : loading
              ? "Connecting to NASA FIRMS…"
              : "Waiting for data"}
        </span>

        <button
          type="button"
          className="firms-refresh-button"
          onClick={loadDetections}
          disabled={loading}
        >
          <span aria-hidden="true">↻</span>
          {loading ? "Loading…" : "Refresh data"}
        </button>
      </footer>

      <div className="firms-map-disclaimer">
        <strong>Data interpretation:</strong> Markers represent satellite fire or
        thermal-anomaly detections, not confirmed fires or direct measurements of
        ambient temperature, heatwave severity, or hospital demand. The API
        refreshes every five minutes; NASA satellite data itself is not necessarily
        updated at that frequency.
      </div>
    </section>
  );
}
