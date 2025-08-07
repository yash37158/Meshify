import React, { useState, useEffect } from 'react';
import Header from '../../Componets/Header/Header';
import NavigationDrawer from '../../Componets/NavDrawer/NavigationDrawer';
import Footer from '../../Componets/Footer/Footer';
import { SiPrometheus } from 'react-icons/si';
import { 
  RiBarChart2Fill, 
  RiAlertLine, 
  RiLineChartLine,
  RiPieChartLine,
  RiDashboardLine,
  RiDatabase2Line,
  RiServerLine,
  RiTimeLine
} from 'react-icons/ri';
import { 
  FaCog, 
  FaEye, 
  FaPlus, 
  FaExternalLinkAlt, 
  FaSpinner, 
  FaSync, 
  FaSave, 
  FaTimes,
  FaPlay,
  FaStop,
  FaSearch,
  FaFilter,
  FaDownload,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Only import toast, not ToastContainer
import 'react-toastify/dist/ReactToastify.css';

export default function Prometheus() {
  const navigate = useNavigate();
  const [prometheusStatus, setPrometheusStatus] = useState('checking');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [monitoringStats, setMonitoringStats] = useState({
    active_metrics: 0,
    active_alerts: 0,
    warning_alerts: 0,
    critical_alerts: 0,
    scrape_targets: 0,
    healthy_targets: 0,
    data_retention: '15d',
    storage_size: '0GB'
  });
  const [prometheusService, setPrometheusService] = useState(null);
  const [scrapeTargets, setScrapeTargets] = useState([]);
  const [alertRules, setAlertRules] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [timeRange, setTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  
  // Configuration modal state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showTargetsModal, setShowTargetsModal] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [prometheusConfig, setPrometheusConfig] = useState(null);
  const [configForm, setConfigForm] = useState({
    scrape_interval: '15s',
    retention_time: '15d',
    new_target: '',
    action: 'update_scrape_interval'
  });

  // Enhanced metrics with real-time data simulation
  const [metricsData, setMetricsData] = useState({
    cpu_usage: { value: 0, history: [], unit: '%', color: '#3b82f6' },
    memory_usage: { value: 0, history: [], unit: '%', color: '#10b981' },
    network_io: { value: 0, history: [], unit: 'MB/s', color: '#f59e0b' },
    request_rate: { value: 0, history: [], unit: 'req/s', color: '#ef4444' },
    error_rate: { value: 0, history: [], unit: '%', color: '#8b5cf6' },
    response_time: { value: 0, history: [], unit: 'ms', color: '#06b6d4' }
  });

  const prometheusMetrics = [
    { id: 'cpu_usage', name: 'CPU Usage', description: 'Monitor CPU utilization across nodes', query: 'rate(cpu_usage_seconds_total[5m])' },
    { id: 'memory_usage', name: 'Memory Usage', description: 'Track memory consumption', query: 'memory_usage_bytes / memory_total_bytes * 100' },
    { id: 'network_io', name: 'Network I/O', description: 'Network traffic metrics', query: 'rate(network_io_bytes_total[5m])' },
    { id: 'request_rate', name: 'Request Rate', description: 'HTTP request rate per second', query: 'rate(http_requests_total[5m])' },
    { id: 'error_rate', name: 'Error Rate', description: 'Application error percentage', query: 'rate(http_requests_total{status=~"5.."}[5m])' },
    { id: 'response_time', name: 'Response Time', description: 'Average response latency', query: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))' },
  ];

  // Generate mock time-series data for visualization
  const generateMockData = () => {
    const now = Date.now();
    const dataPoints = 20;
    
    const newMetricsData = { ...metricsData };
    
    Object.keys(newMetricsData).forEach(key => {
      const baseValue = Math.random() * 100;
      const history = [];
      
      for (let i = dataPoints - 1; i >= 0; i--) {
        const timestamp = now - (i * 30000); // 30 second intervals
        const value = Math.max(0, baseValue + (Math.random() - 0.5) * 20);
        history.push({ timestamp, value: parseFloat(value.toFixed(2)) });
      }
      
      newMetricsData[key] = {
        ...newMetricsData[key],
        value: history[history.length - 1].value,
        history
      };
    });
    
    setMetricsData(newMetricsData);
  };

  // Add real-time data streaming support

  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [eventSource, setEventSource] = useState(null);

  // Real-time data streaming
  useEffect(() => {
    if (realTimeEnabled && !eventSource) {
      const es = new EventSource('http://localhost:8080/api/prometheus/metrics/stream');
      
      es.onmessage = (event) => {
        try {
          const newMetricsData = JSON.parse(event.data);
          
          // Update metrics data with real-time values
          const updatedData = { ...metricsData };
          Object.keys(newMetricsData).forEach(key => {
            if (updatedData[key]) {
              const metric = newMetricsData[key];
              updatedData[key] = {
                ...updatedData[key],
                value: metric.value,
                history: metric.history || updatedData[key].history
              };
            }
          });
          
          setMetricsData(updatedData);
          
          // Update other stats if available
          setMonitoringStats(prev => ({
            ...prev,
            active_metrics: Object.keys(newMetricsData).length * 10
          }));
          
        } catch (error) {
          console.error('Error parsing real-time data:', error);
        }
      };
      
      es.onerror = (error) => {
        console.error('EventSource error:', error);
        setRealTimeEnabled(false);
      };
      
      setEventSource(es);
    } else if (!realTimeEnabled && eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [realTimeEnabled]);

  // Enhanced load function for real-time data
  const loadPrometheusData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      // Load all data in parallel with real-time endpoints
      const [statusResponse, statsResponse, metricsResponse, targetsResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/prometheusgrafana/health/status'),
        axios.get('http://localhost:8080/api/monitoring/stats'),
        axios.get('http://localhost:8080/api/prometheus/metrics'),
        axios.get('http://localhost:8080/api/prometheus/targets')
      ]);

      // Process real-time metrics response
      if (metricsResponse.data && metricsResponse.data.metrics) {
        const realTimeMetrics = metricsResponse.data.metrics;
        const updatedData = { ...metricsData };
        
        realTimeMetrics.forEach(metric => {
          if (updatedData[metric.id]) {
            updatedData[metric.id] = {
              ...updatedData[metric.id],
              value: metric.value,
              history: metric.history || []
            };
          }
        });
        
        setMetricsData(updatedData);
        setMetrics(realTimeMetrics);
      }

      // Process other responses...
      if (statusResponse.data && Array.isArray(statusResponse.data)) {
        const prometheus = statusResponse.data.find(service => service.name === 'Prometheus');
        setPrometheusService(prometheus);
        setPrometheusStatus(prometheus?.address ? 'active' : 'inactive');
      }

      if (statsResponse.data) {
        setMonitoringStats(statsResponse.data);
      }

      if (targetsResponse.data && targetsResponse.data.targets) {
        setScrapeTargets(targetsResponse.data.targets);
      }

      if (showLoading) {
        toast.success('Real-time Prometheus data loaded successfully');
      }
    } catch (error) {
      console.error('Error loading Prometheus data:', error);
      setPrometheusStatus('inactive');
      toast.error('Error loading Prometheus data');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh && refreshInterval > 0 && !realTimeEnabled) {
      interval = setInterval(() => {
        loadPrometheusData(false);
        generateMockData();
      }, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, realTimeEnabled]);

  useEffect(() => {
    loadPrometheusData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPrometheusData(false);
    setRefreshing(false);
    toast.success('Data refreshed successfully');
  };

  const handleOpenPrometheus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dashboard/prometheus');
      toast.success('Opening Prometheus dashboard...');
      
      const url = prometheusService?.address || 'http://localhost:9090';
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening Prometheus:', error);
      toast.error('Failed to open Prometheus dashboard');
    }
  };

  const handleConfigureMetrics = async () => {
    setShowConfigModal(true);
    await loadPrometheusConfig();
  };

  const loadPrometheusConfig = async () => {
    try {
      setConfigLoading(true);
      const response = await axios.get('http://localhost:8080/api/prometheus/config');
      
      if (response.data && response.data.config) {
        setPrometheusConfig(response.data.config);
        setConfigForm({
          scrape_interval: response.data.config.scrape_interval || '15s',
          retention_time: response.data.config.retention_time || '15d',
          new_target: '',
          action: 'update_scrape_interval'
        });
      }
    } catch (error) {
      console.error('Error loading Prometheus config:', error);
      toast.error('Failed to load Prometheus configuration');
    } finally {
      setConfigLoading(false);
    }
  };

  const handleConfigSubmit = async () => {
    try {
      setConfigLoading(true);
      
      const configPayload = {
        action: configForm.action,
        config: {}
      };

      switch (configForm.action) {
        case 'update_scrape_interval':
          configPayload.config.scrape_interval = configForm.scrape_interval;
          break;
        case 'update_retention':
          configPayload.config.retention_time = configForm.retention_time;
          break;
        case 'add_scrape_target':
          if (!configForm.new_target) {
            toast.warning('Please enter a target URL');
            return;
          }
          configPayload.config.target = configForm.new_target;
          break;
        case 'reload_config':
          break;
      }

      const response = await axios.put('http://localhost:8080/api/prometheus/config', configPayload);
      
      if (response.data.success) {
        toast.success(response.data.message);
        setShowConfigModal(false);
        await loadPrometheusData(false);
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update Prometheus configuration');
    } finally {
      setConfigLoading(false);
    }
  };

  const handleQuerySubmit = async () => {
    if (!currentQuery.trim()) {
      toast.warning('Please enter a PromQL query');
      return;
    }

    try {
      setConfigLoading(true);
      const response = await axios.post('http://localhost:8080/api/prometheus/query', {
        query: currentQuery,
        time: new Date().toISOString()
      });

      if (response.data && response.data.status === 'success') {
        setQueryResult(response.data.data);
        toast.success('Query executed successfully');
      }
    } catch (error) {
      console.error('Error executing query:', error);
      toast.error('Failed to execute query');
    } finally {
      setConfigLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!selectedMetric) {
      toast.warning('Please select a metric first');
      return;
    }

    try {
      const selectedMetricData = prometheusMetrics.find(m => m.id === selectedMetric);
      const alertRule = {
        name: `High ${selectedMetricData.name}`,
        query: selectedMetricData.query,
        condition: 'greater than',
        threshold: 80,
        duration: '5m'
      };

      const response = await axios.post('http://localhost:8080/api/prometheus/alerts', alertRule);
      toast.success('Alert rule created successfully');
      
      // Refresh alerts list
      setAlertRules(prev => [...prev, { ...alertRule, id: Date.now(), status: 'active' }]);
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error('Failed to create alert rule');
    }
  };

  // Simple line chart component
  const MiniChart = ({ data, color, height = 60 }) => {
    if (!data || data.length === 0) return <div className="w-full h-16 bg-base-300 rounded"></div>;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = height - ((point.value - minValue) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full" style={{ height: height + 20 }}>
        <svg width="100%" height={height + 20} className="overflow-visible">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={points}
            className="drop-shadow-sm"
          />
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <polygon
            fill={`url(#gradient-${color.replace('#', '')})`}
            points={`0,${height} ${points} 100,${height}`}
          />
        </svg>
      </div>
    );
  };

  return (
    <NavigationDrawer>
      <Header />

      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Enhanced Header Section with Real-time Toggle */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <SiPrometheus className="text-3xl mr-4 text-warning" />
              <div>
                <h1 className="text-3xl font-bold text-base-content">Prometheus Monitoring</h1>
                <p className="text-base-content/60">Real-time metrics collection and monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Real-time</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-success" 
                    checked={realTimeEnabled}
                    onChange={(e) => setRealTimeEnabled(e.target.checked)}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Auto Refresh</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    disabled={realTimeEnabled}
                  />
                </label>
            </div>
              {autoRefresh && !realTimeEnabled && (
                <select 
                  className="select select-sm select-bordered"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              )}
              <button 
                className={`btn btn-outline btn-sm ${refreshing ? 'loading' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing || realTimeEnabled}
              >
                {!refreshing && <FaSync className="mr-2" />}
                Refresh
              </button>
            </div>
          </div>

          {/* Status Banner with Real-time Indicator */}
          <div className={`alert ${prometheusStatus === 'active' ? 'alert-success' : 'alert-error'}`}>
              <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${prometheusStatus === 'active' ? 'bg-success' : 'bg-error'} mr-3 ${realTimeEnabled ? 'animate-pulse' : ''}`}></div>
              <div>
                <h3 className="font-semibold">
                  Prometheus Status: {prometheusStatus === 'active' ? 'Active' : 'Inactive'}
                  {realTimeEnabled && <span className="badge badge-success ml-2">LIVE</span>}
                </h3>
                <div className="text-sm opacity-80">
                  {prometheusService?.namespace && `Namespace: ${prometheusService.namespace} | `}
                  {prometheusService?.version && `Version: v${prometheusService.version} | `}
                  Last Updated: {new Date().toLocaleTimeString()}
                  {realTimeEnabled && " | Real-time streaming enabled"}
              </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-sm btn-outline"
                onClick={handleOpenPrometheus}
                disabled={prometheusStatus !== 'active'}
              >
                <FaExternalLinkAlt className="mr-2" />
                Open Dashboard
              </button>
              <button className="btn btn-sm btn-outline" onClick={handleConfigureMetrics}>
                <FaCog className="mr-2" />
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
            <div className="stat-figure text-primary">
              <RiBarChart2Fill className="text-2xl" />
            </div>
            <div className="stat-title text-xs">Active Metrics</div>
            <div className="stat-value text-2xl text-primary">{monitoringStats.active_metrics}</div>
            <div className="stat-desc">Across all targets</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
            <div className="stat-figure text-success">
              <RiServerLine className="text-2xl" />
            </div>
            <div className="stat-title text-xs">Scrape Targets</div>
            <div className="stat-value text-2xl text-success">
              {monitoringStats.healthy_targets}/{monitoringStats.scrape_targets}
            </div>
            <div className="stat-desc">Healthy targets</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
            <div className="stat-figure text-warning">
              <RiAlertLine className="text-2xl" />
            </div>
            <div className="stat-title text-xs">Active Alerts</div>
            <div className="stat-value text-2xl text-warning">{monitoringStats.active_alerts}</div>
            <div className="stat-desc">{monitoringStats.warning_alerts} warn, {monitoringStats.critical_alerts} critical</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
            <div className="stat-figure text-info">
              <RiDatabase2Line className="text-2xl" />
            </div>
            <div className="stat-title text-xs">Data Retention</div>
            <div className="stat-value text-2xl text-info">{monitoringStats.data_retention}</div>
            <div className="stat-desc">Storage period</div>
          </div>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {Object.entries(metricsData).map(([key, data]) => {
            const metric = prometheusMetrics.find(m => m.id === key);
            return (
              <div key={key} className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">{metric?.name}</h3>
                    <p className="text-sm text-base-content/60">{metric?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: data.color }}>
                      {data.value.toFixed(1)}{data.unit}
                    </div>
                    <div className="text-xs text-base-content/50">Current</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <MiniChart data={data.history} color={data.color} />
            </div>
            
                <div className="flex justify-between items-center">
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setCurrentQuery(metric.query);
                      setShowQueryModal(true);
                    }}
                  >
                    <FaEye className="mr-1" />
                    Query
                  </button>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setSelectedMetric(key);
                      handleCreateAlert();
                    }}
                  >
                    <RiAlertLine className="mr-1" />
                    Alert
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setShowQueryModal(true)}
          >
            <FaSearch className="mr-2" />
            Query Builder
          </button>
          
          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => setShowTargetsModal(true)}
          >
            <RiServerLine className="mr-2" />
            View Targets
          </button>
          
          <button 
            className="btn btn-accent btn-lg"
            onClick={handleConfigureMetrics}
          >
            <FaCog className="mr-2" />
            Configuration
              </button>
          
          <button 
            className="btn btn-info btn-lg"
            onClick={() => navigate('/service-mesh-health')}
          >
            <RiDashboardLine className="mr-2" />
            Health Dashboard
              </button>
            </div>

        {/* Scrape Targets Table */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-base-content">Scrape Targets</h3>
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => setShowTargetsModal(true)}
            >
              <FaExpand className="mr-2" />
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Job</th>
                  <th>Health</th>
                  <th>Last Scrape</th>
                  <th>Labels</th>
                </tr>
              </thead>
              <tbody>
                {scrapeTargets.slice(0, 5).map((target, index) => (
                  <tr key={index}>
                    <td className="font-mono text-sm">{target.instance}</td>
                    <td>
                      <div className="badge badge-outline">{target.job}</div>
                    </td>
                    <td>
                      <div className={`badge ${target.health === 'up' ? 'badge-success' : 'badge-error'}`}>
                        {target.health}
                      </div>
                    </td>
                    <td className="text-sm">{new Date(target.lastScrape).toLocaleTimeString()}</td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(target.labels || {}).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="badge badge-ghost text-xs">
                            {key}={value}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Configure Prometheus</h3>
              <button 
                className="btn btn-sm btn-circle"
                onClick={() => setShowConfigModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {configLoading ? (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="form-control">
              <label className="label">
                    <span className="label-text">Configuration Action</span>
              </label>
                  <select 
                    className="select select-bordered"
                    value={configForm.action}
                    onChange={(e) => setConfigForm({...configForm, action: e.target.value})}
                  >
                    <option value="update_scrape_interval">Update Scrape Interval</option>
                    <option value="update_retention">Update Data Retention</option>
                    <option value="add_scrape_target">Add Scrape Target</option>
                    <option value="reload_config">Reload Configuration</option>
              </select>
            </div>

                {configForm.action === 'update_scrape_interval' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Scrape Interval</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered" 
                      value={configForm.scrape_interval}
                      onChange={(e) => setConfigForm({...configForm, scrape_interval: e.target.value})}
                      placeholder="15s"
                    />
                    <label className="label">
                      <span className="label-text-alt">How often to scrape targets (e.g., 15s, 30s, 1m)</span>
                    </label>
                  </div>
                )}

                {configForm.action === 'update_retention' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Data Retention Period</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered" 
                      value={configForm.retention_time}
                      onChange={(e) => setConfigForm({...configForm, retention_time: e.target.value})}
                      placeholder="15d"
                    />
                    <label className="label">
                      <span className="label-text-alt">How long to keep data (e.g., 15d, 30d, 1y)</span>
                    </label>
                  </div>
                )}

                {configForm.action === 'add_scrape_target' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Target URL</span>
                    </label>
                    <input 
                      type="text" 
                      className="input input-bordered" 
                      value={configForm.new_target}
                      onChange={(e) => setConfigForm({...configForm, new_target: e.target.value})}
                      placeholder="localhost:9090"
                    />
                    <label className="label">
                      <span className="label-text-alt">Target to scrape metrics from (host:port)</span>
                    </label>
                  </div>
                )}

                {configForm.action === 'reload_config' && (
                  <div className="alert alert-info">
                    <div>
                      <span>This will reload the Prometheus configuration without restarting the service.</span>
                    </div>
                  </div>
                )}

                {prometheusConfig && (
                  <div className="bg-base-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Current Configuration</h4>
                    <div className="text-sm space-y-1">
                      <div>Scrape Interval: <span className="font-mono">{prometheusConfig.scrape_interval}</span></div>
                      <div>Retention: <span className="font-mono">{prometheusConfig.retention_time}</span></div>
                      <div>Scrape Configs: <span className="font-mono">{prometheusConfig.scrape_configs?.length || 0}</span></div>
                    </div>
                  </div>
                )}

                <div className="modal-action">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowConfigModal(false)}
                  >
                    Cancel
              </button>
                  <button 
                    className={`btn btn-primary ${configLoading ? 'loading' : ''}`}
                    onClick={handleConfigSubmit}
                    disabled={configLoading}
                  >
                    {!configLoading && <FaSave className="mr-2" />}
                    Apply Configuration
              </button>
            </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Query Modal */}
      {showQueryModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">PromQL Query Builder</h3>
              <button 
                className="btn btn-sm btn-circle"
                onClick={() => setShowQueryModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">PromQL Query</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24" 
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  placeholder="Enter your PromQL query here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Time Range</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="5m">Last 5 minutes</option>
                    <option value="1h">Last 1 hour</option>
                    <option value="6h">Last 6 hours</option>
                    <option value="1d">Last 1 day</option>
                    <option value="7d">Last 7 days</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Quick Queries</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    onChange={(e) => e.target.value && setCurrentQuery(e.target.value)}
                    value=""
                  >
                    <option value="">Select a template...</option>
                    {prometheusMetrics.map(metric => (
                      <option key={metric.id} value={metric.query}>{metric.name}</option>
                    ))}
          </select>
                </div>
            </div>

              {queryResult && (
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Query Results</h4>
                  <div className="overflow-x-auto">
                    <pre className="text-sm">{JSON.stringify(queryResult, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="modal-action">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowQueryModal(false)}
                >
                  Close
                </button>
                <button 
                  className={`btn btn-primary ${configLoading ? 'loading' : ''}`}
                  onClick={handleQuerySubmit}
                  disabled={configLoading || !currentQuery.trim()}
                >
                  {!configLoading && <FaPlay className="mr-2" />}
                  Execute Query
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Targets Modal */}
      {showTargetsModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-6xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Scrape Targets</h3>
          <button 
                className="btn btn-sm btn-circle"
                onClick={() => setShowTargetsModal(false)}
          >
                <FaTimes />
          </button>
        </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Target</th>
                    <th>Job</th>
                    <th>Health</th>
                    <th>Last Scrape</th>
                    <th>Labels</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scrapeTargets.map((target, index) => (
                    <tr key={index}>
                      <td className="font-mono text-sm">{target.instance}</td>
                      <td>
                        <div className="badge badge-outline">{target.job}</div>
                      </td>
                      <td>
                        <div className={`badge ${target.health === 'up' ? 'badge-success' : 'badge-error'}`}>
                          {target.health}
                        </div>
                      </td>
                      <td className="text-sm">{new Date(target.lastScrape).toLocaleTimeString()}</td>
                      <td>
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(target.labels || {}).map(([key, value]) => (
                            <div key={key} className="badge badge-ghost text-xs">
                              {key}={value}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-xs btn-outline">
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
      </div>

            <div className="modal-action">
              <button 
                className="btn btn-outline"
                onClick={() => setShowTargetsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </NavigationDrawer>
  );
}
