import React from 'react'
import logo from "../../assets/logo.svg"
import { FaBell, FaSync, FaUser, FaSlidersH} from "react-icons/fa"
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import Cookies from 'js-cookie';


export default function Header() {
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState('Welcome');
  const [notificationClusterCount, setNotificationClusterCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // Dynamically update from the process
  const [notificationCount, setNotificationCount]=useState(2);
  const [toasts, setToasts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case '/provider':
        setDashboardTitle('Welcome');
        break;
      case '/dashboard':
        setDashboardTitle('Dashboard');
        break;

      case '/trafficmanagement':
        setDashboardTitle('Traffic Management');
        break;  

      case '/service-mesh-health':
        setDashboardTitle('Service Mesh Health');
        break;

      case '/security':
        setDashboardTitle('Security');
        break;
      
      case '/observability':
        setDashboardTitle('Observability');
        break;

      case '/settings':
        setDashboardTitle('Settings');
        break;
      default:
        setDashboardTitle('Welcome');
    }
  }, [location]);

  useEffect(()=>{
    const fetchNotificationClusterCount = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/kube/cluster");
        setNotificationClusterCount(response.data.numClusters);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotificationClusterCount();
  }, []);




  return (
    <div class="containe bg-blue-50 flex flex-wrap p-4 flex-col md:flex-row">
    <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <div>
        <img src={logo} alt="Meshify-logo" class="w-fit h-14 text-white p-2  rounded-full" viewBox="0 0 24 24">
      </img>
        </div>
      <span class="ml-3 text-2xl text-[#214DBE]">Meshify</span>
      {/* Should Dynamically update based on the routes used with usestate() */}
      <span class="text-xl ml-3 italic text-[#214DBE] opacity-80">{dashboardTitle}</span>
    </a>

      <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center mr-10">
      <div className="relative inline-block">
      <FaSync className="text-2xl mx-4 "></FaSync>
      {notificationClusterCount > 0 && (
        <span className="absolute top-0 right-0 bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
          {notificationClusterCount}
        </span>
      )}
    </div>

    <div className="relative inline-block">
      <FaBell className="text-2xl mx-2" />
      {notificationCount > 0 &&(
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 py-0 text-xs">
          {notificationCount}
        </span>
      )}
    </div>
    <div className="relative inline-block">
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}>
        <FaUser className="text-2xl mx-2" />
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <a
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                const token = localStorage.getItem('messagingSessionStart ab.storage..a9882122-ac6c-486a-bc3b-fab39ef624c5');
                if (token) {
                  const slicedToken = token.slice(2);
                  toast.info(`Token: ${slicedToken}`);
                } else {
                  toast.error('Token not found');
                }
              }}
            >
              Get Token
            </a>
            <a
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        </div>
      )}
    </div>

      <ToastContainer />
    </nav>

  </div>
  );
}
