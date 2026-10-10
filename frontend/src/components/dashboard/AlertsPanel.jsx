import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Flame,
  Info,
  ShieldAlert,
  Siren,
  Users,
  X,
} from "lucide-react";

const DEMO_ALERTS = [
  {
    id: 1,
    title: "High Heat Exposure Expected",
    description:
      "Forecast temperatures may increase emergency visits over the next 48 hours.",
    severity: "critical",
    category: "Heatwave",
    time: "12 minutes ago",
    status: "active",
    icon: Flame,
    recommendation:
      "Review emergency department readiness and confirm heat-related treatment supplies.",
  },
  {
    id: 2,
    title: "Emergency Bed Capacity Warning",
    description:
      "Illustrative demand is approaching the configured emergency bed capacity.",
    severity: "high",
    category: "Capacity",
    time: "35 minutes ago",
    status: "active",
    icon: ShieldAlert,
    recommendation:
      "Review bed availability and prepare an escalation plan if demand increases.",
  },
  {
    id: 3,
    title: "Staff Readiness Review",
    description:
      "Check staffing availability for the forecast high-demand period.",
    severity: "medium",
    category: "Staff",
    time: "1 hour ago",
    status: "active",
    icon: Users,
    recommendation:
      "Review shift coverage and identify staff who could be available if required.",
  },
  {
    id: 4,
    title: "Heat Preparedness Checklist",
    description:
      "Review cooling facilities, drinking water, and heat-related medical supplies.",
    severity: "low",
    category: "Preparedness",
    time: "2 hours ago",
    status: "active",
    icon: Info,
    recommendation:
      "Complete the hospital's routine heat preparedness checklist.",
  },
];

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    color: "#dc2626",
    background: "#fef2f2",
    border: "#fecaca",
    icon: Siren,
  },
  high: {
    label: "High",
    color: "#ea580c",
    background: "#fff7ed",
    border: "#fed7aa",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    color: "#ca8a04",
    background: "#fefce8",
    border: "#fde68a",
    icon: Clock,
  },
  low: {
    label: "Low",
    color: "#0284c7",
    background: "#f0f9ff",
    border: "#bae6fd",
    icon: Info,
  },
};

export default function AlertsPanel({
  alerts = DEMO_ALERTS,
  title = "Hospital Alerts",
  subtitle = "Monitor potential risks and recommended actions.",
  loading = false,
  onViewAll,
  onAlertClick,
  onDismiss,
  onAcknowledge,
  maxItems = 4,
  className = "",
}) {
  const [filter, setFilter] = useState("all");
  const [dismissedIds, setDismissedIds] = useState([]);
  const [acknowledgedIds, setAcknowledgedIds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const visibleAlerts = useMemo(() => {
    const safeAlerts = Array.isArray(alerts) ? alerts : [];

    return safeAlerts
      .filter((alert) => !dismissedIds.includes(alert.id))
      .filter((alert) => {
        if (filter === "all") return true;

        if (filter === "unread") {
          return (
            !acknowledgedIds.includes(alert.id) &&
            alert.status !== "acknowledged"
          );
        }

        return alert.severity === filter;
      })
      .slice(0, maxItems);
  }, [alerts, dismissedIds, acknowledgedIds, filter, maxItems]);

  const activeAlerts = (Array.isArray(alerts) ? alerts : []).filter(
    (alert) =>
      !dismissedIds.includes(alert.id) &&
      !acknowledgedIds.includes(alert.id) &&
      alert.status !== "acknowledged"
  );

  const criticalCount = activeAlerts.filter(
    (alert) => alert.severity === "critical"
  ).length;

  const highCount = activeAlerts.filter(
    (alert) => alert.severity === "high"
  ).length;

  const acknowledgeAlert = (alert) => {
    setAcknowledgedIds((previous) =>
      previous.includes(alert.id) ? previous : [...previous, alert.id]
    );

    if (onAcknowledge) {
      onAcknowledge(alert);
    }
  };

  const dismissAlert = (alert) => {
    setDismissedIds((previous) =>
      previous.includes(alert.id) ? previous : [...previous, alert.id]
    );

    if (onDismiss) {
      onDismiss(alert);
    }
  };

  const acknowledgeAll = () => {
    const ids = visibleAlerts.map((alert) => alert.id);

    setAcknowledgedIds((previous) => [
      ...new Set([...previous, ...ids]),
    ]);

    if (onAcknowledge) {
      visibleAlerts.forEach((alert) => onAcknowledge(alert));
    }
  };

  return (
    <section className={`hc-alerts-panel ${className}`}>
      <style>{`
        .hc-alerts-panel {
          width: 100%;
          min-width: 0;
          padding: 22px;
          border: 1px solid #e8edf5;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 8px 30px rgba(20, 38, 75, 0.045);
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #172033;
          box-sizing: border-box;
        }

        .hc-alerts-panel *,
        .hc-alerts-panel *::before,
        .hc-alerts-panel *::after {
          box-sizing: border-box;
        }

        .hc-alerts-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 20px;
        }

        .hc-alerts-heading {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          min-width: 0;
        }

        .hc-alerts-heading-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px;
          color: #2563eb;
          background: #eff6ff;
        }

        .hc-alerts-title {
          margin: 0;
          font-size: 17px;
          font-weight: 750;
          line-height: 1.4;
          letter-spacing: -0.35px;
          color: #172033;
        }

        .hc-alerts-subtitle {
          margin: 5px 0 0;
          font-size: 12px;
          line-height: 1.6;
          color: #7b8497;
        }

        .hc-alerts-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          margin-left: 7px;
          padding: 0 7px;
          border-radius: 8px;
          color: #dc2626;
          background: #fef2f2;
          font-size: 11px;
          font-weight: 800;
          vertical-align: middle;
        }

        .hc-alerts-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .hc-alerts-icon-button {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e7ebf2;
          border-radius: 10px;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }

        .hc-alerts-icon-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .hc-alerts-filters {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 17px;
        }

        .hc-alerts-filter {
          padding: 7px 11px;
          border: 1px solid #e7ebf2;
          border-radius: 9px;
          background: #fff;
          color: #68748a;
          font-size: 11px;
          font-weight: 650;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hc-alerts-filter:hover {
          border-color: #bfdbfe;
          color: #2563eb;
        }

        .hc-alerts-filter.active {
          border-color: #2563eb;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .hc-alerts-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 18px;
        }

        .hc-alerts-summary-card {
          padding: 12px;
          border: 1px solid #edf0f5;
          border-radius: 13px;
          background: #fafbfe;
          min-width: 0;
        }

        .hc-alerts-summary-label {
          margin-bottom: 7px;
          color: #8992a4;
          font-size: 10px;
          font-weight: 650;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hc-alerts-summary-value {
          color: #172033;
          font-size: 23px;
          font-weight: 800;
          line-height: 1;
        }

        .hc-alerts-summary-value.critical {
          color: #dc2626;
        }

        .hc-alerts-summary-value.high {
          color: #ea580c;
        }

        .hc-alerts-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .hc-alert-item {
          position: relative;
          padding: 15px;
          border: 1px solid #edf0f5;
          border-radius: 15px;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }

        .hc-alert-item:hover {
          border-color: #dbe5f3;
          box-shadow: 0 5px 16px rgba(20, 38, 75, 0.045);
          transform: translateY(-1px);
        }

        .hc-alert-item.acknowledged {
          background: #fbfcfe;
        }

        .hc-alert-item-top {
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }

        .hc-alert-severity-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 12px;
        }

        .hc-alert-main {
          flex: 1;
          min-width: 0;
        }

        .hc-alert-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .hc-alert-title {
          margin: 1px 0 0;
          color: #263247;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .hc-alert-description {
          margin: 6px 0 0;
          color: #7b8497;
          font-size: 11px;
          line-height: 1.7;
        }

        .hc-alert-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          padding: 5px 7px;
          border: 1px solid;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.35px;
        }

        .hc-alert-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 12px;
          padding-top: 11px;
          border-top: 1px solid #f0f2f6;
        }

        .hc-alert-meta-left {
          display: flex;
          align-items: center;
          gap: 11px;
          flex-wrap: wrap;
        }

        .hc-alert-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #8992a4;
          font-size: 10px;
          font-weight: 550;
        }

        .hc-alert-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hc-alert-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 8px;
          border: 1px solid #e7ebf2;
          border-radius: 8px;
          background: #fff;
          color: #64748b;
          font-size: 10px;
          font-weight: 650;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hc-alert-action:hover {
          background: #f8fafc;
          color: #2563eb;
          border-color: #bfdbfe;
        }

        .hc-alert-action.primary {
          background: #eff6ff;
          color: #2563eb;
          border-color: #dbeafe;
        }

        .hc-alert-action.primary:hover {
          background: #dbeafe;
        }

        .hc-alert-action:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .hc-alert-recommendation {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid #dbeafe;
          border-radius: 11px;
          background: #f8fbff;
        }

        .hc-alert-recommendation-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 5px;
          color: #1d4ed8;
          font-size: 10px;
          font-weight: 800;
        }

        .hc-alert-recommendation-text {
          margin: 0;
          color: #53647e;
          font-size: 11px;
          line-height: 1.7;
        }

        .hc-alert-acknowledged-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #059669;
          font-size: 10px;
          font-weight: 700;
        }

        .hc-alert-empty {
          padding: 30px 15px;
          text-align: center;
          border: 1px dashed #dce3ee;
          border-radius: 15px;
          background: #fafcff;
        }

        .hc-alert-empty-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          border-radius: 14px;
          background: #ecfdf5;
          color: #059669;
        }

        .hc-alert-empty-title {
          margin: 0;
          color: #263247;
          font-size: 13px;
          font-weight: 750;
        }

        .hc-alert-empty-text {
          margin: 6px 0 0;
          color: #8992a4;
          font-size: 11px;
          line-height: 1.6;
        }

        .hc-alerts-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 17px;
          padding-top: 15px;
          border-top: 1px solid #edf0f5;
        }

        .hc-alerts-demo-note {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          max-width: 280px;
          color: #8992a4;
          font-size: 10px;
          line-height: 1.6;
        }

        .hc-alerts-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 0 7px 8px;
          border: 0;
          background: transparent;
          color: #2563eb;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
          white-space: nowrap;
        }

        .hc-alerts-view-all:hover {
          color: #1d4ed8;
        }

        .hc-alert-skeleton {
          height: 94px;
          margin-bottom: 10px;
          border-radius: 14px;
          background: linear-gradient(
            90deg,
            #f1f5f9 25%,
            #e8eef6 50%,
            #f1f5f9 75%
          );
          background-size: 200% 100%;
          animation: hc-alert-shimmer 1.4s infinite;
        }

        @keyframes hc-alert-shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }

        @media (max-width: 640px) {
          .hc-alerts-panel {
            padding: 15px;
            border-radius: 17px;
          }

          .hc-alerts-header {
            gap: 8px;
          }

          .hc-alerts-heading {
            gap: 9px;
          }

          .hc-alerts-heading-icon {
            width: 36px;
            height: 36px;
          }

          .hc-alerts-title {
            font-size: 15px;
          }

          .hc-alerts-subtitle {
            font-size: 11px;
          }

          .hc-alerts-header-actions {
            gap: 5px;
          }

          .hc-alerts-summary {
            gap: 7px;
          }

          .hc-alerts-summary-card {
            padding: 10px;
          }

          .hc-alerts-summary-value {
            font-size: 20px;
          }

          .hc-alert-item {
            padding: 12px;
          }

          .hc-alert-title-row {
            flex-direction: column;
            gap: 7px;
          }

          .hc-alert-badge {
            align-self: flex-start;
          }

          .hc-alert-meta {
            align-items: flex-start;
          }

          .hc-alert-actions {
            width: 100%;
          }

          .hc-alert-action {
            flex: 1;
          }

          .hc-alerts-footer {
            align-items: flex-start;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-alerts-panel *,
          .hc-alerts-panel *::before,
          .hc-alerts-panel *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div className="hc-alerts-header">
        <div className="hc-alerts-heading">
          <div className="hc-alerts-heading-icon">
            <Bell size={20} />
          </div>

          <div>
            <h2 className="hc-alerts-title">
              {title}
              {activeAlerts.length > 0 && (
                <span className="hc-alerts-count">
                  {activeAlerts.length}
                </span>
              )}
            </h2>

            <p className="hc-alerts-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="hc-alerts-header-actions">
          <button
            type="button"
            className="hc-alerts-icon-button"
            onClick={acknowledgeAll}
            title="Acknowledge visible alerts"
            aria-label="Acknowledge visible alerts"
          >
            <CheckCheck size={16} />
          </button>

          <button
            type="button"
            className="hc-alerts-icon-button"
            onClick={() => {
              if (onViewAll) onViewAll();
            }}
            title="View all alerts"
            aria-label="View all alerts"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="hc-alerts-summary">
        <div className="hc-alerts-summary-card">
          <div className="hc-alerts-summary-label">Active Alerts</div>
          <div className="hc-alerts-summary-value">
            {activeAlerts.length}
          </div>
        </div>

        <div className="hc-alerts-summary-card">
          <div className="hc-alerts-summary-label">Critical</div>
          <div className="hc-alerts-summary-value critical">
            {criticalCount}
          </div>
        </div>

        <div className="hc-alerts-summary-card">
          <div className="hc-alerts-summary-label">High Priority</div>
          <div className="hc-alerts-summary-value high">
            {highCount}
          </div>
        </div>
      </div>

      <div className="hc-alerts-filters">
        {[
          { value: "all", label: "All Alerts" },
          { value: "unread", label: "Unacknowledged" },
          { value: "critical", label: "Critical" },
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
          { value: "low", label: "Low" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            className={`hc-alerts-filter ${
              filter === item.value ? "active" : ""
            }`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div aria-label="Loading alerts">
          <div className="hc-alert-skeleton" />
          <div className="hc-alert-skeleton" />
          <div className="hc-alert-skeleton" />
        </div>
      ) : visibleAlerts.length === 0 ? (
        <div className="hc-alert-empty">
          <div className="hc-alert-empty-icon">
            <Check size={22} />
          </div>

          <h3 className="hc-alert-empty-title">
            No alerts in this view
          </h3>

          <p className="hc-alert-empty-text">
            There are no alerts matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="hc-alerts-list">
          {visibleAlerts.map((alert) => {
            const severity =
              SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.medium;

            const AlertIcon = alert.icon || severity.icon;

            const isAcknowledged =
              acknowledgedIds.includes(alert.id) ||
              alert.status === "acknowledged";

            const isExpanded = expandedId === alert.id;

            return (
              <article
                key={alert.id}
                className={`hc-alert-item ${
                  isAcknowledged ? "acknowledged" : ""
                }`}
              >
                <div className="hc-alert-item-top">
                  <div
                    className="hc-alert-severity-icon"
                    style={{
                      background: severity.background,
                      color: severity.color,
                    }}
                  >
                    <AlertIcon size={18} />
                  </div>

                  <div className="hc-alert-main">
                    <div className="hc-alert-title-row">
                      <h3 className="hc-alert-title">
                        {alert.title || "Hospital alert"}
                      </h3>

                      <span
                        className="hc-alert-badge"
                        style={{
                          color: severity.color,
                          background: severity.background,
                          borderColor: severity.border,
                        }}
                      >
                        {severity.label}
                      </span>
                    </div>

                    <p className="hc-alert-description">
                      {alert.description || "No additional details available."}
                    </p>

                    <div className="hc-alert-meta">
                      <div className="hc-alert-meta-left">
                        <span className="hc-alert-meta-item">
                          <Clock size={12} />
                          {alert.time || "Time unavailable"}
                        </span>

                        <span className="hc-alert-meta-item">
                          <Bell size={12} />
                          {alert.category || "General"}
                        </span>

                        {isAcknowledged && (
                          <span className="hc-alert-acknowledged-label">
                            <Check size={12} />
                            Acknowledged
                          </span>
                        )}
                      </div>

                      <div className="hc-alert-actions">
                        <button
                          type="button"
                          className="hc-alert-action"
                          onClick={() => {
                            setExpandedId(isExpanded ? null : alert.id);

                            if (onAlertClick) {
                              onAlertClick(alert);
                            }
                          }}
                        >
                          {isExpanded ? "Hide details" : "Details"}
                          <ChevronRight
                            size={12}
                            style={{
                              transform: isExpanded
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          />
                        </button>

                        {!isAcknowledged && (
                          <button
                            type="button"
                            className="hc-alert-action primary"
                            onClick={() => acknowledgeAlert(alert)}
                          >
                            <Check size={12} />
                            Acknowledge
                          </button>
                        )}

                        <button
                          type="button"
                          className="hc-alert-action"
                          onClick={() => dismissAlert(alert)}
                          title="Dismiss alert from this view"
                          aria-label={`Dismiss ${alert.title || "alert"}`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="hc-alert-recommendation">
                        <div className="hc-alert-recommendation-heading">
                          <ShieldAlert size={14} />
                          Suggested preparedness action
                        </div>

                        <p className="hc-alert-recommendation-text">
                          {alert.recommendation ||
                            "Review this alert with the appropriate hospital team and follow established hospital protocols."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="hc-alerts-footer">
        <div className="hc-alerts-demo-note">
          <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            Demo alerts are illustrative. They are not live hospital
            notifications or validated clinical recommendations.
          </span>
        </div>

        <button
          type="button"
          className="hc-alerts-view-all"
          onClick={() => {
            if (onViewAll) onViewAll();
          }}
        >
          View all alerts
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}