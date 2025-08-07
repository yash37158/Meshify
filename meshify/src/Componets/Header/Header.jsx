import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { 
  FaBell, 
  FaSync, 
  FaUser, 
  FaServer, 
  FaCloud, 
  FaDatabase,
  FaTimes,
  FaCheck,
  FaExclamationTriangle
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function Header() {
  const location = useLocation();
  const [dashboardTitle, setDashboardTitle] = useState("Welcome");
  const [notificationClusterCount, setNotificationClusterCount] = useState(0);
  const [notificationCount] = useState(2);
  const [showContextModal, setShowContextModal] = useState(false);
  const [contexts, setContexts] = useState([]);
  const [activeContext, setActiveContext] = useState(null);
  const [loading, setLoading] = useState(false);

  // Enhanced path mapping with more routes
  const pathMap = {
    "/provider": "Welcome",
    "/dashboard": "Dashboard",
    "/istio": "Istio Service Mesh",
    "/linkerd": "Linkerd Service Mesh", 
    "/cilium": "Cilium Networking",
    "/prometheus": "Prometheus Monitoring",
    "/grafana": "Grafana Visualization",
    "/trafficmanagement": "Traffic Management",
    "/service-mesh-health": "Service Mesh Health",
    "/security": "Security",
    "/observability": "Observability",
    "/settings": "Settings",
  };

  useEffect(() => {
    setDashboardTitle(pathMap[location.pathname] ?? "Welcome");
  }, [location.pathname]);

  // Load contexts (clusters, namespaces, services)
  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      setLoading(true);
      
      // Load cluster information
      const [clusterResponse, workloadsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/kube/cluster").catch(() => ({ data: { clusters: [] } })),
        axios.get("http://localhost:8080/api/kube/workloads").catch(() => ({ data: {} }))
      ]);

      const clusters = clusterResponse.data.clusters || [];
      const workloads = workloadsResponse.data;

      // Create context list
      const contextList = [];

      // Add cluster contexts
      clusters.forEach((cluster, index) => {
        contextList.push({
          id: `cluster-${index}`,
          type: 'cluster',
          name: cluster.name || `Cluster ${index + 1}`,
          status: cluster.isactive === 'true' ? 'active' : 'inactive',
          version: cluster.version?.gitVersion || 'Unknown',
          icon: FaCloud,
          details: {
            nodes: workloads.numNodes || 0,
            pods: workloads.numPods || 0,
            services: workloads.numServices || 0
          }
        });
      });

      // Add service mesh contexts
      const serviceMeshes = [
        { name: 'Istio', status: 'checking', icon: FaServer },
        { name: 'Linkerd', status: 'checking', icon: FaServer },
        { name: 'Cilium', status: 'checking', icon: FaServer }
      ];

      serviceMeshes.forEach((mesh, index) => {
        contextList.push({
          id: `mesh-${index}`,
          type: 'service-mesh',
          name: mesh.name,
          status: mesh.status,
          icon: mesh.icon,
          details: {
            components: 0,
            proxies: 0
          }
        });
      });

      // Add monitoring contexts
      const monitoring = [
        { name: 'Prometheus', status: 'checking', icon: FaDatabase },
        { name: 'Grafana', status: 'checking', icon: FaDatabase }
      ];

      monitoring.forEach((monitor, index) => {
        contextList.push({
          id: `monitor-${index}`,
          type: 'monitoring',
          name: monitor.name,
          status: monitor.status,
          icon: monitor.icon,
          details: {
            metrics: 0,
            alerts: 0
          }
        });
      });

      setContexts(contextList);
      setNotificationClusterCount(contextList.length);
      
      // Set first active cluster as active context
      const activeCluster = contextList.find(c => c.type === 'cluster' && c.status === 'active');
      if (activeCluster) {
        setActiveContext(activeCluster);
      }

    } catch (error) {
      console.error("Error loading contexts:", error);
      toast.error("Failed to load contexts");
    } finally {
      setLoading(false);
    }
  };

  const handleContextSwitch = (context) => {
    setActiveContext(context);
    setShowContextModal(false);
    toast.success(`Switched to ${context.name}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'inactive': return 'text-error';
      case 'checking': return 'text-warning';
      default: return 'text-base-content';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheck className="w-3 h-3" />;
      case 'inactive': return <FaTimes className="w-3 h-3" />;
      case 'checking': return <FaExclamationTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <>
      {/* Full-width header */}
      <div className="navbar bg-base-100 shadow-sm border-b border-base-300 fixed top-0 left-0 right-0 z-50">
        <div className="flex-1 px-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <img src={logo} alt="Meshify" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="ml-2 text-xl sm:text-2xl font-bold text-primary">Meshify</span>
            <div className="divider divider-horizontal mx-2 hidden sm:flex"></div>
            <span className="text-lg sm:text-xl italic opacity-70 hidden sm:inline">
              {dashboardTitle}
            </span>
          </div>

          {/* Active Context Indicator */}
          {activeContext && (
            <div className="ml-4 hidden lg:flex items-center bg-base-200 rounded-lg px-3 py-1">
              <activeContext.icon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{activeContext.name}</span>
              <div className={`ml-2 w-2 h-2 rounded-full ${activeContext.status === 'active' ? 'bg-success' : activeContext.status === 'inactive' ? 'bg-error' : 'bg-warning'}`}></div>
            </div>
          )}
        </div>

        <div className="flex-none gap-2 sm:gap-4 px-4">
          {/* Context Switcher */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle indicator">
              <FaSync className="text-xl cursor-pointer" />
      {notificationClusterCount > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">
          {notificationClusterCount}
        </span>
      )}
            </label>
            <div
              tabIndex={0}
              className="dropdown-content mt-3 p-0 shadow-lg bg-base-100 rounded-box w-80 border border-base-300"
            >
              <div className="p-4 border-b border-base-300">
                <h3 className="font-semibold text-lg">Available Contexts</h3>
                <p className="text-sm opacity-70">Switch between clusters and services</p>
    </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center p-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                ) : contexts.length > 0 ? (
                  <div className="p-2">
                    {['cluster', 'service-mesh', 'monitoring'].map(type => {
                      const typeContexts = contexts.filter(c => c.type === type);
                      if (typeContexts.length === 0) return null;
                      
                      return (
                        <div key={type} className="mb-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 px-2 mb-2">
                            {type.replace('-', ' ')}
                          </h4>
                          {typeContexts.map(context => (
                            <div
                              key={context.id}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                activeContext?.id === context.id 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : 'hover:bg-base-200'
                              }`}
                              onClick={() => handleContextSwitch(context)}
                            >
                              <div className="flex items-center">
                                <context.icon className="w-4 h-4 mr-3 opacity-70" />
                                <div>
                                  <div className="font-medium text-sm">{context.name}</div>
                                  {context.details && (
                                    <div className="text-xs opacity-60">
                                      {context.type === 'cluster' && 
                                        `${context.details.nodes} nodes, ${context.details.pods} pods`
                                      }
                                      {context.type === 'service-mesh' && 
                                        `${context.details.components} components`
                                      }
                                      {context.type === 'monitoring' && 
                                        `${context.details.metrics} metrics`
                                      }
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className={`flex items-center ${getStatusColor(context.status)}`}>
                                {getStatusIcon(context.status)}
                                {activeContext?.id === context.id && (
                                  <div className="ml-2 w-2 h-2 rounded-full bg-primary"></div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FaServer className="w-8 h-8 mx-auto opacity-30 mb-2" />
                    <p className="text-sm opacity-70">No contexts available</p>
                  </div>
      )}
    </div>
              
              <div className="p-3 border-t border-base-300">
                <button 
                  className="btn btn-sm btn-outline w-full"
                  onClick={loadContexts}
                  disabled={loading}
                >
                  <FaSync className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Contexts
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle indicator">
              <FaBell className="text-xl cursor-pointer" />
              {notificationCount > 0 && (
                <span className="badge badge-xs badge-error indicator-item" />
              )}
            </label>
            <div
              tabIndex={0}
              className="dropdown-content mt-3 p-4 shadow-lg bg-base-100 rounded-box w-80 border border-base-300"
            >
              <h3 className="font-semibold mb-3">Notifications</h3>
              <div className="space-y-2">
                <div className="alert alert-warning">
                  <FaExclamationTriangle />
                  <span className="text-sm">Service mesh health check needed</span>
                </div>
                <div className="alert alert-info">
                  <FaServer />
                  <span className="text-sm">New cluster context available</span>
                </div>
              </div>
            </div>
      </div>

          {/* User Menu */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <FaUser className="text-xl" />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
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
    </div>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Remove ToastContainer from here - it should only be in one place */}
    </>
  );
}
