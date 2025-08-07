import React, { useState, useEffect } from 'react';
import Header from '../Componets/Header/Header';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import Footer from '../Componets/Footer/Footer';
import { 
  FaCloud, 
  FaCog, 
  FaShieldAlt, 
  FaUserSecret,
  FaDatabase,
  FaNetworkWired,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaUndo,
  FaTrash,
  FaSync,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaServer,
  FaGlobe,
  FaBell,
  FaPalette
} from 'react-icons/fa';
import { 
  RiBarChart2Fill, 
  RiSettings3Line,
  RiShieldLine,
  RiUserSettingsLine,
  RiNotificationLine,
  RiLockPasswordLine
} from 'react-icons/ri';
import { BiReset } from 'react-icons/bi';
import { MdWarningAmber } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('environment');
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    prometheusUrl: 'http://localhost:9090',
    grafanaUrl: 'http://localhost:3001',
    retentionDays: 15,
    alertThreshold: 80
  });
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/kube/cluster');
      setClusters(response.data.clusters);
    } catch (error) {
      console.error('Error fetching clusters:', error);
      toast.error('Failed to fetch cluster information');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
    // Here you would typically save to backend/localStorage
  };

  const handleResetSettings = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setSettings({
      theme: 'dark',
      notifications: true,
      autoRefresh: true,
      prometheusUrl: 'http://localhost:9090',
      grafanaUrl: 'http://localhost:3001',
      retentionDays: 15,
      alertThreshold: 80
    });
    setShowResetModal(false);
    toast.info('Settings reset to defaults');
  };

  const handleFlushData = () => {
    toast.warning('Flushing all data - This action cannot be undone!');
    // Here you would implement the actual flush logic
  };

  const tabs = [
    {
      id: 'environment',
      name: 'Environment',
      icon: FaCloud,
      description: 'Kubernetes cluster configuration'
    },
    {
      id: 'monitoring',
      name: 'Monitoring',
      icon: RiBarChart2Fill,
      description: 'Prometheus and Grafana settings'
    },
    {
      id: 'security',
      name: 'Security',
      icon: FaShieldAlt,
      description: 'Authentication and authorization'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: RiNotificationLine,
      description: 'Alert and notification preferences'
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: FaPalette,
      description: 'Theme and display settings'
    },
    {
      id: 'reset',
      name: 'Reset',
      icon: BiReset,
      description: 'Reset and data management'
    }
  ];

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
            <h2 className="text-2xl font-bold text-base-content">Settings</h2>
            <FaCog className="text-2xl ml-3 text-primary" />
          </div>
          <p className="text-base-content/70 text-lg">
            Configure your service mesh management preferences, monitoring settings, and system preferences.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
          <div className="tabs tabs-boxed bg-base-200">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <TabIcon className="mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
          {/* Environment Tab */}
          {activeTab === 'environment' && (
            <div>
              <h3 className="text-xl font-bold text-base-content mb-4">Kubernetes Cluster Configuration</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="text-base-content">Context</th>
                      <th className="text-base-content">Server</th>
                      <th className="text-base-content">Status</th>
                      <th className="text-base-content">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusters.map(cluster => (
                      <tr key={cluster.name}>
                        <td className="text-base-content font-medium">{cluster.name}</td>
                        <td className="text-base-content/70">{cluster.server}</td>
                        <td>
                          <div className={`badge ${cluster.isactive === 'true' ? 'badge-success' : 'badge-error'}`}>
                            {cluster.isactive === 'true' ? 'Active' : 'Inactive'}
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-ghost btn-xs">
                            <FaEye className="mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div>
              <h3 className="text-xl font-bold text-base-content mb-4">Monitoring Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prometheus Settings */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center">
                    <RiBarChart2Fill className="mr-2 text-warning" />
                    Prometheus Configuration
                  </h4>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Prometheus URL</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered bg-base-100 text-base-content"
                        value={settings.prometheusUrl}
                        onChange={(e) => handleSettingChange('prometheusUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Data Retention (days)</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered bg-base-100 text-base-content"
                        value={settings.retentionDays}
                        onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Grafana Settings */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center">
                    <RiBarChart2Fill className="mr-2 text-info" />
                    Grafana Configuration
                  </h4>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Grafana URL</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered bg-base-100 text-base-content"
                        value={settings.grafanaUrl}
                        onChange={(e) => handleSettingChange('grafanaUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Alert Threshold (%)</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered bg-base-100 text-base-content"
                        value={settings.alertThreshold}
                        onChange={(e) => handleSettingChange('alertThreshold', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h3 className="text-xl font-bold text-base-content mb-4">Security Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center">
                    <FaShieldAlt className="mr-2 text-primary" />
                    Authentication
                  </h4>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Session Timeout (minutes)</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered bg-base-100 text-base-content"
                        defaultValue="30"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text text-base-content">Enable 2FA</span>
                        <input type="checkbox" className="checkbox checkbox-primary" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center">
                    <FaKey className="mr-2 text-secondary" />
                    API Access
                  </h4>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">API Key</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="password"
                          className="input input-bordered bg-base-100 text-base-content"
                          defaultValue="sk-1234567890abcdef"
                        />
                        <button className="btn btn-square btn-outline">
                          <FaEye />
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-secondary btn-sm">
                      <FaSync className="mr-2" />
                      Regenerate Key
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-bold text-base-content mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text text-base-content">Email Notifications</span>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    />
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text text-base-content">Auto Refresh</span>
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={settings.autoRefresh}
                      onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                    />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base-content">Alert Frequency</span>
                  </label>
                  <select className="select select-bordered bg-base-200 text-base-content">
                    <option>Immediate</option>
                    <option>Every 5 minutes</option>
                    <option>Every 15 minutes</option>
                    <option>Every hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <h3 className="text-xl font-bold text-base-content mb-4">Appearance Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3">Theme</h4>
                  <div className="space-y-2">
                    <label className="label cursor-pointer">
                      <span className="label-text text-base-content">Dark Mode</span>
                      <input 
                        type="radio" 
                        name="theme" 
                        className="radio radio-primary" 
                        checked={settings.theme === 'dark'}
                        onChange={() => handleSettingChange('theme', 'dark')}
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text text-base-content">Light Mode</span>
                      <input 
                        type="radio" 
                        name="theme" 
                        className="radio radio-primary" 
                        checked={settings.theme === 'light'}
                        onChange={() => handleSettingChange('theme', 'light')}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3">Display</h4>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-base-content">Dashboard Density</span>
                      </label>
                      <select className="select select-bordered bg-base-100 text-base-content">
                        <option>Compact</option>
                        <option>Normal</option>
                        <option>Comfortable</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Tab */}
          {activeTab === 'reset' && (
            <div>
              <h3 className="text-xl font-bold text-base-content mb-4">Reset & Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center">
                    <BiReset className="mr-2 text-warning" />
                    Reset Settings
                  </h4>
                  <p className="text-base-content/70 text-sm mb-4">
                    Reset all settings to their default values. This action cannot be undone.
                  </p>
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={handleResetSettings}
                  >
                    <BiReset className="mr-2" />
                    Reset to Defaults
                  </button>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold text-base-content mb-3 flex items-center">
                    <FaTrash className="mr-2 text-error" />
                    Flush Data
                  </h4>
                  <p className="text-base-content/70 text-sm mb-4">
                    Clear all cached data and stored metrics. This will reset the application state.
                  </p>
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={handleFlushData}
                  >
                    <FaTrash className="mr-2" />
                    Flush All Data
                  </button>
                </div>
              </div>

              {/* Warning Section */}
              <div className="alert alert-warning mt-6">
                <FaExclamationTriangle className="text-warning" />
                <div>
                  <h4 className="font-bold">Warning</h4>
                  <p className="text-sm">
                    These actions are irreversible. Please ensure you have backed up any important data before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-base-300">
            <button 
              className="btn btn-ghost"
              onClick={() => setActiveTab('environment')}
            >
              <FaUndo className="mr-2" />
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSaveSettings}
            >
              <FaSave className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-base-100">
              <div className="flex items-center mb-4">
                <MdWarningAmber className="text-warning text-2xl mr-3" />
                <h3 className="font-bold text-lg text-base-content">Confirm Reset</h3>
              </div>
              <p className="py-4 text-base-content/70">
                Are you sure you want to reset all settings to their default values? This action cannot be undone.
              </p>
              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={confirmReset}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationDrawer>
  );
}
