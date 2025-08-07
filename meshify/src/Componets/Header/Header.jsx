import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaBell, FaSync, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

export default function Header() {
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState("Welcome");
  const [notificationClusterCount, setNotificationClusterCount] = useState(0);
  const [notificationCount] = useState(2);

  useEffect(() => {
    const pathMap = {
      "/provider": "Welcome",
      "/dashboard": "Dashboard",
      "/trafficmanagement": "Traffic Management",
      "/service-mesh-health": "Service Mesh Health",
      "/security": "Security",
      "/observability": "Observability",
      "/settings": "Settings",
    };
    setDashboardTitle(pathMap[location.pathname] ?? "Welcome");
  }, [location.pathname]);

  useEffect(() => {
    async function fetchCount() {
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/kube/cluster"
        );
        setNotificationClusterCount(data.numClusters);
      } catch (e) {
        console.log(e);
      }
    }
    fetchCount();
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <img src={logo} alt="Meshify" className="w-10 h-10" />
        <span className="ml-2 text-2xl font-bold text-primary">Meshify</span>
        <span className="ml-3 text-xl italic opacity-70 hidden sm:inline">
          {dashboardTitle}
        </span>
      </div>

      <div className="flex-none gap-4">
        <div className="indicator">
          <FaSync className="text-2xl cursor-pointer" />
          {notificationClusterCount > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">
              {notificationClusterCount}
            </span>
          )}
        </div>

        <div className="indicator">
          <FaBell className="text-2xl cursor-pointer" />
          {notificationCount > 0 && (
            <span className="badge badge-xs badge-error indicator-item" />
          )}
        </div>

        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <FaUser className="text-2xl" />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a
                onClick={() => {
                  const token = localStorage.getItem(
                    "messagingSessionStart ab.storage..a9882122-ac6c-486a-bc3b-fab39ef624c5"
                  );
                  token
                    ? toast.info(`Token: ${token.slice(2)}`)
                    : toast.error("Token not found");
                }}
              >
                Get Token
              </a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
