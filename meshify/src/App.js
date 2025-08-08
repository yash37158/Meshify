import Home from "./pages/Dashboard";
import React from "react";
import { useState, useEffect } from 'react';
import Navbar from "./Componets/Header/Header";
import NavigationDrawer from "./Componets/NavDrawer/NavigationDrawer";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams} from "react-router-dom";
import Dashboard from "../src/pages/Dashboard"
import Settings from "./pages/Settings";
import Istio from "../src/pages/Istio";
import Linkerd from "../src/pages/linkerd"
import Cilium from "../src/pages/Cilium";
import Footer from "./Componets/Footer/Footer";
import Prometheus from "./pages/Performance/Prometheus";
import Grafana from "./pages/Performance/Grafana";
import { disableBodyScroll } from 'body-scroll-lock';
import Authentication from "./pages/Auth/Authentication";
import ServiceMeshHealth from "./pages/ServiceMeshHealth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is already authenticated (from URL params or localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      setIsAuthenticated(true);
      // Store auth state
      localStorage.setItem('meshify_authenticated', 'true');
    } else {
      // Check localStorage for existing auth
      const stored = localStorage.getItem('meshify_authenticated');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('meshify_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('meshify_authenticated');
  };

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/provider" />}
          />
        <Route
          path="/provider"
          element={<Authentication onLogin={handleLogin} />}
           />
        <Route
          path="/dashboard"
          element={<Dashboard/>}
        />
        <Route path="/istio" element={<Istio/>} />
        <Route path="/cilium" element={ <Cilium />} />
        <Route path="/linkerd" element={ <Linkerd />} />
        <Route path="/prometheus" element={ <Prometheus />} />
        <Route path="/grafana" element={<Grafana />} />
        <Route path="/service-mesh-health" element={<ServiceMeshHealth />} />
        <Route path="/settings" element={<Settings /> } />
      </Routes >
    </BrowserRouter >
    
    {/* Centralized Toast Container */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    </>
  );
}

export default App;
