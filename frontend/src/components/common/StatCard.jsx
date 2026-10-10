import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
} from "lucide-react";

const colorStyles = {
  blue: {
    iconBackground: "#eff6ff",
    iconColor: "#2563eb",
    accent: "#2563eb",
  },
  cyan: {
    iconBackground: "#ecfeff",
    iconColor: "#0891b2",
    accent: "#0891b2",
  },
  green: {
    iconBackground: "#ecfdf5",
    iconColor: "#059669",
    accent: "#059669",
  },
  orange: {
    iconBackground: "#fff7ed",
    iconColor: "#ea580c",
    accent: "#ea580c",
  },
  red: {
    iconBackground: "#fef2f2",
    iconColor: "#dc2626",
    accent: "#dc2626",
  },
  purple: {
    iconBackground: "#f5f3ff",
    iconColor: "#7c3aed",
    accent: "#7c3aed",
  },
};

export default function StatCard({
  title = "Total Events",
  value = "—",
  subtitle = "",
  icon: Icon = Activity,
  color = "blue",
  trend,
  trendLabel = "vs. previous period",
  trendDirection = "neutral",
  loading = false,
  footer,
  onClick,
  className = "",
}) {
  const selectedColor = colorStyles[color] || colorStyles.blue;

  const direction =
    trendDirection === "neutral" && typeof trend === "number"
      ? trend > 0
        ? "up"
        : trend < 0
          ? "down"
          : "neutral"
      : trendDirection;

  const TrendIcon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;

  const trendClass =
    direction === "up"
      ? "stat-trend-up"
      : direction === "down"
        ? "stat-trend-down"
        : "stat-trend-neutral";

  const formattedTrend =
    typeof trend === "number"
      ? `${Math.abs(trend)}%`
      : trend;

  return (
    <article
      className={[
        "stat-card",
        "stat-card-component",
        onClick ? "stat-card-clickable" : "",
        loading ? "stat-card-loading" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-busy={loading}
    >
      <div className="stat-card-top">
        <div className="stat-card-heading">
          <span className="stat-card-label">{title}</span>

          {subtitle && (
            <span className="stat-card-subtitle">
              {subtitle}
            </span>
          )}
        </div>

        <div
          className="stat-card-icon"
          style={{
            background: selectedColor.iconBackground,
            color: selectedColor.iconColor,
          }}
        >
          <Icon size={21} strokeWidth={1.9} />
        </div>
      </div>

      <div className="stat-card-main">
        {loading ? (
          <div className="stat-card-skeleton">
            <span />
          </div>
        ) : (
          <h3 className="stat-card-value">{value}</h3>
        )}
      </div>

      {(trend !== undefined || footer) && (
        <div className="stat-card-footer">
          {trend !== undefined && (
            <span className={`stat-trend ${trendClass}`}>
              <TrendIcon size={14} />
              <span>{formattedTrend}</span>
            </span>
          )}

          {trendLabel && trend !== undefined && (
            <span className="stat-trend-label">
              {trendLabel}
            </span>
          )}

          {footer && (
            <span className="stat-card-footer-text">
              {footer}
            </span>
          )}
        </div>
      )}

      <style>{`
        .stat-card-component {
          position: relative;
          min-width: 0;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid #e8edf4;
          border-radius: 18px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.025);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .stat-card-component::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: ${selectedColor.accent};
          opacity: 0.8;
        }

        .stat-card-component:hover {
          border-color: #dbeafe;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.055);
          transform: translateY(-2px);
        }

        .stat-card-clickable {
          cursor: pointer;
        }

        .stat-card-clickable:focus-visible {
          outline: 3px solid rgba(59, 130, 246, 0.35);
          outline-offset: 3px;
        }

        .stat-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .stat-card-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.5;
        }

        .stat-card-subtitle {
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.5;
        }

        .stat-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border: 1px solid rgba(226, 232, 240, 0.6);
          border-radius: 13px;
        }

        .stat-card-main {
          min-height: 34px;
        }

        .stat-card-value {
          margin: 0;
          color: #0f172a;
          font-size: clamp(25px, 2vw, 32px);
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }

        .stat-card-footer {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 14px;
          min-height: 18px;
        }

        .stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .stat-trend-up {
          color: #059669;
        }

        .stat-trend-down {
          color: #dc2626;
        }

        .stat-trend-neutral {
          color: #64748b;
        }

        .stat-trend-label {
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.5;
        }

        .stat-card-footer-text {
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        .stat-card-skeleton {
          width: 75%;
          height: 30px;
          overflow: hidden;
          background: #f1f5f9;
          border-radius: 7px;
        }

        .stat-card-skeleton span {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            #ffffff,
            transparent
          );
          animation: stat-card-shimmer 1.5s infinite;
        }

        .stat-card-loading {
          pointer-events: none;
        }

        @keyframes stat-card-shimmer {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(100%);
          }
        }

        @media (max-width: 768px) {
          .stat-card-component {
            padding: 16px;
          }

          .stat-card-top {
            gap: 8px;
            margin-bottom: 15px;
          }

          .stat-card-icon {
            width: 38px;
            height: 38px;
          }

          .stat-card-value {
            font-size: 25px;
          }

          .stat-card-footer {
            gap: 5px;
          }
        }

        @media (max-width: 380px) {
          .stat-card-component {
            padding: 13px;
          }

          .stat-card-label {
            font-size: 11px;
          }

          .stat-card-icon {
            width: 34px;
            height: 34px;
          }

          .stat-card-value {
            font-size: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .stat-card-component {
            transition: none;
          }

          .stat-card-skeleton span {
            animation: none;
          }
        }
      `}</style>
    </article>
  );
}