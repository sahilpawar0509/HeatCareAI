import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Command,
  X,
  UserRound,
  Settings,
  LogOut,
  ShieldCheck,
  ThermometerSun,
} from "lucide-react";

export default function Topbar({
  title = "Dashboard",
  subtitle = "Hospital heatwave intelligence and emergency demand monitoring",
  onMenuClick,
  onNavigate,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Heat Risk Advisory",
      description:
        "Review the latest heat risk conditions and hospital preparedness.",
      time: "Priority advisory",
      type: "warning",
    },
    {
      id: 2,
      title: "Capacity Review",
      description:
        "Check current bed and ICU availability before peak demand.",
      time: "Operational reminder",
      type: "info",
    },
    {
      id: 3,
      title: "Forecast Verification",
      description:
        "Compare forecast estimates with actual emergency attendance.",
      time: "Data quality reminder",
      type: "success",
    },
  ];

  const searchItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Heatwave Monitor", path: "/heatwave-monitor" },
    { label: "Demand Forecast", path: "/demand-forecast" },
    { label: "Bed & ICU Capacity", path: "/capacity" },
    { label: "Resource Management", path: "/resources" },
    { label: "Staff Management", path: "/staff" },
    { label: "Medicine Inventory", path: "/medicines" },
    { label: "Ambulance Management", path: "/ambulances" },
    { label: "Risk & Alerts", path: "/alerts" },
    { label: "Analytics & Reports", path: "/analytics" },
    { label: "User Management", path: "/users" },
    { label: "Settings", path: "/settings" },
  ];

  const filteredItems = searchItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateTo = (path, label) => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchQuery("");

    if (onNavigate) {
      onNavigate(path, label);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (filteredItems.length > 0) {
      navigateTo(
        filteredItems[0].path,
        filteredItems[0].label
      );
    }
  };

  const getCurrentDate = () => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

        <div className="topbar-heading">
          <div className="topbar-breadcrumb">
            <span>HeatCare AI</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {title}
            </span>
          </div>

          <h2>{title}</h2>

          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-date">
          <CalendarDays size={15} />
          <span>{getCurrentDate()}</span>
        </div>

        <div className="topbar-search-wrapper">
          <button
            type="button"
            className="topbar-icon-button topbar-search-button"
            onClick={() => {
              setSearchOpen((previous) => !previous);
              setNotificationsOpen(false);
              setProfileOpen(false);
            }}
            aria-label="Search pages"
            aria-expanded={searchOpen}
          >
            {searchOpen ? (
              <X size={18} />
            ) : (
              <Search size={18} />
            )}
          </button>

          {searchOpen && (
            <div className="topbar-popover topbar-search-popover">
              <form
                className="topbar-search-form"
                onSubmit={handleSearchSubmit}
              >
                <Search size={17} />

                <input
                  type="search"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  autoFocus
                  aria-label="Search dashboard pages"
                />

                <span className="search-shortcut">
                  <Command size={12} /> K
                </span>
              </form>

              <div className="topbar-search-results">
                <p className="popover-section-label">
                  NAVIGATION
                </p>

                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <button
                      type="button"
                      key={item.path}
                      className="topbar-search-result"
                      onClick={() =>
                        navigateTo(item.path, item.label)
                      }
                    >
                      <Search size={15} />
                      <span>{item.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="topbar-empty-result">
                    <Search size={22} />
                    <p>No matching pages found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="topbar-notification-wrapper">
          <button
            type="button"
            className="topbar-icon-button topbar-notification-button"
            onClick={() => {
              setNotificationsOpen((previous) => !previous);
              setSearchOpen(false);
              setProfileOpen(false);
            }}
            aria-label="View notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell size={18} />

            <span className="topbar-notification-indicator" />
          </button>

          {notificationsOpen && (
            <div className="topbar-popover topbar-notification-popover">
              <div className="topbar-popover-header">
                <div>
                  <h3>Notifications</h3>
                  <p>Hospital monitoring reminders</p>
                </div>

                <span className="notification-count">
                  {notifications.length}
                </span>
              </div>

              <div className="topbar-notification-list">
                {notifications.map((notification) => (
                  <div
                    className="topbar-notification-item"
                    key={notification.id}
                  >
                    <div
                      className={[
                        "notification-type-icon",
                        `notification-${notification.type}`,
                      ].join(" ")}
                    >
                      {notification.type === "warning" ? (
                        <ThermometerSun size={17} />
                      ) : notification.type === "success" ? (
                        <ShieldCheck size={17} />
                      ) : (
                        <Bell size={17} />
                      )}
                    </div>

                    <div className="topbar-notification-content">
                      <h4>{notification.title}</h4>

                      <p>{notification.description}</p>

                      <span>{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="topbar-popover-footer">
                <button
                  type="button"
                  onClick={() =>
                    navigateTo("/alerts", "Risk & Alerts")
                  }
                >
                  View Risk & Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="topbar-profile-wrapper">
          <button
            type="button"
            className="topbar-profile-button"
            onClick={() => {
              setProfileOpen((previous) => !previous);
              setSearchOpen(false);
              setNotificationsOpen(false);
            }}
            aria-label="Open administrator menu"
            aria-expanded={profileOpen}
          >
            <span className="topbar-profile-avatar">AD</span>

            <span className="topbar-profile-info">
              <strong>Administrator</strong>
              <small>Hospital Admin</small>
            </span>

            <ChevronDown size={15} />
          </button>

          {profileOpen && (
            <div className="topbar-popover topbar-profile-popover">
              <div className="profile-popover-header">
                <div className="topbar-profile-avatar profile-avatar-large">
                  AD
                </div>

                <div>
                  <h4>Administrator</h4>
                  <p>Hospital Administrator</p>
                </div>
              </div>

              <div className="profile-menu-divider" />

              <button
                type="button"
                className="profile-menu-item"
                onClick={() =>
                  navigateTo("/users", "User Management")
                }
              >
                <UserRound size={17} />
                <span>User Management</span>
              </button>

              <button
                type="button"
                className="profile-menu-item"
                onClick={() =>
                  navigateTo("/settings", "Settings")
                }
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>

              <div className="profile-menu-divider" />

              <div className="profile-menu-note">
                <ShieldCheck size={16} />
                <span>Prototype administrator interface</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {(searchOpen || notificationsOpen || profileOpen) && (
        <button
          type="button"
          className="topbar-dismiss-layer"
          aria-label="Close open menu"
          onClick={() => {
            setSearchOpen(false);
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
      )}

      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 200;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
          flex: 1;
        }

        .topbar-heading {
          min-width: 0;
        }

        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .breadcrumb-separator {
          color: #cbd5e1;
        }

        .breadcrumb-current {
          color: #64748b;
          font-weight: 600;
        }

        .topbar-heading h2 {
          margin: 0;
          color: #0f172a;
          font-size: 19px;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .topbar-heading p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .topbar-date {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 11px;
          color: #64748b;
          font-size: 11px;
          background: #f8fafc;
          border: 1px solid #e8edf4;
          border-radius: 10px;
          white-space: nowrap;
        }

        .topbar-search-wrapper,
        .topbar-notification-wrapper,
        .topbar-profile-wrapper {
          position: relative;
        }

        .topbar-icon-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 39px;
          height: 39px;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e8edf4;
          border-radius: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .topbar-icon-button:hover {
          color: #2563eb;
          background: #f8fbff;
          border-color: #bfdbfe;
        }

        .topbar-notification-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 7px;
          height: 7px;
          background: #ef4444;
          border: 1.5px solid #ffffff;
          border-radius: 50%;
        }

        .topbar-profile-button {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 4px 7px 4px 5px;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e8edf4;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .topbar-profile-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .topbar-profile-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 800;
          background: linear-gradient(135deg, #dbeafe, #cffafe);
          border: 1px solid #bfdbfe;
          border-radius: 10px;
        }

        .topbar-profile-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          min-width: 0;
        }

        .topbar-profile-info strong {
          color: #334155;
          font-size: 11px;
          font-weight: 700;
        }

        .topbar-profile-info small {
          color: #94a3b8;
          font-size: 10px;
        }

        .topbar-popover {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          z-index: 220;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 20px 55px rgba(15, 23, 42, 0.13);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          animation: topbar-popover-enter 0.16s ease both;
        }

        @keyframes topbar-popover-enter {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .topbar-search-popover {
          width: 320px;
        }

        .topbar-search-form {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px;
          color: #94a3b8;
          border-bottom: 1px solid #edf1f6;
        }

        .topbar-search-form input {
          width: 100%;
          min-width: 0;
          padding: 5px 0;
          color: #334155;
          font-size: 12px;
          background: transparent;
          border: none;
          outline: none;
        }

        .topbar-search-form input::placeholder {
          color: #94a3b8;
        }

        .search-shortcut {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 4px 6px;
          color: #94a3b8;
          font-size: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          white-space: nowrap;
        }

        .topbar-search-results {
          max-height: 340px;
          overflow-y: auto;
          padding: 10px;
        }

        .popover-section-label {
          padding: 0 8px;
          margin: 5px 0 8px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .topbar-search-result {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 9px;
          color: #64748b;
          font-size: 12px;
          text-align: left;
          background: transparent;
          border: none;
          border-radius: 9px;
          cursor: pointer;
        }

        .topbar-search-result:hover {
          color: #2563eb;
          background: #eff6ff;
        }

        .topbar-empty-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 25px 10px;
          color: #94a3b8;
        }

        .topbar-empty-result p {
          font-size: 12px;
        }

        .topbar-notification-popover {
          width: 350px;
        }

        .topbar-popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
          border-bottom: 1px solid #edf1f6;
        }

        .topbar-popover-header h3 {
          margin: 0;
          color: #0f172a;
          font-size: 14px;
          font-weight: 750;
        }

        .topbar-popover-header p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 11px;
        }

        .notification-count {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 800;
          background: #dbeafe;
          border-radius: 8px;
        }

        .topbar-notification-list {
          max-height: 360px;
          overflow-y: auto;
          padding: 5px 16px;
        }

        .topbar-notification-item {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 14px 0;
          border-bottom: 1px solid #edf1f6;
        }

        .topbar-notification-item:last-child {
          border-bottom: none;
        }

        .notification-type-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 10px;
        }

        .notification-warning {
          color: #b45309;
          background: #fef3c7;
        }

        .notification-info {
          color: #1d4ed8;
          background: #dbeafe;
        }

        .notification-success {
          color: #047857;
          background: #d1fae5;
        }

        .topbar-notification-content {
          flex: 1;
          min-width: 0;
        }

        .topbar-notification-content h4 {
          margin: 0;
          color: #1e293b;
          font-size: 12px;
          font-weight: 700;
        }

        .topbar-notification-content p {
          margin: 5px 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.6;
        }

        .topbar-notification-content span {
          color: #94a3b8;
          font-size: 10px;
        }

        .topbar-popover-footer {
          padding: 12px 16px;
          background: #f8fafc;
          border-top: 1px solid #edf1f6;
        }

        .topbar-popover-footer button {
          width: 100%;
          padding: 9px;
          color: #2563eb;
          font-size: 11px;
          font-weight: 700;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 9px;
          cursor: pointer;
        }

        .topbar-popover-footer button:hover {
          background: #dbeafe;
        }

        .topbar-profile-popover {
          width: 250px;
          padding: 10px;
        }

        .profile-popover-header {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 7px 14px;
        }

        .profile-avatar-large {
          width: 42px;
          height: 42px;
          border-radius: 12px;
        }

        .profile-popover-header h4 {
          margin: 0;
          color: #1e293b;
          font-size: 12px;
          font-weight: 750;
        }

        .profile-popover-header p {
          margin: 5px 0 0;
          color: #94a3b8;
          font-size: 10px;
        }

        .profile-menu-divider {
          height: 1px;
          margin: 5px 0;
          background: #edf1f6;
        }

        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 11px 9px;
          color: #64748b;
          font-size: 12px;
          text-align: left;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .profile-menu-item:hover {
          color: #2563eb;
          background: #eff6ff;
        }

        .profile-menu-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 7px 5px;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.5;
        }

        .topbar-dismiss-layer {
          position: fixed;
          inset: 0;
          z-index: 190;
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          cursor: default;
        }

        .topbar-popover {
          z-index: 220;
        }

        .topbar-popover,
        .topbar-profile-button,
        .topbar-icon-button {
          isolation: isolate;
        }

        .topbar-popover button {
          font-family: inherit;
        }

        @media (max-width: 768px) {
          .topbar-date {
            display: none;
          }

          .topbar-profile-info {
            display: none;
          }

          .topbar-profile-button {
            gap: 4px;
            padding: 3px;
          }

          .topbar-profile-button > svg {
            display: none;
          }

          .topbar-profile-avatar {
            width: 32px;
            height: 32px;
          }

          .topbar-search-popover {
            position: fixed;
            top: 70px;
            right: 12px;
            left: 12px;
            width: auto;
          }

          .topbar-notification-popover {
            position: fixed;
            top: 70px;
            right: 10px;
            width: min(350px, calc(100vw - 20px));
          }

          .topbar-profile-popover {
            position: fixed;
            top: 70px;
            right: 10px;
            width: min(250px, calc(100vw - 20px));
          }
        }

        @media (max-width: 420px) {
          .topbar-heading h2 {
            font-size: 15px;
          }

          .topbar-breadcrumb {
            font-size: 10px;
          }

          .topbar-right {
            gap: 5px;
          }

          .topbar-icon-button {
            width: 34px;
            height: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .topbar-popover {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}