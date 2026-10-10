import React from "react";
import {
  ArrowRight,
  Download,
  RefreshCw,
  CalendarDays,
  Filter,
  MoreHorizontal,
} from "lucide-react";

export default function SectionHeading({
  title,
  subtitle,
  description,
  badge,
  badgeType = "info",
  actionLabel,
  onAction,
  actionIcon: ActionIcon = ArrowRight,
  secondaryActionLabel,
  onSecondaryAction,
  showDate = false,
  dateLabel,
  showFilter = false,
  onFilter,
  showRefresh = false,
  onRefresh,
  loading = false,
  showDownload = false,
  onDownload,
  showMore = false,
  onMore,
  children,
  className = "",
}) {
  const supportingText = subtitle || description;

  return (
    <section
      className={[
        "section-heading",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="section-heading-main">
        <div className="section-heading-title-row">
          <h2 className="section-heading-title">
            {title}
          </h2>

          {badge && (
            <span
              className={[
                "section-heading-badge",
                `section-heading-badge-${badgeType}`,
              ].join(" ")}
            >
              <span className="section-heading-badge-dot" />
              {badge}
            </span>
          )}
        </div>

        {supportingText && (
          <p className="section-heading-description">
            {supportingText}
          </p>
        )}
      </div>

      <div className="section-heading-actions">
        {showDate && (
          <div className="section-heading-date">
            <CalendarDays size={15} />
            <span>
              {dateLabel ||
                new Intl.DateTimeFormat("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date())}
            </span>
          </div>
        )}

        {showFilter && (
          <button
            type="button"
            className="section-heading-button"
            onClick={onFilter}
            aria-label="Filter data"
          >
            <Filter size={15} />
            <span>Filter</span>
          </button>
        )}

        {showRefresh && (
          <button
            type="button"
            className="section-heading-icon-button"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Refresh data"
            title="Refresh data"
          >
            <RefreshCw
              size={15}
              className={loading ? "section-heading-spinning" : ""}
            />
          </button>
        )}

        {showDownload && (
          <button
            type="button"
            className="section-heading-button"
            onClick={onDownload}
          >
            <Download size={15} />
            <span>Export</span>
          </button>
        )}

        {secondaryActionLabel && (
          <button
            type="button"
            className="section-heading-button"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </button>
        )}

        {actionLabel && (
          <button
            type="button"
            className="section-heading-primary-button"
            onClick={onAction}
          >
            <span>{actionLabel}</span>
            <ActionIcon size={15} />
          </button>
        )}

        {showMore && (
          <button
            type="button"
            className="section-heading-icon-button"
            onClick={onMore}
            aria-label="More section options"
            title="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        )}

        {children}
      </div>

      <style>{`
        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
          margin-bottom: 18px;
        }

        .section-heading-main {
          flex: 1;
          min-width: 0;
        }

        .section-heading-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .section-heading-title {
          margin: 0;
          color: #0f172a;
          font-size: 16px;
          font-weight: 750;
          letter-spacing: -0.35px;
          line-height: 1.45;
        }

        .section-heading-description {
          margin: 6px 0 0;
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.7;
        }

        .section-heading-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          font-size: 10px;
          font-weight: 650;
          line-height: 1.4;
          border: 1px solid transparent;
          border-radius: 999px;
          white-space: nowrap;
        }

        .section-heading-badge-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          background: currentColor;
          border-radius: 50%;
        }

        .section-heading-badge-info {
          color: #1d4ed8;
          background: #eff6ff;
          border-color: #dbeafe;
        }

        .section-heading-badge-success {
          color: #047857;
          background: #ecfdf5;
          border-color: #d1fae5;
        }

        .section-heading-badge-warning {
          color: #b45309;
          background: #fffbeb;
          border-color: #fef3c7;
        }

        .section-heading-badge-danger {
          color: #b91c1c;
          background: #fef2f2;
          border-color: #fee2e2;
        }

        .section-heading-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 8px;
          flex-shrink: 0;
        }

        .section-heading-date {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 11px;
          color: #64748b;
          font-size: 11px;
          background: #ffffff;
          border: 1px solid #e8edf4;
          border-radius: 10px;
          white-space: nowrap;
        }

        .section-heading-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 8px 12px;
          color: #475569;
          font-size: 11px;
          font-weight: 600;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .section-heading-button:hover {
          color: #2563eb;
          background: #f8fbff;
          border-color: #bfdbfe;
        }

        .section-heading-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 36px;
          padding: 9px 13px;
          color: #ffffff;
          font-size: 11px;
          font-weight: 650;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          border: 1px solid #2563eb;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .section-heading-primary-button:hover {
          box-shadow: 0 7px 18px rgba(37, 99, 235, 0.2);
          transform: translateY(-1px);
        }

        .section-heading-icon-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .section-heading-icon-button:hover {
          color: #2563eb;
          background: #f8fbff;
          border-color: #bfdbfe;
        }

        .section-heading-icon-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .section-heading-spinning {
          animation: section-heading-spin 1s linear infinite;
        }

        @keyframes section-heading-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 13px;
          }

          .section-heading-actions {
            justify-content: flex-start;
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .section-heading-title {
            font-size: 15px;
          }

          .section-heading-description {
            font-size: 11px;
          }

          .section-heading-actions {
            gap: 6px;
          }

          .section-heading-button,
          .section-heading-primary-button {
            min-height: 34px;
            padding: 8px 10px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .section-heading-spinning {
            animation: none;
          }

          .section-heading-button,
          .section-heading-primary-button,
          .section-heading-icon-button {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}