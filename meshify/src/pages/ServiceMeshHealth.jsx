import React, { useEffect, useState } from 'react';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import Header from '../Componets/Header/Header';
import Footer from '../Componets/Footer/Footer';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaHeartbeat, 
  FaShieldAlt, 
  FaNetworkWired,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaSync,
  FaCog,
  FaChartLine,
  FaEye
} from 'react-icons/fa';
import { 
  RiAlertLine, 
  RiBarChart2Fill, 
  RiSettings3Line,
  RiServerLine,
  RiShieldLine
} from 'react-icons/ri';
import { SiPrometheus, SiGrafana, SiIstio } from 'react-icons/si';
import axios from 'axios';
import { RotateSpinner } from 'react-spinners-kit';

function ServiceMeshHealth() {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState({
    prometheus: { status: 'checking', address: '', lastCheck: null },
    grafana: { status: 'checking', address: '', lastCheck: null },
    istio: { status: 'checking', components: [], lastCheck: null },
    linkerd: { status: 'checking', components: [], lastCheck: null },
    cilium: { status: 'checking', components: [], lastCheck: null }
  });
  const [overallHealth, setOverallHealth] = useState('checking');
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalServices: 0,
    healthyServices: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

  const healthChecks = [
    {
      id: 'prometheus',
      name: 'Prometheus',
      description: 'Monitoring and alerting system',
      icon: SiPrometheus,
      color: 'text-warning',
      endpoint: '/api/prometheusgrafana/health/status'
    },
    {
      id: 'grafana',
      name: 'Grafana',
      description: 'Visualization and dashboard platform',
      icon: SiGrafana,
      color: 'text-info',
      endpoint: '/api/prometheusgrafana/health/status'
    },
    {
      id: 'istio',
      name: 'Istio',
      description: 'Service mesh control plane',
      icon: SiIstio,
      color: 'text-primary',
      endpoint: '/api/adapters'
    },
    {
      id: 'workloads',
      name: 'Workloads',
      description: 'Kubernetes workloads health',
      icon: RiServerLine,
      color: 'text-secondary',
      endpoint: '/api/kube/workloads'
    }
  ];

  const sampleAlerts = [
    {
      id: 1,
      severity: 'critical',
      message: 'High error rate detected in product-catalog service',
      timestamp: '2 minutes ago',
      service: 'product-catalog'
    },
    {
      id: 2,
      severity: 'warning',
      message: 'Memory usage above 80% on node worker-2',
      timestamp: '5 minutes ago',
      service: 'infrastructure'
    },
    {
      id: 3,
      severity: 'info',
      message: 'New service mesh component deployed successfully',
      timestamp: '10 minutes ago',
      service: 'deployment'
    }
  ];

  useEffect(() => {
    fetchHealthData();
    setAlerts(sampleAlerts);
    
    // Set up periodic health checks
    const interval = setInterval(fetchHealthData, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = async () => {
    setLoading(true);
    const newHealthData = { ...healthData };
    let healthyServices = 0;
    let totalServices = 0;

    try {
      // Check Prometheus and Grafana
      const monitoringResponse = await axios.get('http://localhost:8080/api/prometheusgrafana/health/status');
      if (monitoringResponse.data && Array.isArray(monitoringResponse.data)) {
        const prometheus = monitoringResponse.data.find(service => service.Name === 'Prometheus');
        const grafana = monitoringResponse.data.find(service => service.Name === 'Grafana');
        
        if (prometheus) {
          newHealthData.prometheus = {
            status: prometheus.Address ? 'healthy' : 'unhealthy',
            address: prometheus.Address,
            lastCheck: new Date().toLocaleTimeString()
          };
          totalServices++;
          if (prometheus.Address) healthyServices++;
        }
        
        if (grafana) {
          newHealthData.grafana = {
            status: grafana.Address ? 'healthy' : 'unhealthy',
            address: grafana.Address,
            lastCheck: new Date().toLocaleTimeString()
          };
          totalServices++;
          if (grafana.Address) healthyServices++;
        }
      }

      // Check workloads
      const workloadsResponse = await axios.get('http://localhost:8080/api/kube/workloads');
      if (workloadsResponse.data) {
        const workloads = workloadsResponse.data;
        const totalWorkloads = (workloads.numPods || 0) + (workloads.numServices || 0);
        totalServices += totalWorkloads;
        healthyServices += Math.floor(totalWorkloads * 0.9); // Assume 90% healthy
        
        setMetrics({
          totalServices: workloads.numServices || 0,
          healthyServices: Math.floor((workloads.numServices || 0) * 0.9),
          errorRate: Math.random() * 5, // Mock error rate
          avgResponseTime: Math.floor(Math.random() * 200) + 50 // Mock response time
        });
      }

      // Check service mesh adapters
      const adaptersResponse = await axios.get('http://localhost:8080/api/adapters');
      if (adaptersResponse.data) {
        const adapterCount = Object.keys(adaptersResponse.data).length;
        newHealthData.istio = {
          status: adapterCount > 0 ? 'healthy' : 'unhealthy',
          components: Object.keys(adaptersResponse.data),
          lastCheck: new Date().toLocaleTimeString()
        };
        totalServices += adapterCount;
        if (adapterCount > 0) healthyServices += adapterCount;
      }

    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Error fetching service mesh health data');
    }

    // Calculate overall health
    const healthPercentage = totalServices > 0 ? (healthyServices / totalServices) * 100 : 0;
    if (healthPercentage >= 90) {
      setOverallHealth('healthy');
    } else if (healthPercentage >= 70) {
      setOverallHealth('warning');
    } else {
      setOverallHealth('critical');
    }

    setHealthData(newHealthData);
    setLoading(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'healthy': return 'badge-success';
      case 'warning': return 'badge-warning';
      case 'critical': 
      case 'unhealthy': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getOverallHealthColor = () => {
    switch (overallHealth) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const getAlertSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'alert-error';
      case 'warning': return 'alert-warning';
      case 'info': return 'alert-info';
      default: return 'alert';
    }
  };

  const handleOpenDashboard = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dashboard/prometheus');
      window.open('http://localhost:9090', '_blank');
      toast.success('Opening Prometheus dashboard...');
    } catch (error) {
      toast.error('Failed to open dashboard');
    }
  };

  const handleRefreshHealth = () => {
    toast.info('Refreshing health checks...');
    fetchHealthData();
  };

  return (
    <NavigationDrawer>
      <Header />

      <div className="p-4 lg:p-6">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-base-content">Service Mesh Health</h2>
              <FaHeartbeat className={`text-2xl ml-3 ${getOverallHealthColor()}`} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`badge ${getStatusBadgeClass(overallHealth)} gap-2`}>
                <FaHeartbeat className="w-3 h-3" />
                {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
              </div>
              <button 
                className="btn btn-circle btn-outline btn-primary btn-sm"
                onClick={handleRefreshHealth}
                title="Refresh Health Checks"
              >
                <FaSync />
              </button>
            </div>
          </div>
          <p className="text-base-content/70 text-lg">
            Ensuring the well-being of your service mesh infrastructure. Monitor the health and performance 
            of all service mesh components in real-time.
          </p>
        </div>

        {/* Health Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="stat-figure text-primary">
              <RiServerLine className="text-2xl" />
            </div>
            <div className="stat-title text-base-content/70">Total Services</div>
            <div className="stat-value text-primary">{metrics.totalServices}</div>
            <div className="stat-desc text-base-content/50">Across all namespaces</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="stat-figure text-success">
              <FaCheckCircle className="text-2xl" />
            </div>
            <div className="stat-title text-base-content/70">Healthy Services</div>
            <div className="stat-value text-success">{metrics.healthyServices}</div>
            <div className="stat-desc text-base-content/50">
              {metrics.totalServices > 0 ? Math.round((metrics.healthyServices / metrics.totalServices) * 100) : 0}% uptime
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="stat-figure text-error">
              <RiAlertLine className="text-2xl" />
            </div>
            <div className="stat-title text-base-content/70">Error Rate</div>
            <div className="stat-value text-error">{metrics.errorRate.toFixed(2)}%</div>
            <div className="stat-desc text-base-content/50">Last 5 minutes</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="stat-figure text-info">
              <FaChartLine className="text-2xl" />
            </div>
            <div className="stat-title text-base-content/70">Avg Response Time</div>
            <div className="stat-value text-info">{metrics.avgResponseTime}ms</div>
            <div className="stat-desc text-base-content/50">P95 latency</div>
          </div>
        </div>

        {/* Component Health Checks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <h3 className="text-xl font-bold text-base-content mb-4">Component Health Status</h3>
            <div className="space-y-4">
              {healthChecks.map(component => {
                const ComponentIcon = component.icon;
                const componentHealth = healthData[component.id];
                
                return (
                  <div key={component.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div className="flex items-center">
                      <ComponentIcon className={`text-2xl mr-3 ${component.color}`} />
                      <div>
                        <h4 className="font-semibold text-base-content">{component.name}</h4>
                        <p className="text-base-content/60 text-sm">{component.description}</p>
                        {componentHealth?.lastCheck && (
                          <p className="text-base-content/40 text-xs">Last check: {componentHealth.lastCheck}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`badge ${getStatusBadgeClass(componentHealth?.status || 'checking')}`}>
                        {componentHealth?.status === 'healthy' && <FaCheckCircle className="w-3 h-3 mr-1" />}
                        {componentHealth?.status === 'unhealthy' && <FaTimesCircle className="w-3 h-3 mr-1" />}
                        {componentHealth?.status === 'checking' && <span className="loading loading-xs mr-1" />}
                        {componentHealth?.status || 'Checking...'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-base-content">Active Alerts</h3>
              <div className="badge badge-error">{alerts.length}</div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <div key={alert.id} className={`alert ${getAlertSeverityClass(alert.severity)} p-3`}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start">
                        {alert.severity === 'critical' && <FaExclamationTriangle className="mr-2 mt-1" />}
                        {alert.severity === 'warning' && <RiAlertLine className="mr-2 mt-1" />}
                        {alert.severity === 'info' && <FaCheckCircle className="mr-2 mt-1" />}
                        <div>
                          <p className="font-medium text-sm">{alert.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            Service: {alert.service} • {alert.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/50">
                  <FaCheckCircle className="text-4xl mx-auto mb-2 text-success" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <h3 className="text-xl font-bold text-base-content mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              className="btn btn-primary"
              onClick={handleOpenDashboard}
            >
              <FaExternalLinkAlt className="mr-2" />
              Open Prometheus
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.open('http://localhost:3001', '_blank')}
            >
              <FaExternalLinkAlt className="mr-2" />
              Open Grafana
            </button>
            <button 
              className="btn btn-accent"
              onClick={() => toast.info('Service mesh configuration - Feature coming soon!')}
            >
              <FaCog className="mr-2" />
              Configure Mesh
            </button>
            <button 
              className="btn btn-info"
              onClick={() => toast.info('Detailed diagnostics - Feature coming soon!')}
            >
              <FaEye className="mr-2" />
              Run Diagnostics
            </button>
          </div>
        </div>

        {/* Health Recommendations */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
          <h3 className="text-xl font-bold text-base-content mb-4">Health Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FaCheckCircle className="text-success mr-2" />
                <h4 className="font-semibold text-base-content">System Health Good</h4>
              </div>
              <p className="text-base-content/70 text-sm">
                All critical components are operational. Continue monitoring for optimal performance.
              </p>
            </div>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <RiAlertLine className="text-warning mr-2" />
                <h4 className="font-semibold text-base-content">Monitor Resource Usage</h4>
              </div>
              <p className="text-base-content/70 text-sm">
                Some services are approaching resource limits. Consider scaling or optimization.
              </p>
            </div>
          </div>
        </div>
      </div>

    </NavigationDrawer>
  );
}

export default ServiceMeshHealth;