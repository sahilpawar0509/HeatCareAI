import React from "react";
import {
  Activity,
  LayoutDashboard,
  Thermometer,
  TrendingUp,
  BedDouble,
  Package,
  Users,
  Pill,
  Ambulance,
  BellRing,
  FileBarChart,
  Settings,
  ShieldCheck,
  HeartPulse,
  ChevronLeft,
  X,
} from "lucide-react";

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Heatwave Monitor",
        path: "/heatwave-monitor",
        icon: Thermometer,
      },
      {
        label: "Demand Forecast",
        path: "/demand-forecast",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "HOSPITAL OPERATIONS",
    items: [
      {
        label: "Bed & ICU Capacity",
        path: "/capacity",
        icon: BedDouble,
      },
      {
        label: "Resource Management",
        path: "/resources",
        icon: Package,
      },
      {
        label: "Staff Management",
        path: "/staff",
        icon: Users,
      },
      {
        label: "Medicine Inventory",
        path: "/medicines",
        icon: Pill,
      },
      {
        label: "Ambulance Management",
        path: "/ambulances",
        icon: Ambulance,
      },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        label: "Risk & Alerts",
        path: "/alerts",
        icon: BellRing,
      },
      {
        label: "Analytics & Reports",
        path: "/analytics",
        icon: FileBarChart,
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "User Management",
        path: "/users",
        icon: ShieldCheck,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({
  activePage = "Dashboard",
  onNavigate,
  isOpen = true,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) {
  const handleNavigation = (item) => {
    if (onNavigate) {
      onNavigate(item.path, item.label);
    }

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "sidebar",
          isOpen ? "open" : "",
          collapsed ? "collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <HeartPulse size={24} strokeWidth={2.4} />
          </div>

          {!collapsed && (
            <div className="sidebar-brand-text">
              <h1>HeatCare AI</h1>
              <p>Hospital Intelligence</p>
            </div>
          )}

          {onClose && (
            <button
              type="button"
              className="sidebar-mobile-close"
              aria-label="Close sidebar"
              onClick={onClose}
            >
              <X size={19} />
            </button>
          )}
        </div>

        <div className="sidebar-status">
          <span className="sidebar-status-dot" />
          {!collapsed && (
            <span>Monitoring System Active</span>
          )}
        </div>

        <nav className="sidebar-nav">
          {navigationGroups.map((group) => (
            <div className="sidebar-nav-group" key={group.title}>
              {!collapsed && (
                <p className="sidebar-section-title">
                  {group.title}
                </p>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  activePage === item.label ||
                  activePage === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    className={[
                      "sidebar-nav-item",
                      isActive ? "active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleNavigation(item)}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={18} strokeWidth={1.9} />

                    {!collapsed && (
                      <span>{item.label}</span>
                    )}

                    {item.label === "Risk & Alerts" &&
                      !collapsed && (
                        <span className="sidebar-nav-badge">
                          3
                        </span>
                      )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="sidebar-health-card">
              <div className="sidebar-health-icon">
                <Activity size={18} />
              </div>

              <div className="sidebar-health-content">
                <h4>HeatCare Intelligence</h4>
                <p>Hospital readiness overview</p>
              </div>
            </div>
          )}

          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              AD
            </div>

            {!collapsed && (
              <>
                <div className="sidebar-user-info">
                  <h4>Hospital Administrator</h4>
                  <p>Administrator</p>
                </div>

                {onToggleCollapse && (
                  <button
                    type="button"
                    className="sidebar-collapse-button"
                    aria-label="Collapse sidebar"
                    onClick={onToggleCollapse}
                  >
                    <ChevronLeft size={17} />
                  </button>
                )}
              </>
            )}
          </div>

          {!collapsed && (
            <p className="sidebar-version">
              HEATCARE AI · PROTOTYPE
            </p>
          )}
        </div>
      </aside>
    </>
  );
}