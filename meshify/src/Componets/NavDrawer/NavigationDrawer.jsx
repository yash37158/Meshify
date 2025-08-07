// State Management is need to be implemented
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NavigationDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Istio", page: "istio" },
    { label: "Linkerd", page: "linkerd" },
    { label: "Cilium", page: "cilium" },
    { label: "Prometheus", page: "prometheus" },
    { label: "Grafana", page: "grafana" },
    { label: "Service Mesh Health", page: "service-mesh-health" },
    { label: "Settings", page: "settings" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="nav-drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* mobile toggle */}
        <label
          htmlFor="nav-drawer-toggle"
          className="btn btn-primary drawer-button lg:hidden m-2 w-fit"
        >
          Menu
        </label>

        {/* page content passed from parent */}
        <div className="p-2 lg:p-6">{children}</div>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="nav-drawer-toggle"
          className="drawer-overlay lg:hidden"
          onClick={() => setIsOpen(false)}
        />
        <ul className="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
          <li className="menu-title">
            <span>Navigation</span>
          </li>
          {navLinks.map(({ label, page }) => (
            <li key={page}>
              <a
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/${page}`);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NavigationDrawer;