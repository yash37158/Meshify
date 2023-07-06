import Home from "./pages/Dashboard";
import React from "react";
import { useState } from 'react';
import Navbar from "./Componets/Header/Header";
import NavigationDrawer from "./Componets/NavDrawer/NavigationDrawer";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "../src/pages/Dashboard"
import Settings from "./pages/Settings";
import Istio from "../src/pages/Istio";
import Linkerd from "../src/pages/linkerd"
import Cilium from "../src/pages/Cilium";
import Footer from "./Componets/Footer/Footer";
import Prometheus from "./pages/Performance/Prometheus";
import { disableBodyScroll } from 'body-scroll-lock';
import Authentication from "./pages/Auth/Authentication";
import ServiceMeshHealth from "./pages/ServiceMeshHealth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/provider" />}
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
        <Route path="/grafana" element={<Prometheus />} />
        <Route path="/service-mesh-health" element={<ServiceMeshHealth />} />
        <Route path="/settings" element={<Settings /> } />
      </Routes >
      <Footer /> 
    </BrowserRouter >
    </>
  );
}

export default App;
