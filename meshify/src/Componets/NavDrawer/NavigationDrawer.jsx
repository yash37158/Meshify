// State Management is need to be implemented
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaServer, 
  FaNetworkWired, 
  FaShieldAlt,
  FaChartLine,
  FaDatabase,
  FaCogs,
  FaHeartbeat
} from "react-icons/fa";
import { SiPrometheus, SiGrafana, SiIstio } from "react-icons/si";

function NavigationDrawer({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: "Dashboard", page: "dashboard", icon: FaHome },
    { label: "Istio", page: "istio", icon: SiIstio },
    { label: "Linkerd", page: "linkerd", icon: FaNetworkWired },
    { label: "Cilium", page: "cilium", icon: FaShieldAlt },
    { label: "Prometheus", page: "prometheus", icon: SiPrometheus },
    { label: "Grafana", page: "grafana", icon: SiGrafana },
    { label: "Service Mesh Health", page: "service-mesh-health", icon: FaHeartbeat },
    { label: "Settings", page: "settings", icon: FaCogs },
  ];

  const isActivePage = (page) => {
    return location.pathname === `/${page}`;
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="nav-drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={() => setIsOpen(!isOpen)}
      />
      
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Mobile toggle button */}
        <div className="lg:hidden">
          <label
            htmlFor="nav-drawer-toggle"
            className="btn btn-primary drawer-button m-4 w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            Menu
          </label>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
          
      <div className="drawer-side z-40">
        <label
          htmlFor="nav-drawer-toggle"
          className="drawer-overlay lg:hidden"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Enhanced sidebar */}
        <div className="w-72 min-h-full bg-base-200 text-base-content pt-16 lg:pt-20">
          {/* Navigation header */}
          <div className="p-4 border-b border-base-300">
            <h2 className="text-lg font-semibold text-base-content/80">Navigation</h2>
            <p className="text-sm opacity-60">Service Mesh Management</p>
          </div>

          {/* Navigation menu */}
          <ul className="menu p-4 space-y-2">
            {navLinks.map(({ label, page, icon: Icon }) => (
              <li key={page}>
                <a
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActivePage(page)
                      ? 'bg-primary text-primary-content shadow-md'
                      : 'hover:bg-base-300 hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/${page}`);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                  {isActivePage(page) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-content"></div>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Footer section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
            <div className="text-center">
              <p className="text-xs opacity-60">Meshify v1.0.0</p>
              <p className="text-xs opacity-40">Service Mesh Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationDrawer;