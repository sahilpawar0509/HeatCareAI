import React from "react";
import {
  BedDouble,
  HeartPulse,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const DEFAULT_CAPACITY = [
  {
    id: "general",
    label: "General Beds",
    icon: BedDouble,
    total: 200,
    occupied: 142,
    color: "#3b82f6",
  },
  {
    id: "icu",
    label: "ICU Beds",
    icon: HeartPulse,
    total: 40,
    occupied: 32,
    color: "#8b5cf6",
  },
  {
    id: "emergency",
    label: "Emergency Beds",
    icon: Activity,
    total: 30,
    occupied: 24,
    color: "#f59e0b",
  },
  {
    id: "staff",
    label: "Available Staff",
    icon: Users,
    total: 100,
    occupied: 78,
    color: "#10b981",
    isStaff: true,
  },
];

function getStatus(percentage) {
  if (percentage >= 90) {
    return {
      label: "Critical",
      className: "capacity-status-critical",
    };
  }

  if (percentage >= 75) {
    return {
      label: "High",
      className: "capacity-status-high",
    };
  }

  if (percentage >= 50) {
    return {
      label: "Moderate",
      className: "capacity-status-moderate",
    };
  }

  return {
    label: "Available",
    className: "capacity-status-available",
  };
}

export default function CapacityPanel({
  data,
  title = "Hospital Capacity",
  subtitle = "Current bed occupancy and resource availability",
  loading = false,
  onViewAll,
  className = "",
}) {
  const capacityData =
    Array.isArray(data) && data.length > 0
      ? data
      : DEFAULT_CAPACITY;

  const normalizedData = capacityData.map((item, index) => {
    const total = Math.max(0, Number(item.total) || 0);
    const occupied = Math.max(0, Number(item.occupied) || 0);
    const available = Math.max(0, total - occupied);

    const percentage =
      total > 0
        ? Math.min(100, Math.round((occupied / total) * 100))
        : 0;

    return {
      id: item.id || item.label || `resource-${index}`,
      label: item.label || item.name || "Resource",
      icon: item.icon || Activity,
      total,
      occupied,
      available,
      percentage,
      color: item.color || "#3b82f6",
      isStaff: Boolean(item.isStaff),
      status: getStatus(percentage),
    };
  });

  const criticalCount = normalizedData.filter(
    (item) => item.percentage >= 90
  ).length;

  const availableBeds = normalizedData
    .filter((item) => !item.isStaff)
    .reduce((sum, item) => sum + item.available, 0);

  return (
    <section className={`capacity-panel ${className}`}>
      <div className="capacity-panel-header">
        <div className="capacity-panel-heading">
          <div className="capacity-panel-heading-icon">
            <Activity size={19} />
          </div>

          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </div>

        {onViewAll && (
          <button
            type="button"
            className="capacity-view-all"
            onClick={onViewAll}
          >
            View details
            <ArrowUpRight size={15} />
          </button>
        )}
      </div>

      <div className="capacity-overview">
        <div className="capacity-overview-item">
          <span className="capacity-overview-label">
            Available beds
          </span>

          <strong>
            {loading ? "—" : availableBeds}
          </strong>

          <span className="capacity-overview-description">
            Across displayed bed categories
          </span>
        </div>

        <div className="capacity-overview-status">
          {criticalCount > 0 ? (
            <>
              <AlertTriangle size={16} />
              <span>
                {criticalCount} resource category
                {criticalCount > 1 ? "ies" : ""} at critical occupancy
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>No displayed category at critical occupancy</span>
            </>
          )}
        </div>
      </div>

      <div className="capacity-resource-list">
        {normalizedData.map((resource) => {
          const Icon = resource.icon;

          return (
            <div
              className="capacity-resource"
              key={resource.id}
              aria-busy={loading}
            >
              <div className="capacity-resource-top">
                <div className="capacity-resource-info">
                  <div
                    className="capacity-resource-icon"
                    style={{
                      color: resource.color,
                      background: `${resource.color}14`,
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="capacity-resource-title">
                    <h4>{resource.label}</h4>

                    <p>
                      {resource.isStaff
                        ? "Staff availability"
                        : "Bed occupancy"}
                    </p>
                  </div>
                </div>

                <span
                  className={`capacity-status ${resource.status.className}`}
                >
                  {resource.status.label}
                </span>
              </div>

              <div className="capacity-resource-numbers">
                <strong>
                  {loading ? "—" : resource.occupied}
                  <span>
                    {" "}
                    / {loading ? "—" : resource.total}
                  </span>
                </strong>

                <span className="capacity-percentage">
                  {loading ? "—" : `${resource.percentage}%`}
                </span>
              </div>

              <div
                className="capacity-progress-track"
                role="progressbar"
                aria-label={`${resource.label} occupancy`}
                aria-valuenow={resource.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="capacity-progress-fill"
                  style={{
                    width: loading
                      ? "0%"
                      : `${resource.percentage}%`,
                    background: resource.color,
                  }}
                />
              </div>

              <div className="capacity-resource-footer">
                <span>
                  {loading
                    ? "Loading..."
                    : resource.isStaff
                      ? `${resource.available} staff slots remaining`
                      : `${resource.available} beds available`}
                </span>

                {resource.percentage >= 90 ? (
                  <span className="capacity-footer-critical">
                    <AlertTriangle size={12} />
                    Review required
                  </span>
                ) : resource.percentage >= 75 ? (
                  <span className="capacity-footer-warning">
                    <Clock size={12} />
                    Monitor closely
                  </span>
                ) : (
                  <span className="capacity-footer-normal">
                    <CheckCircle2 size={12} />
                    Within threshold
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="capacity-panel-footer">
        <div className="capacity-footer-note">
          <Clock size={14} />

          <span>
            Capacity values must be synchronized with hospital records.
          </span>
        </div>

        {onViewAll && (
          <button
            type="button"
            className="capacity-footer-button"
            onClick={onViewAll}
          >
            Manage capacity
            <ArrowDownRight size={15} />
          </button>
        )}
      </div>

      <div className="capacity-demo-disclaimer">
        Demonstration values only — not live hospital occupancy.
      </div>

      <style>{`
        .capacity-panel {
          min-width: 0;
          padding: 22px;
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid #e8edf4;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(15, 23, 42, 0.025);
        }

        .capacity-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 20px;
        }

        .capacity-panel-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .capacity-panel-heading-icon {
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

        .capacity-panel-heading h3 {
          margin: 0;
          color: #0f172a;
          font-size: 15px;
          font-weight: 750;
          letter-spacing: -0.3px;
        }

        .capacity-panel-heading p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 11px;
          line-height: 1.6;
        }

        .capacity-view-all {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 0 7px 8px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 650;
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .capacity-view-all:hover {
          color: #1d4ed8;
        }

        .capacity-overview {
          padding: 16px;
          margin-bottom: 20px;
          background: linear-gradient(120deg, #f8fbff, #f8fafc);
          border: 1px solid #edf2f7;
          border-radius: 14px;
        }

        .capacity-overview-item {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
        }

        .capacity-overview-label {
          width: 100%;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
        }

        .capacity-overview-item strong {
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .capacity-overview-description {
          color: #94a3b8;
          font-size: 10px;
        }

        .capacity-overview-status {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 12px;
          padding-top: 12px;
          color: #047857;
          font-size: 10px;
          line-height: 1.6;
          border-top: 1px solid #e8edf4;
        }

        .capacity-overview-status svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .capacity-resource-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .capacity-resource {
          min-width: 0;
        }

        .capacity-resource-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 13px;
        }

        .capacity-resource-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .capacity-resource-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .capacity-resource-title {
          min-width: 0;
        }

        .capacity-resource-title h4 {
          margin: 0;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }

        .capacity-resource-title p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .capacity-status {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          font-size: 9px;
          font-weight: 700;
          border: 1px solid transparent;
          border-radius: 999px;
          white-space: nowrap;
        }

        .capacity-status-available {
          color: #047857;
          background: #ecfdf5;
          border-color: #d1fae5;
        }

        .capacity-status-moderate {
          color: #1d4ed8;
          background: #eff6ff;
          border-color: #dbeafe;
        }

        .capacity-status-high {
          color: #b45309;
          background: #fffbeb;
          border-color: #fef3c7;
        }

        .capacity-status-critical {
          color: #b91c1c;
          background: #fef2f2;
          border-color: #fee2e2;
        }

        .capacity-resource-numbers {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 9px;
        }

        .capacity-resource-numbers > strong {
          color: #0f172a;
          font-size: 14px;
          font-weight: 750;
        }

        .capacity-resource-numbers > strong span {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 500;
        }

        .capacity-percentage {
          color: #475569;
          font-size: 11px;
          font-weight: 700;
        }

        .capacity-progress-track {
          width: 100%;
          height: 7px;
          overflow: hidden;
          background: #edf2f7;
          border-radius: 999px;
        }

        .capacity-progress-fill {
          height: 100%;
          border-radius: inherit;
          transition: width 0.5s ease;
        }

        .capacity-resource-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 9px;
          color: #94a3b8;
          font-size: 10px;
        }

        .capacity-footer-critical,
        .capacity-footer-warning,
        .capacity-footer-normal {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          font-weight: 600;
        }

        .capacity-footer-critical {
          color: #dc2626;
        }

        .capacity-footer-warning {
          color: #b45309;
        }

        .capacity-footer-normal {
          color: #059669;
        }

        .capacity-panel-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 16px;
          margin-top: 22px;
          border-top: 1px solid #edf2f7;
        }

        .capacity-footer-note {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          flex: 1;
          min-width: 0;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.6;
        }

        .capacity-footer-note svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .capacity-footer-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 0 7px 8px;
          color: #2563eb;
          font-size: 10px;
          font-weight: 700;
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .capacity-demo-disclaimer {
          padding-top: 11px;
          margin-top: 12px;
          color: #94a3b8;
          font-size: 9px;
          line-height: 1.6;
          border-top: 1px dashed #e2e8f0;
        }

        @media (max-width: 768px) {
          .capacity-panel {
            padding: 17px;
            border-radius: 17px;
          }

          .capacity-panel-header {
            gap: 10px;
          }

          .capacity-panel-heading {
            gap: 9px;
          }

          .capacity-panel-heading-icon {
            width: 37px;
            height: 37px;
          }

          .capacity-panel-heading h3 {
            font-size: 14px;
          }

          .capacity-overview {
            padding: 14px;
          }

          .capacity-resource-list {
            gap: 20px;
          }
        }

        @media (max-width: 420px) {
          .capacity-panel {
            padding: 14px;
          }

          .capacity-panel-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .capacity-view-all {
            padding-left: 0;
          }

          .capacity-resource-title h4 {
            font-size: 11px;
          }

          .capacity-status {
            padding: 4px 6px;
            font-size: 8px;
          }

          .capacity-resource-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .capacity-panel-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .capacity-progress-fill {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}