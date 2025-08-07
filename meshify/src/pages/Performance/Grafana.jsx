import React, { useState, useEffect } from 'react';
import Header from '../../Componets/Header/Header';
import NavigationDrawer from '../../Componets/NavDrawer/NavigationDrawer';
import Footer from '../../Componets/Footer/Footer';
import { SiGrafana, SiPrometheus } from 'react-icons/si';
import { 
  RiBarChart2Fill, 
  RiDashboardLine, 
  RiSettings3Line,
  RiDownloadLine,
  RiUploadLine,
  RiEyeLine
} from 'react-icons/ri';
import { 
  FaPlay, 
  FaStop, 
  FaCog, 
  FaEye, 
  FaPlus, 
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaCopy
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Grafana() {
  const navigate = useNavigate();
  const [grafanaStatus, setGrafanaStatus] = useState('checking');
  const [prometheusStatus, setPrometheusStatus] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [selectedDataSource, setSelectedDataSource] = useState('prometheus');
  const [timeRange, setTimeRange] = useState('1h');

  const predefinedDashboards = [
    {
      id: 'istio-service-mesh',
      name: 'Istio Service Mesh Overview',
      description: 'Complete overview of Istio service mesh metrics',
      panels: 12,
      status: 'active',
      category: 'Service Mesh'
    },
    {
      id: 'kubernetes-cluster',
      name: 'Kubernetes Cluster Monitoring',
      description: 'Cluster-wide resource monitoring and health',
      panels: 8,
      status: 'active',
      category: 'Infrastructure'
    },
    {
      id: 'application-performance',
      name: 'Application Performance Monitoring',
      description: 'Application-level metrics and performance insights',
      panels: 15,
      status: 'draft',
      category: 'Applications'
    },
    {
      id: 'network-traffic',
      name: 'Network Traffic Analysis',
      description: 'Network flow and traffic pattern analysis',
      panels: 10,
      status: 'active',
      category: 'Network'
    },
    {
      id: 'security-monitoring',
      name: 'Security & Compliance Dashboard',
      description: 'Security events and compliance monitoring',
      panels: 6,
      status: 'draft',
      category: 'Security'
    },
    {
      id: 'linkerd-mesh',
      name: 'Linkerd Service Mesh',
      description: 'Linkerd-specific metrics and observability',
      panels: 9,
      status: 'active',
      category: 'Service Mesh'
    }
  ];

  const dataSources = [
    { id: 'prometheus', name: 'Prometheus', type: 'Time Series', status: 'connected' },
    { id: 'jaeger', name: 'Jaeger', type: 'Tracing', status: 'connected' },
    { id: 'loki', name: 'Loki', type: 'Logs', status: 'disconnected' },
    { id: 'elasticsearch', name: 'Elasticsearch', type: 'Logs', status: 'connected' }
  ];

  const timeRanges = [
    { value: '5m', label: 'Last 5 minutes' },
    { value: '15m', label: 'Last 15 minutes' },
    { value: '1h', label: 'Last 1 hour' },
    { value: '6h', label: 'Last 6 hours' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ];

  useEffect(() => {
    const checkGrafanaStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/prometheusgrafana/health/status');
        
        if (response.data && Array.isArray(response.data)) {
          const prometheus = response.data.find(service => service.Name === 'Prometheus');
          const grafana = response.data.find(service => service.Name === 'Grafana');
          
          setPrometheusStatus(prometheus?.Address ? 'active' : 'inactive');
          setGrafanaStatus(grafana?.Address ? 'active' : 'inactive');
          
          toast.success('Grafana service status checked successfully');
        }
      } catch (error) {
        console.error('Error checking Grafana status:', error);
        setGrafanaStatus('inactive');
        setPrometheusStatus('inactive');
        toast.error('Error checking Grafana service status');
      } finally {
        setLoading(false);
      }
    };

    checkGrafanaStatus();
    setDashboards(predefinedDashboards);
  }, []);

  const handleOpenGrafana = () => {
    if (grafanaStatus === 'active') {
      toast.success('Opening Grafana dashboard...');
      window.open('http://localhost:3001', '_blank');
    } else {
      toast.error('Grafana is not available');
    }
  };

  const handleDashboardSelect = (event) => {
    setSelectedDashboard(event.target.value);
    const dashboard = predefinedDashboards.find(d => d.id === event.target.value);
    if (dashboard) {
      toast.success(`Selected dashboard: ${dashboard.name}`);
    }
  };

  const handleCreateDashboard = () => {
    toast.info('Create dashboard - Opening Grafana editor...');
    if (grafanaStatus === 'active') {
      window.open('http://localhost:3001/dashboard/new', '_blank');
    }
  };

  const handleImportDashboard = () => {
    toast.info('Import dashboard - Feature coming soon!');
  };

  const handleExportDashboard = () => {
    if (selectedDashboard) {
      toast.success('Exporting dashboard configuration...');
    } else {
      toast.warning('Please select a dashboard to export');
    }
  };

  const handleEditDashboard = (dashboardId) => {
    toast.info(`Editing dashboard: ${dashboardId}`);
    if (grafanaStatus === 'active') {
      window.open(`http://localhost:3001/d/${dashboardId}/edit`, '_blank');
    }
  };

  const handleViewDashboard = (dashboardId) => {
    toast.info(`Opening dashboard: ${dashboardId}`);
    if (grafanaStatus === 'active') {
      window.open(`http://localhost:3001/d/${dashboardId}`, '_blank');
    }
  };

  const handleCloneDashboard = (dashboardId) => {
    toast.info(`Cloning dashboard: ${dashboardId}`);
  };

  const handleDeleteDashboard = (dashboardId) => {
    toast.warning(`Delete dashboard: ${dashboardId} - Feature coming soon!`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'draft': return 'badge-warning';
      case 'inactive': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Service Mesh': return 'text-primary';
      case 'Infrastructure': return 'text-secondary';
      case 'Applications': return 'text-accent';
      case 'Network': return 'text-info';
      case 'Security': return 'text-warning';
      default: return 'text-base-content';
    }
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
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-base-content">Grafana Dashboard Management</h2>
            <SiGrafana className="text-2xl ml-3 text-info" />
          </div>
          <p className="text-base-content/70 text-lg">
            Create, manage, and visualize your service mesh metrics with beautiful, interactive dashboards.
            Monitor your infrastructure, applications, and network performance in real-time.
          </p>
        </div>

        {/* Status & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Grafana Status Card */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SiGrafana className="text-2xl mr-3 text-info" />
                <h3 className="text-xl font-bold text-base-content">Grafana Service</h3>
              </div>
              <div className={`badge gap-2 ${grafanaStatus === 'active' ? 'badge-success' : 'badge-error'}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="6" r="6" fill="currentColor" />
                </svg>
                {grafanaStatus === 'active' ? 'Active' : 'Inactive'}
              </div>
            </div>
            <p className="text-base-content/70 mb-4">
              Grafana visualization platform status and quick access to dashboard management.
            </p>
            <div className="flex gap-2 flex-wrap">
              <button 
                className="btn btn-info btn-sm"
                onClick={handleOpenGrafana}
                disabled={grafanaStatus !== 'active'}
              >
                <FaExternalLinkAlt className="mr-2" />
                Open Grafana
              </button>
              <button className="btn btn-outline btn-info btn-sm" onClick={handleCreateDashboard}>
                <FaPlus className="mr-2" />
                New Dashboard
              </button>
            </div>
          </div>

          {/* Data Sources Card */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SiPrometheus className="text-2xl mr-3 text-warning" />
                <h3 className="text-xl font-bold text-base-content">Data Sources</h3>
              </div>
              <div className="badge badge-info">
                {dataSources.filter(ds => ds.status === 'connected').length} Connected
              </div>
            </div>
            <div className="space-y-2">
              {dataSources.slice(0, 3).map(ds => (
                <div key={ds.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${ds.status === 'connected' ? 'bg-success' : 'bg-error'}`}></div>
                    <span className="text-base-content font-medium">{ds.name}</span>
                    <span className="text-base-content/50 text-sm ml-2">({ds.type})</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-primary btn-sm mt-3">
              <FaCog className="mr-2" />
              Manage Sources
            </button>
          </div>
        </div>

        {/* Dashboard Configuration */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-8">
          <h3 className="text-xl font-bold text-base-content mb-4">Dashboard Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Select Dashboard</span>
              </label>
              <select 
                className="select select-bordered bg-base-200 text-base-content"
                value={selectedDashboard}
                onChange={handleDashboardSelect}
              >
                <option disabled value="">Choose a dashboard</option>
                {predefinedDashboards.map(dashboard => (
                  <option key={dashboard.id} value={dashboard.id}>{dashboard.name}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Data Source</span>
              </label>
              <select 
                className="select select-bordered bg-base-200 text-base-content"
                value={selectedDataSource}
                onChange={(e) => setSelectedDataSource(e.target.value)}
              >
                {dataSources.filter(ds => ds.status === 'connected').map(ds => (
                  <option key={ds.id} value={ds.id}>{ds.name}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Time Range</span>
              </label>
              <select 
                className="select select-bordered bg-base-200 text-base-content"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-primary btn-sm" onClick={handleCreateDashboard}>
              <FaPlus className="mr-2" />
              Create Dashboard
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleImportDashboard}>
              <RiUploadLine className="mr-2" />
              Import Dashboard
            </button>
            <button 
              className="btn btn-accent btn-sm" 
              onClick={handleExportDashboard}
              disabled={!selectedDashboard}
            >
              <RiDownloadLine className="mr-2" />
              Export Dashboard
            </button>
          </div>
        </div>

        {/* Dashboards Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-base-content mb-6">Available Dashboards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predefinedDashboards.map(dashboard => (
              <div key={dashboard.id} className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-base-content mb-1">{dashboard.name}</h4>
                    <span className={`text-sm font-medium ${getCategoryColor(dashboard.category)}`}>
                      {dashboard.category}
                    </span>
                  </div>
                  <div className={`badge ${getStatusBadgeClass(dashboard.status)}`}>
                    {dashboard.status}
                  </div>
                </div>
                
                <p className="text-base-content/70 text-sm mb-3">{dashboard.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base-content/50 text-xs">{dashboard.panels} panels</span>
                  <div className="flex gap-1">
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleViewDashboard(dashboard.id)}
                      title="View Dashboard"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleEditDashboard(dashboard.id)}
                      title="Edit Dashboard"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleCloneDashboard(dashboard.id)}
                      title="Clone Dashboard"
                    >
                      <FaCopy />
                    </button>
                    <button 
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                      title="Delete Dashboard"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
          <h3 className="text-xl font-bold text-base-content mb-4">Dashboard Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-info">
                <RiDashboardLine className="text-2xl" />
              </div>
              <div className="stat-title text-base-content/70">Total Dashboards</div>
              <div className="stat-value text-info">{predefinedDashboards.length}</div>
              <div className="stat-desc text-base-content/50">Across all categories</div>
            </div>

            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-success">
                <RiBarChart2Fill className="text-2xl" />
              </div>
              <div className="stat-title text-base-content/70">Active Dashboards</div>
              <div className="stat-value text-success">
                {predefinedDashboards.filter(d => d.status === 'active').length}
              </div>
              <div className="stat-desc text-base-content/50">Ready to use</div>
            </div>

            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-warning">
                <RiSettings3Line className="text-2xl" />
              </div>
              <div className="stat-title text-base-content/70">Draft Dashboards</div>
              <div className="stat-value text-warning">
                {predefinedDashboards.filter(d => d.status === 'draft').length}
              </div>
              <div className="stat-desc text-base-content/50">In development</div>
            </div>

            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-figure text-primary">
                <SiPrometheus className="text-2xl" />
              </div>
              <div className="stat-title text-base-content/70">Data Sources</div>
              <div className="stat-value text-primary">
                {dataSources.filter(ds => ds.status === 'connected').length}
              </div>
              <div className="stat-desc text-base-content/50">Connected sources</div>
            </div>
          </div>
        </div>
      </div>

    </NavigationDrawer>
  );
}
