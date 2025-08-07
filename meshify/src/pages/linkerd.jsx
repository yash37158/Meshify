import React from 'react';
import { 
  FaCloud, 
  FaCodepen, 
  FaPlus, 
  FaTimes, 
  FaSpinner, 
  FaCheck, 
  FaExclamationTriangle,
  FaTrash,
  FaEye,
  FaNetworkWired,
  FaServer,
  FaCogs,
  FaChartLine,
  FaDownload,
  FaSync,
  FaPlay,
  FaStop
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Header from '../Componets/Header/Header';
import Footer from '../Componets/Footer/Footer';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import axios from 'axios';
import { toast } from 'react-toastify'; // Only import toast
import 'react-toastify/dist/ReactToastify.css';

export default function Linkerd() {
  // Enhanced state management with installation progress
  const [linkerdStatus, setLinkerdStatus] = useState({
    is_installed: false,
    version: '',
    control_plane: { healthy: false, pods: [], services: [] },
    data_plane: { healthy: false, injected_pods: 0, total_pods: 0 },
    components: [],
    services: [],
    metrics: { success_rate: 0, rps: 0, latency_p99: 0 }
  });
  
  const [applications, setApplications] = useState({});
  const [trafficSplits, setTrafficSplits] = useState([]);
  const [serviceProfiles, setServiceProfiles] = useState([]);
  const [loading, setLoading] = useState({
    status: false,
    install: false,
    uninstall: false,
    deploy: false,
    applications: false
  });
  
  // Add installation progress tracking
  const [installationProgress, setInstallationProgress] = useState({
    show: false,
    step: '',
    progress: 0,
    logs: []
  });
  
  const [selectedNamespace, setSelectedNamespace] = useState('default');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showTrafficSplitModal, setShowTrafficSplitModal] = useState(false);

  // Load initial data
  useEffect(() => {
    loadLinkerdStatus();
    loadApplications();
    loadTrafficSplits();
    loadServiceProfiles();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadLinkerdStatus();
      loadApplications();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLinkerdStatus = async () => {
    try {
      setLoading(prev => ({ ...prev, status: true }));
      const response = await axios.get('http://localhost:8080/api/linkerd/status');
        setLinkerdStatus(response.data);
      
      if (response.data.is_installed) {
        toast.success('Linkerd is running and healthy');
      }
      } catch (error) {
        console.error('Error fetching Linkerd status:', error);
      toast.error('Failed to fetch Linkerd status');
      setLinkerdStatus(prev => ({ ...prev, is_installed: false }));
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(prev => ({ ...prev, applications: true }));
      const response = await axios.get(`http://localhost:8080/api/linkerd/applications/${selectedNamespace}/emojivoto/status`);
      setApplications(prev => ({ ...prev, emojivoto: response.data }));
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications(prev => ({ ...prev, emojivoto: null }));
    } finally {
      setLoading(prev => ({ ...prev, applications: false }));
    }
  };

  const loadTrafficSplits = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/linkerd/traffic-splits/${selectedNamespace}`);
      setTrafficSplits(response.data || []);
    } catch (error) {
      console.error('Error loading traffic splits:', error);
      setTrafficSplits([]);
    }
  };

  const loadServiceProfiles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/linkerd/service-profiles/${selectedNamespace}`);
      setServiceProfiles(response.data || []);
    } catch (error) {
      console.error('Error loading service profiles:', error);
      setServiceProfiles([]);
    }
  };

  const handleInstallLinkerd = async () => {
    try {
      setLoading(prev => ({ ...prev, install: true }));
      setInstallationProgress({
        show: true,
        step: 'Starting Linkerd installation...',
        progress: 10,
        logs: ['🚀 Starting Linkerd installation process...']
      });
      setShowInstallModal(false);
      
      toast.info('Installing Linkerd... This may take several minutes');
      
      // Start installation
      const response = await axios.post('http://localhost:8080/api/linkerd/install');
      
      if (response.data.success) {
        // Show completion progress
        setInstallationProgress(prev => ({
          ...prev,
          step: 'Installation completed successfully!',
          progress: 100,
          logs: [...prev.logs, '✅ Linkerd installed successfully!', '🔄 Refreshing status...']
        }));
        
        toast.success('Linkerd installed successfully!');
        
        // Wait a bit then check status and hide progress
        setTimeout(async () => {
          await loadLinkerdStatus();
          setInstallationProgress({ show: false, step: '', progress: 0, logs: [] });
        }, 3000);
        
      } else {
        setInstallationProgress(prev => ({
          ...prev,
          step: 'Installation failed',
          progress: 0,
          logs: [...prev.logs, `❌ Installation failed: ${response.data.message}`]
        }));
        toast.error(`Installation failed: ${response.data.message}`);
        
        setTimeout(() => {
          setInstallationProgress({ show: false, step: '', progress: 0, logs: [] });
        }, 5000);
      }
    } catch (error) {
      console.error('Installation error:', error);
      setInstallationProgress(prev => ({
        ...prev,
        step: 'Installation failed with error',
        progress: 0,
        logs: [...prev.logs, `❌ Error: ${error.response?.data?.message || error.message}`]
      }));
      toast.error('Failed to install Linkerd');
      
      setTimeout(() => {
        setInstallationProgress({ show: false, step: '', progress: 0, logs: [] });
      }, 5000);
      } finally {
      setLoading(prev => ({ ...prev, install: false }));
    }
  };

  // Enhanced installation progress simulation
  const simulateInstallationProgress = () => {
    const steps = [
      { step: 'Downloading Linkerd CLI...', progress: 20, delay: 2000 },
      { step: 'Generating certificates...', progress: 40, delay: 3000 },
      { step: 'Installing control plane...', progress: 60, delay: 5000 },
      { step: 'Deploying proxy injector...', progress: 80, delay: 3000 },
      { step: 'Verifying installation...', progress: 95, delay: 2000 }
    ];

    let currentStep = 0;
    const updateProgress = () => {
      if (currentStep < steps.length) {
        const current = steps[currentStep];
        setInstallationProgress(prev => ({
          ...prev,
          step: current.step,
          progress: current.progress,
          logs: [...prev.logs, `📦 ${current.step}`]
        }));
        
        setTimeout(() => {
          currentStep++;
          updateProgress();
        }, current.delay);
      }
    };
    
    updateProgress();
  };

  // Start progress simulation when installation begins
  const handleInstallLinkerdWithProgress = async () => {
    setLoading(prev => ({ ...prev, install: true }));
    setInstallationProgress({
      show: true,
      step: 'Preparing installation...',
      progress: 5,
      logs: ['🚀 Initializing Linkerd installation...']
    });
    setShowInstallModal(false);
    
    // Start progress simulation
    simulateInstallationProgress();
    
    // Actual API call
    try {
      const response = await axios.post('http://localhost:8080/api/linkerd/install');
      
      if (response.data.success) {
        setInstallationProgress(prev => ({
          ...prev,
          step: '✅ Installation completed successfully!',
          progress: 100,
          logs: [...prev.logs, '🎉 Linkerd is now ready to use!']
        }));
        
        toast.success('Linkerd installed successfully!');
        
        setTimeout(async () => {
          await loadLinkerdStatus();
          setInstallationProgress({ show: false, step: '', progress: 0, logs: [] });
        }, 3000);
        
      } else {
        throw new Error(response.data.message || 'Installation failed');
      }
    } catch (error) {
      setInstallationProgress(prev => ({
        ...prev,
        step: '❌ Installation failed',
        progress: 0,
        logs: [...prev.logs, `Error: ${error.response?.data?.message || error.message}`]
      }));
      toast.error('Failed to install Linkerd');
      
      setTimeout(() => {
        setInstallationProgress({ show: false, step: '', progress: 0, logs: [] });
      }, 5000);
    } finally {
      setLoading(prev => ({ ...prev, install: false }));
    }
  };

  const handleUninstallLinkerd = async () => {
    try {
      setLoading(prev => ({ ...prev, uninstall: true }));
      toast.info('Uninstalling Linkerd...');
      
      const response = await axios.delete('http://localhost:8080/api/linkerd/uninstall');
      
      if (response.data.success) {
        toast.success('Linkerd uninstalled successfully');
        loadLinkerdStatus();
      } else {
        toast.error(`Uninstallation failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Uninstallation error:', error);
      toast.error('Failed to uninstall Linkerd');
    } finally {
      setLoading(prev => ({ ...prev, uninstall: false }));
    }
  };

  const handleDeployEmojivoto = async () => {
    try {
      setLoading(prev => ({ ...prev, deploy: true }));
      toast.info('Deploying Emojivoto sample application...');
      
      const response = await axios.post(`http://localhost:8080/api/linkerd/applications/${selectedNamespace}/emojivoto/deploy`);
      
      if (response.data.success) {
        toast.success('Emojivoto deployed successfully!');
        setTimeout(() => loadApplications(), 5000);
      } else {
        toast.error(`Deployment failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error('Failed to deploy Emojivoto');
    } finally {
      setLoading(prev => ({ ...prev, deploy: false }));
    }
  };

  const handleDeleteEmojivoto = async () => {
    try {
      toast.info('Deleting Emojivoto application...');
      
      const response = await axios.delete(`http://localhost:8080/api/linkerd/applications/${selectedNamespace}/emojivoto`);
      
      if (response.data.success) {
        toast.success('Emojivoto deleted successfully');
        loadApplications();
      } else {
        toast.error(`Deletion failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Deletion error:', error);
      toast.error('Failed to delete Emojivoto');
    }
  };

  const handleCreateTrafficSplit = async (splitConfig) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/linkerd/traffic-splits/${selectedNamespace}`, splitConfig);
      
      if (response.data.success) {
        toast.success('Traffic split created successfully');
        loadTrafficSplits();
      } else {
        toast.error(`Failed to create traffic split: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Traffic split error:', error);
      toast.error('Failed to create traffic split');
    }
  };

  const getStatusBadge = (isHealthy, label) => {
    return (
      <div className={`badge gap-2 ${isHealthy ? 'badge-success' : 'badge-error'}`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill="currentColor" />
        </svg>
        {label}: {isHealthy ? 'Healthy' : 'Unhealthy'}
      </div>
    );
  };

  return (
    <NavigationDrawer>
      <Header />

      <div className="p-4 lg:p-6">
        {/* Installation Progress Modal */}
        {installationProgress.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FaSpinner className="animate-spin mr-2 text-primary" />
                Installing Linkerd
              </h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-base-300 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${installationProgress.progress}%` }}
                ></div>
              </div>
              
              {/* Current Step */}
              <div className="mb-4">
                <p className="text-sm font-medium text-base-content mb-2">
                  {installationProgress.step}
                </p>
                <p className="text-xs text-base-content/60">
                  {installationProgress.progress}% Complete
                </p>
              </div>
              
              {/* Installation Logs */}
              <div className="bg-base-200 rounded p-3 max-h-32 overflow-y-auto">
                <div className="text-xs font-mono space-y-1">
                  {installationProgress.logs.map((log, index) => (
                    <div key={index} className="text-base-content/80">
                      {log}
  </div>
                  ))}
                </div>
              </div>
              
              {/* Estimated Time */}
              <div className="mt-4 text-center">
                <p className="text-xs text-base-content/60">
                  ⏱️ Estimated time: 3-5 minutes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Section with Status */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-xl font-bold text-base-content">Linkerd Service Mesh</h3>
            <FaCloud className="text-2xl ml-5 text-primary" />
            </div>
            <button 
              onClick={loadLinkerdStatus}
              className="btn btn-circle btn-outline btn-sm"
              disabled={loading.status || installationProgress.show}
            >
              <FaSync className={loading.status ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Installation</div>
              <div className="stat-value text-sm">
                {loading.install ? (
                  <span className="text-warning flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Installing...
                  </span>
                ) : linkerdStatus.is_installed ? (
                  <span className="text-success">Installed</span>
                ) : (
                  <span className="text-error">Not Installed</span>
                )}
              </div>
              <div className="stat-desc">{linkerdStatus.version}</div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Control Plane</div>
              <div className="stat-value text-sm">
                {linkerdStatus.control_plane?.healthy ? (
                  <span className="text-success">Healthy</span>
                ) : (
                  <span className="text-error">Unhealthy</span>
                )}
              </div>
              <div className="stat-desc">
                {linkerdStatus.control_plane?.pods?.length || 0} pods
              </div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Data Plane</div>
              <div className="stat-value text-sm">
                {linkerdStatus.data_plane?.injected_pods || 0}/{linkerdStatus.data_plane?.total_pods || 0}
              </div>
              <div className="stat-desc">Injected Pods</div>
            </div>

            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-title">Success Rate</div>
              <div className="stat-value text-sm text-success">
                {linkerdStatus.metrics?.success_rate?.toFixed(1) || 0}%
              </div>
              <div className="stat-desc">
                {linkerdStatus.metrics?.rps?.toFixed(1) || 0} RPS
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {!linkerdStatus.is_installed ? (
              <button 
                onClick={() => setShowInstallModal(true)}
                className="btn btn-primary"
                disabled={loading.install || installationProgress.show}
              >
                {loading.install ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Installing...
                  </>
                ) : (
                  <>
                    <FaDownload className="mr-2" />
                    Install Linkerd
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleUninstallLinkerd}
                className="btn btn-error"
                disabled={loading.uninstall || installationProgress.show}
              >
                {loading.uninstall ? <FaSpinner className="animate-spin mr-2" /> : <FaTrash className="mr-2" />}
                Uninstall Linkerd
              </button>
            )}

          <select
              className="select select-bordered select-sm"
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              disabled={installationProgress.show}
            >
              <option value="default">default</option>
              <option value="linkerd">linkerd</option>
              <option value="emojivoto">emojivoto</option>
          </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Plane Components */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <FaServer className="mr-2 text-primary" />
              Control Plane Components
              </h4>
            
            {loading.status ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-2xl" />
              </div>
            ) : (
              <div className="space-y-2">
                {linkerdStatus.components && linkerdStatus.components.length > 0 ? (
                  linkerdStatus.components.map((component, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-base-200 rounded">
                      <span className="font-medium">{component.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-sm ${component.ready ? 'badge-success' : 'badge-error'}`}>
                          {component.ready ? 'Ready' : 'Not Ready'}
                        </span>
                        <span className="text-xs text-base-content/60">
                          {component.restarts} restarts
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/60 text-center py-4">
                    {linkerdStatus.is_installed ? 'Loading components...' : 'Linkerd not installed'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Application Status */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <FaCodepen className="mr-2 text-secondary" />
              Application Status
            </h4>
            
            {loading.applications ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-2xl" />
              </div>
            ) : applications.emojivoto ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Emojivoto</span>
                  <span className="badge badge-success">Running</span>
                </div>
                <div className="text-sm text-base-content/70">
                  <div>Pods: {applications.emojivoto.total_pods}</div>
                  <div>Injected: {applications.emojivoto.injected_pods}</div>
                  <div>Success Rate: {applications.emojivoto.success_rate?.toFixed(1)}%</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(`http://localhost:8080/api/linkerd/applications/${selectedNamespace}/emojivoto/proxy`, '_blank')}
                    className="btn btn-outline btn-sm"
                  >
                    <FaEye className="mr-1" /> View App
                  </button>
                  <button 
                    onClick={handleDeleteEmojivoto}
                    className="btn btn-error btn-sm"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-base-content/60 mb-3">No applications deployed</p>
                <button 
                  onClick={handleDeployEmojivoto}
                  className="btn btn-primary btn-sm"
                  disabled={loading.deploy || !linkerdStatus.is_installed || installationProgress.show}
                >
                  {loading.deploy ? <FaSpinner className="animate-spin mr-2" /> : <FaPlay className="mr-2" />}
                  Deploy Emojivoto
                </button>
              </div>
            )}
          </div>

          {/* Traffic Management */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <FaNetworkWired className="mr-2 text-accent" />
              Traffic Management
            </h4>
            
            <div className="space-y-4">
              {/* Traffic Splits */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Traffic Splits</span>
                  <button 
                    onClick={() => setShowTrafficSplitModal(true)}
                    className="btn btn-outline btn-xs"
                    disabled={!linkerdStatus.is_installed || installationProgress.show}
                  >
                    <FaPlus className="mr-1" /> Add
                    </button>
                </div>
                <div className="text-sm">
                  {trafficSplits && trafficSplits.length > 0 ? (
                    trafficSplits.map((split, index) => (
                      <div key={index} className="p-2 bg-base-200 rounded mb-2">
                        <div className="font-medium">{split.name}</div>
                        <div className="text-xs text-base-content/60">
                          Service: {split.service}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-base-content/60">No traffic splits configured</p>
                  )}
                </div>
              </div>

              {/* Service Profiles */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Service Profiles</span>
                  <span className="badge badge-outline badge-sm">
                    {serviceProfiles?.length || 0}
                  </span>
                </div>
                <div className="text-sm">
                  {serviceProfiles && serviceProfiles.length > 0 ? (
                    serviceProfiles.slice(0, 3).map((profile, index) => (
                      <div key={index} className="p-2 bg-base-200 rounded mb-2">
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-xs text-base-content/60">
                          Routes: {profile.routes?.length || 0}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-base-content/60">No service profiles found</p>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>

        {/* Services Grid */}
        {linkerdStatus.services && linkerdStatus.services.length > 0 && (
          <div className="mt-6 bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <FaCogs className="mr-2 text-info" />
              Linkerd Services
              </h4>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Namespace</th>
                    <th>Type</th>
                    <th>Cluster IP</th>
                    <th>Ports</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {linkerdStatus.services.map((service, index) => (
                    <tr key={index}>
                      <td className="font-medium">{service.name}</td>
                      <td>{service.namespace}</td>
                      <td>
                        <span className="badge badge-outline badge-sm">
                          {service.type}
                        </span>
                      </td>
                      <td className="font-mono text-sm">{service.cluster_ip}</td>
                      <td className="text-sm">{service.ports?.join(', ')}</td>
                      <td className="text-sm text-base-content/60">{service.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Install Modal */}
      {showInstallModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Install Linkerd Service Mesh</h3>
            <div className="alert alert-info mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Installation typically takes 3-5 minutes</span>
            </div>
            <p className="py-4">
              This will install Linkerd service mesh on your Kubernetes cluster. 
              The installation includes:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>✅ Linkerd control plane components</li>
              <li>✅ Linkerd proxy injector</li>
              <li>✅ Linkerd dashboard and web UI</li>
              <li>✅ Prometheus metrics collection</li>
              <li>✅ Grafana dashboards integration</li>
            </ul>
            <div className="bg-base-200 p-3 rounded mb-4">
              <p className="text-sm text-base-content/70">
                <strong>Note:</strong> You'll see a detailed progress indicator during installation 
                with real-time updates and logs.
              </p>
            </div>
            <div className="modal-action">
              <button
                onClick={handleInstallLinkerdWithProgress}
                className="btn btn-primary"
                disabled={loading.install}
              >
                {loading.install ? <FaSpinner className="animate-spin mr-2" /> : <FaDownload className="mr-2" />}
                Start Installation
              </button>
              <button
                onClick={() => setShowInstallModal(false)}
                className="btn btn-ghost"
                disabled={loading.install}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Split Modal */}
      {showTrafficSplitModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create Traffic Split</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Service Name</label>
                <input type="text" className="input input-bordered w-full" placeholder="web-svc" />
                </div>
                <div>
                <label className="label">Backend 1</label>
                <input type="text" className="input input-bordered w-full" placeholder="web-v1" />
                </div>
              <div>
                <label className="label">Weight 1</label>
                <input type="number" className="input input-bordered w-full" placeholder="90" />
              </div>
              <div>
                <label className="label">Backend 2</label>
                <input type="text" className="input input-bordered w-full" placeholder="web-v2" />
                </div>
                <div>
                <label className="label">Weight 2</label>
                <input type="number" className="input input-bordered w-full" placeholder="10" />
                </div>
              </div>
            <div className="modal-action">
              <button 
                onClick={() => {
                  // Handle traffic split creation
                  setShowTrafficSplitModal(false);
                }}
                className="btn btn-primary"
              >
                Create
              </button>
              <button 
                onClick={() => setShowTrafficSplitModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
        </div>
      </div>
    </div>
      )}

    </NavigationDrawer>
  );
}
