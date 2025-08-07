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
  FaPlay,
  FaCloudDownloadAlt
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Header from '../Componets/Header/Header';
import Footer from '../Componets/Footer/Footer';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RotateSpinner } from 'react-spinners-kit';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Modal from 'react-modal';

export default function Istio() {
  // Enhanced state management
  const [istioStatus, setIstioStatus] = useState({
    is_installed: false,
    cli_available: false,
    version: '',
    components: [],
    namespaces: [],
    services: [],
    virtual_services: [],
    gateways: []
  });
  const [adapters, setAdapters] = useState({});
  const [selectedAdapter, setSelectedAdapter] = useState('');
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(false);
  const [deploymentLoading, setDeploymentLoading] = useState(false);
  const [deploymentStage, setDeploymentStage] = useState('');
  const [installationLoading, setInstallationLoading] = useState(false);
  const [installationStage, setInstallationStage] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [customConfigModal, setCustomConfigModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  const [installModal, setInstallModal] = useState(false);
  const [selectedPod, setSelectedPod] = useState(null);
  const [podLogs, setPodLogs] = useState('');
  const [jsonData, setJsonData] = useState({});
  
  // Add the missing state variables
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('components'); // Default to 'components' tab

  const stageMessages = {
    initialization: 'Initializing deployment process...',
    deploying: 'Deploying Bookinfo application...',
    waiting_for_pods: 'Waiting for pods to be ready...',
    configuring_gateway: 'Configuring Istio gateway...',
    verifying_deployment: 'Verifying deployment status...',
    completed: 'Deployment completed successfully!'
  };

  const installationStageMessages = {
    checking: 'Checking system requirements...',
    downloading: 'Downloading Istio CLI...',
    installing: 'Installing Istio to cluster...',
    configuring: 'Configuring Istio components...',
    verifying: 'Verifying installation...',
    completed: 'Installation completed successfully!'
  };

  useEffect(() => {
    loadIstioData();
  }, []);

  const loadIstioData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadIstioStatus(),
        loadAdapters(),
        loadApplications()
      ]);
    } catch (error) {
      console.error('Error loading Istio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadIstioStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/istio/status');
      const status = {
        is_installed: response.data.is_installed || false,
        cli_available: response.data.cli_available || false,
        version: response.data.version || '',
        components: response.data.components || [],
        namespaces: response.data.namespaces || [],
        services: response.data.services || [],
        virtual_services: response.data.virtual_services || [],
        gateways: response.data.gateways || []
      };
      setIstioStatus(status);
    } catch (error) {
      console.error('Error loading Istio status:', error);
      // Keep the default safe state if API call fails
    }
  };

  const loadAdapters = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/istio/adapters');
      setAdapters(response.data || {});
    } catch (error) {
      console.error('Error loading adapters:', error);
      setAdapters({});
    }
  };

  // Update the loadApplications function to provide real-time updates
  const loadApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/istio/applications/bookinfo/status');
      setApplications(prev => ({ ...prev, bookinfo: response.data }));
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications(prev => ({ ...prev, bookinfo: null }));
    }
  };

  // Add real-time polling for application status
  useEffect(() => {
    // Initial load
    loadApplications();
    
    // Set up polling interval for real-time updates
    const interval = setInterval(() => {
      if (!deploymentLoading) { // Only poll when not actively deploying
        loadApplications();
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [deploymentLoading]);

  // Enhanced handleDeployBookinfo function
  const handleDeployBookinfo = async () => {
    if (deploymentLoading) return;

    setDeploymentLoading(true);
    setDeploymentStage('preparing');

    const deploymentToast = toast.info('🚀 Starting Bookinfo deployment...', {
      autoClose: false,
      closeButton: false
    });

    try {
      const response = await axios.post('http://localhost:8080/api/istio/deploy/bookinfo', {}, {
        timeout: 120000 // 2 minutes timeout
      });
      
      const { success, ingress_ip, message, title } = response.data;
      
      toast.dismiss(deploymentToast);
      
      if (success) {
        toast.success(`✅ ${message}`, { autoClose: 5000 });
        
        if (ingress_ip && ingress_ip !== 'unavailable') {
          toast.info(`🌐 Access your application at: ${ingress_ip}`, { autoClose: 10000 });
        }
        
        if (title) {
          toast.info(`📖 Application: ${title}`, { autoClose: 5000 });
        }
        
        // Start real-time monitoring after deployment
        setTimeout(() => {
          loadApplications();
        }, 2000);
        
        // Continue monitoring for a few cycles to show status updates
        let monitorCount = 0;
        const monitorInterval = setInterval(async () => {
          await loadApplications();
          monitorCount++;
          if (monitorCount >= 6) { // Monitor for 1 minute
            clearInterval(monitorInterval);
          }
        }, 10000);
        
      } else {
        toast.error(`❌ Deployment failed: ${message}`, { autoClose: 8000 });
      }
    } catch (error) {
      toast.dismiss(deploymentToast);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      toast.error(`❌ Deployment failed: ${errorMessage}`, { autoClose: 8000 });
    } finally {
      setDeploymentLoading(false);
      setDeploymentStage('');
    }
  };

  const handleBookinfoClick = () => {
    setModalOpen(true);
  };

  const handleDeployClick = async () => {
    setModalOpen(false);
    setDeploymentLoading(true);
    setDeploymentStage('initialization');
    
    const deploymentToast = toast.info('Starting Bookinfo deployment...', {
      autoClose: false,
      closeButton: false
    });

    try {
      const response = await axios.post('http://localhost:8080/api/istio/deploy/bookinfo', {}, {
        timeout: 120000 // 2 minutes timeout
      });
      
      const { success, ingress_ip, message, title } = response.data;
      
      toast.dismiss(deploymentToast);
      
      if (success) {
        toast.success(`✅ ${message}`, { autoClose: 5000 });
        
        if (ingress_ip && ingress_ip !== 'unavailable') {
          toast.info(`🌐 Access your application at: ${ingress_ip}`, { autoClose: 10000 });
        }
        
        if (title) {
          toast.info(`📖 Application: ${title}`, { autoClose: 5000 });
        }
        
        // Reload application data
        await loadApplications();
      } else {
        toast.error(`❌ Deployment failed: ${message}`, { autoClose: 8000 });
      }
    } catch (error) {
      toast.dismiss(deploymentToast);
      handleDeploymentError(error);
    } finally {
      setDeploymentLoading(false);
      setDeploymentStage('');
    }
  };

  const handleDeploymentError = (error) => {
    let errorMessage = 'Deployment failed!';
    let detailMessage = '';
    
    if (error.response?.data) {
      const { message, error: errorDetail } = error.response.data;
      errorMessage = message || errorMessage;
      detailMessage = errorDetail || '';
    } else if (error.message) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Deployment timed out. This might take longer than expected.';
        detailMessage = 'Please check your cluster status and try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server';
        detailMessage = 'Please ensure the backend server is running on port 8080';
      } else {
        detailMessage = error.message;
      }
    }
    
    toast.error(`❌ ${errorMessage}`, { autoClose: 8000 });
    if (detailMessage) {
      toast.error(`ℹ️ ${detailMessage}`, { autoClose: 10000 });
    }
  };

  const handleDeleteBookinfo = async () => {
    if (!window.confirm('Are you sure you want to delete the Bookinfo application?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete('http://localhost:8080/api/istio/applications/bookinfo');
      toast.success('✅ Bookinfo application deleted successfully');
      setApplications(prev => {
        const updated = { ...prev };
        delete updated.bookinfo;
        return updated;
      });
    } catch (error) {
      toast.error(`❌ Failed to delete application: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdapterSelect = async (adapterName) => {
    setSelectedAdapter(adapterName);
    const adapterInfo = adapters[adapterName];
    if (adapterInfo) {
      toast.success(`✅ Selected adapter: ${adapterName} (IP: ${adapterInfo.ip || 'N/A'})`);
    }
  };

  const handleViewLogs = async (namespace, podName) => {
    setSelectedPod({ namespace, podName });
    setLogsModal(true);
    
    try {
      const response = await axios.get(`http://localhost:8080/api/istio/logs/${namespace}/${podName}`);
      setPodLogs(response.data.logs);
    } catch (error) {
      toast.error(`Failed to load logs: ${error.response?.data?.error || error.message}`);
      setPodLogs('Failed to load logs');
    }
  };

  const handleCustomConfigDeploy = async () => {
    if (!jsonData || Object.keys(jsonData).length === 0) {
      toast.error('Please provide a valid configuration');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:8080/api/istio/deploy/custom', jsonData);
      toast.success('✅ Custom configuration deployed successfully');
      setCustomConfigModal(false);
      setJsonData({});
      await loadIstioStatus(); // Reload status
    } catch (error) {
      toast.error(`❌ Failed to deploy configuration: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIstio = async () => {
    setInstallationLoading(true);
    setInstallationStage('checking');
    
    const installToast = toast.info('Checking Istio CLI availability...', {
      autoClose: false,
      closeButton: false
    });

    try {
      // First check CLI status
      setInstallationStage('downloading');
      toast.update(installToast, {
        render: 'Downloading Istio CLI...',
        type: 'info'
      });

      const downloadResponse = await axios.post('http://localhost:8080/api/istio/download', {}, {
        timeout: 300000 // 5 minutes timeout
      });

      if (downloadResponse.data.success) {
        toast.update(installToast, {
          render: downloadResponse.data.message,
          type: 'success',
          autoClose: 3000,
          closeButton: true
        });

        // Refresh status
        await loadIstioStatus();
        
        // If already installed, show install option
        if (downloadResponse.data.status === 'already_installed') {
          setInstallModal(true);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      toast.update(installToast, {
        render: `Failed to download Istio: ${errorMessage}`,
        type: 'error',
        autoClose: 5000,
        closeButton: true
      });
    } finally {
      setInstallationLoading(false);
      setInstallationStage('');
    }
  };

  const handleInstallIstio = async () => {
    setInstallModal(false);
    setInstallationLoading(true);
    setInstallationStage('installing');
    
    const installToast = toast.info('Installing Istio to cluster...', {
      autoClose: false,
      closeButton: false
    });

    try {
      setInstallationStage('configuring');
      toast.update(installToast, {
        render: 'Configuring Istio components...',
        type: 'info'
      });

      const installResponse = await axios.post('http://localhost:8080/api/istio/install', {}, {
        timeout: 600000 // 10 minutes timeout
      });

      if (installResponse.data.success) {
        setInstallationStage('verifying');
        toast.update(installToast, {
          render: 'Verifying installation...',
          type: 'info'
        });

        // Wait a bit for components to start
        await new Promise(resolve => setTimeout(resolve, 5000));

        setInstallationStage('completed');
        toast.update(installToast, {
          render: 'Istio installed successfully! 🎉',
          type: 'success',
          autoClose: 5000,
          closeButton: true
        });

        // Refresh status
        await loadIstioStatus();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      toast.update(installToast, {
        render: `Failed to install Istio: ${errorMessage}`,
        type: 'error',
        autoClose: 8000,
        closeButton: true
      });
    } finally {
      setInstallationLoading(false);
      setInstallationStage('');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'running': return 'text-success';
      case 'ready': return 'text-success';
      case 'not ready': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'running': return <FaCheck className="text-success" />;
      case 'ready': return <FaCheck className="text-success" />;
      case 'not ready': return <FaExclamationTriangle className="text-warning" />;
      case 'failed': return <FaTimes className="text-error" />;
      default: return <FaSpinner className="animate-spin" />;
    }
  };

  const getInstallationStatus = () => {
    if (!istioStatus.cli_available && !istioStatus.is_installed) {
      return { status: 'not_downloaded', message: 'Download Required', color: 'text-error' };
    } else if (istioStatus.cli_available && !istioStatus.is_installed) {
      return { status: 'downloaded', message: 'Ready to Install', color: 'text-warning' };
    } else if (istioStatus.is_installed) {
      return { status: 'installed', message: 'Installed', color: 'text-success' };
    }
    return { status: 'unknown', message: 'Unknown', color: 'text-base-content' };
  };

  const installStatus = getInstallationStatus();

  return (
    <NavigationDrawer>
    <Header />
      
      <div className="p-4 lg:p-6">
        {/* Loading Indicators */}
        {loading && (
          <div className="fixed bottom-12 right-9 z-50">
            <RotateSpinner size={50} color="#111827" />
          </div>
        )}

        {/* Installation Loading Overlay */}
        {installationLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Installing Istio</h3>
                <p className="text-base-content/70 mb-4">
                  {installationStageMessages[installationStage] || 'Processing...'}
                </p>
                <div className="progress progress-primary">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ 
                      width: installationStage === 'completed' ? '100%' : 
                             installationStage === 'verifying' ? '80%' :
                             installationStage === 'configuring' ? '60%' :
                             installationStage === 'installing' ? '40%' :
                             installationStage === 'downloading' ? '20%' : '10%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deployment Loading Overlay */}
        {deploymentLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="text-center">
                <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Deploying Bookinfo</h3>
                <p className="text-base-content/70 mb-4">
                  {stageMessages[deploymentStage] || 'Processing...'}
                </p>
                <div className="progress progress-primary">
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ 
                      width: deploymentStage === 'completed' ? '100%' : 
                             deploymentStage === 'configuring_gateway' ? '80%' :
                             deploymentStage === 'verifying_deployment' ? '60%' :
                             deploymentStage === 'waiting_for_pods' ? '40%' :
                             deploymentStage === 'deploying' ? '20%' : '10%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Istio Status Header */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-base-content">Istio Service Mesh</h2>
              <FaNetworkWired className="text-3xl ml-3 text-primary" />
            </div>
            <div className="flex space-x-2">
              {/* Download/Install Button */}
              {!istioStatus.is_installed && (
                <button 
                  className={`btn btn-primary btn-sm ${installationLoading ? 'loading' : ''}`}
                  onClick={istioStatus.cli_available ? () => setInstallModal(true) : handleDownloadIstio}
                  disabled={installationLoading}
                >
                  {!installationLoading && (
                    istioStatus.cli_available ? <FaPlay className="mr-2" /> : <FaCloudDownloadAlt className="mr-2" />
                  )}
                  {istioStatus.cli_available ? 'Install Istio' : 'Download Istio'}
                </button>
              )}
              
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => setStatusModal(true)}
              >
                <FaEye className="mr-2" />
                View Details
              </button>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={loadIstioData}
                disabled={loading}
              >
                <FaDownload className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat">
              <div className="stat-title">Installation Status</div>
              <div className={`stat-value text-lg ${installStatus.color}`}>
                {installStatus.message}
              </div>
              <div className="stat-desc">{istioStatus.version || 'N/A'}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Components</div>
              <div className="stat-value text-lg text-primary">
                {istioStatus.components?.length || 0}
              </div>
              <div className="stat-desc">Running components</div>
            </div>
            <div className="stat">
              <div className="stat-title">Services</div>
              <div className="stat-value text-lg text-secondary">
                {istioStatus.services?.length || 0}
              </div>
              <div className="stat-desc">Active services</div>
            </div>
            <div className="stat">
              <div className="stat-title">Virtual Services</div>
              <div className="stat-value text-lg text-accent">
                {istioStatus.virtual_services?.length || 0}
              </div>
              <div className="stat-desc">Traffic rules</div>
            </div>
          </div>
        </div>

        {/* Adapters Section */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-base-content">Istio System Components</h3>
            <FaServer className="text-2xl ml-3 text-primary" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(adapters || {}).map(([name, info]) => (
              <div 
                key={name}
                className={`card bg-base-200 shadow-sm border cursor-pointer transition-all ${
                  selectedAdapter === name ? 'border-primary' : 'border-base-300'
                }`}
                onClick={() => handleAdapterSelect(name)}
              >
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm truncate">{name}</h4>
                    {getStatusIcon(info?.status)}
                  </div>
                  <div className="text-xs space-y-1">
                    <div>IP: {info?.ip || 'N/A'}</div>
                    <div>Ready: {info?.ready || 'N/A'}</div>
                    <div>Age: {info?.age || 'N/A'}</div>
                  </div>
                  <button 
                    className="btn btn-xs btn-outline mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewLogs('istio-system', name);
                    }}
                  >
                    View Logs
                  </button>
                </div>
              </div>
            ))}
      </div>

          {Object.keys(adapters).length === 0 && !loading && (
            <div className="text-center text-base-content/50 py-8">
              <p>No Istio components found</p>
              <p className="text-sm">Make sure Istio is installed and running</p>
            </div>
          )}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Lifecycle Management Card */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-base-content flex items-center">
                <FaCogs className="mr-2" />
                Lifecycle Management
              </h4>
              <p className="text-base-content/70 text-base mb-4">
                Deploy and manage Istio sample applications like Bookinfo to test your service mesh configuration.
              </p>
              
              <div className="space-y-2">
                <button 
                  onClick={handleBookinfoClick} 
                  className="btn btn-primary btn-sm w-full"
                  disabled={deploymentLoading}
                >
                  <FaPlus className="mr-2" />
                  Deploy Bookinfo
                </button>
                
                {applications.bookinfo && (
                  <button 
                    onClick={handleDeleteBookinfo} 
                    className="btn btn-error btn-outline btn-sm w-full"
                    disabled={loading}
                  >
                    <FaTrash className="mr-2" />
                    Remove Bookinfo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Application Status Card */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-base-content flex items-center">
                <FaChartLine className="mr-2" />
                Application Status
              </h4>
              
              {applications.bookinfo ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Bookinfo</span>
                    <span className={`badge ${applications.bookinfo.ready ? 'badge-success' : 'badge-warning'}`}>
                      {applications.bookinfo.status}
                    </span>
                  </div>
                  <div className="text-sm text-base-content/70">
                    Pods: {applications.bookinfo.pods?.length || 0}
                  </div>
                  <div className="text-sm text-base-content/70">
                    Services: {applications.bookinfo.services?.length || 0}
                  </div>
                </div>
              ) : (
                <div className="text-center text-base-content/50">
                  <p>No applications deployed</p>
                  <p className="text-sm">Deploy Bookinfo to see status</p>
                </div>
              )}
            </div>
          </div>

          {/* Custom Configuration Card */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-base-content flex items-center">
                <FaCodepen className="mr-2" />
                Custom Configuration
              </h4>
              <p className="text-base-content/70 text-base mb-4">
                Deploy custom Istio configurations like VirtualServices, Gateways, and DestinationRules.
              </p>
              
              <button
                className="btn btn-secondary btn-sm w-full"
                onClick={() => setCustomConfigModal(true)}
                disabled={loading}
              >
                <FaPlus className="mr-2" />
                Add Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        
        {/* Deploy Bookinfo Modal */}
        {modalOpen && (
          <div className="modal modal-open">
            <div className="modal-box bg-base-100">
              <div className="flex items-center mb-4">
                <FaCodepen className="mr-2 text-2xl text-primary" />
                <h2 className="font-bold text-lg text-base-content">Deploy Bookinfo Application</h2>
    </div>
              
              <div className="alert alert-info mb-4">
                <div>
                  <p>This will deploy the Istio Bookinfo sample application to your Kubernetes cluster.</p>
                  <p className="text-sm mt-1">Make sure you have Istio installed and configured.</p>
        </div>
      </div>
              
              <div className="form-control mb-6">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary mr-3"
                    checked={checkboxChecked}
                    onChange={() => setCheckboxChecked(!checkboxChecked)}
                  />
                  <span className="label-text text-base-content">
                    I understand this will deploy resources to my Kubernetes cluster
                  </span>
                </label>
    </div>
              
              <div className="modal-action">
                <button
                  className={`btn btn-primary ${!checkboxChecked ? 'btn-disabled' : ''}`}
                  disabled={!checkboxChecked || deploymentLoading}
                  onClick={handleDeployClick}
                >
                  {deploymentLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Deploying...
                    </>
                  ) : (
                    'Deploy'
                  )}
                </button>
                <button 
                  className="btn btn-ghost" 
                  onClick={() => setModalOpen(false)}
                  disabled={deploymentLoading}
                >
                  Cancel
              </button>
          </div>
        </div>
      </div>
        )}

        {/* Custom Configuration Modal */}
        {customConfigModal && (
                      <Modal
            isOpen={customConfigModal}
            onRequestClose={() => setCustomConfigModal(false)}
                        contentLabel="Add Custom Configuration"
            className="modal-box bg-base-100 max-w-4xl w-full mx-auto mt-20"
            overlayClassName="modal modal-open"
                      >
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-base-content">Deploy Custom Istio Configuration</h2>
              <button onClick={() => setCustomConfigModal(false)} className="btn btn-ghost btn-circle">
                            <FaTimes />
                          </button>
                        </div>
            
            <div className="mb-4">
              <p className="text-base-content/70">
                Enter your Istio configuration in JSON format (VirtualService, Gateway, DestinationRule, etc.)
              </p>
            </div>
            
            <div className="modal-body mb-6">
                          <JSONInput
                            id="jsonEditor"
                            placeholder={jsonData}
                            locale={locale}
                            height="400px"
                            width="100%"
                            onChange={(value) => setJsonData(value.jsObject)}
                theme="dark_vscode_tribute"
                          />
                        </div>
            
            <div className="modal-action">
              <button 
                onClick={handleCustomConfigDeploy} 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Deploy Configuration
              </button>
                          <button
                onClick={() => setCustomConfigModal(false)} 
                className="btn btn-ghost"
                disabled={loading}
                          >
                Cancel
                          </button>
                        </div>
                      </Modal>
        )}

        {/* Status Details Modal */}
        {statusModal && (
          <Modal
            isOpen={statusModal}
            onRequestClose={() => setStatusModal(false)}
            contentLabel="Istio Status Details"
            className="modal-box bg-base-100 max-w-6xl w-full mx-auto mt-10"
            overlayClassName="modal modal-open"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-base-content">Istio Status Details</h2>
              <button onClick={() => setStatusModal(false)} className="btn btn-ghost btn-circle">
                <FaTimes />
              </button>
            </div>
            
            <div className="tabs tabs-bordered mb-4">
              <button 
                className={`tab ${activeTab === 'components' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('components')}
              >
                Components
              </button>
              <button 
                className={`tab ${activeTab === 'services' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                Services
              </button>
              <button 
                className={`tab ${activeTab === 'traffic' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('traffic')}
              >
                Traffic Management
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {activeTab === 'components' && (
                <div className="space-y-2">
                  {(istioStatus.components || []).map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded">
                      <div>
                        <div className="font-semibold">{component.name}</div>
                        <div className="text-sm text-base-content/70">{component.namespace}</div>
                      </div>
                      <div className="text-right">
                        <div className={`badge ${component.status === 'Running' ? 'badge-success' : 'badge-warning'}`}>
                          {component.status}
                        </div>
                        <div className="text-sm text-base-content/70">{component.ready}</div>
                      </div>
                    </div>
                  ))}
                  {(!istioStatus.components || istioStatus.components.length === 0) && (
                    <div className="text-center text-base-content/50 py-4">
                      No components found
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'services' && (
                <div className="space-y-2">
                  {(istioStatus.services || []).map((service, index) => (
                    <div key={index} className="p-3 bg-base-200 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-sm text-base-content/70">{service.namespace}</div>
                        </div>
                        <div className="badge badge-outline">{service.type}</div>
                      </div>
                      <div className="mt-2 text-sm">
                        <div>Cluster IP: {service.cluster_ip}</div>
                        <div>Ports: {(service.ports || []).map(p => `${p.name}:${p.port}`).join(', ')}</div>
                      </div>
                    </div>
                  ))}
                  {(!istioStatus.services || istioStatus.services.length === 0) && (
                    <div className="text-center text-base-content/50 py-4">
                      No services found
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'traffic' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Virtual Services</h4>
                    {(istioStatus.virtual_services || []).map((vs, index) => (
                      <div key={index} className="p-3 bg-base-200 rounded mb-2">
                        <div className="font-semibold">{vs.name}</div>
                        <div className="text-sm">Hosts: {(vs.hosts || []).join(', ')}</div>
                        <div className="text-sm">Gateways: {(vs.gateways || []).join(', ')}</div>
                      </div>
                    ))}
                    {(!istioStatus.virtual_services || istioStatus.virtual_services.length === 0) && (
                      <div className="text-center text-base-content/50 py-2">
                        No virtual services found
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Gateways</h4>
                    {(istioStatus.gateways || []).map((gw, index) => (
                      <div key={index} className="p-3 bg-base-200 rounded mb-2">
                        <div className="font-semibold">{gw.name}</div>
                        <div className="text-sm">Hosts: {(gw.hosts || []).join(', ')}</div>
                        <div className="text-sm">Port: {gw.port}</div>
                      </div>
                    ))}
                    {(!istioStatus.gateways || istioStatus.gateways.length === 0) && (
                      <div className="text-center text-base-content/50 py-2">
                        No gateways found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Logs Modal */}
        {logsModal && selectedPod && (
          <Modal
            isOpen={logsModal}
            onRequestClose={() => setLogsModal(false)}
            contentLabel="Pod Logs"
            className="modal-box bg-base-100 max-w-6xl w-full mx-auto mt-10"
            overlayClassName="modal modal-open"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-base-content">
                Logs: {selectedPod.podName}
              </h2>
              <button onClick={() => setLogsModal(false)} className="btn btn-ghost btn-circle">
                <FaTimes />
              </button>
            </div>
            
            <div className="bg-base-300 p-4 rounded max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {podLogs || 'Loading logs...'}
              </pre>
  </div>
          </Modal>
        )}

        {/* Installation Confirmation Modal */}
        {installModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Install Istio Service Mesh</h3>
              <div className="py-4">
                <div className="alert alert-info mb-4">
                  <FaServer />
                  <span>Istio CLI is available. Ready to install to your Kubernetes cluster.</span>
                </div>
                <p className="text-base-content/70 mb-4">
                  This will install Istio service mesh with the default configuration profile. 
                  The installation process may take several minutes.
                </p>
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">What will be installed:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Istio control plane components</li>
                    <li>Istio data plane (Envoy proxies)</li>
                    <li>Istio system namespace and services</li>
                    <li>Default injection for labeled namespaces</li>
                  </ul>
                </div>
              </div>
              <div className="modal-action">
                <button 
                  className="btn btn-outline" 
                  onClick={() => setInstallModal(false)}
                  disabled={installationLoading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleInstallIstio}
                  disabled={installationLoading}
                >
                  <FaPlay className="mr-2" />
                  Install Istio
                </button>
              </div>
            </div>
          </div>
        )}
</div>
    
    </NavigationDrawer>
  );
}