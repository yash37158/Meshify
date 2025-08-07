import React from 'react';
import { FaShieldAlt, FaNetworkWired, FaPlus, FaCog, FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Header from '../Componets/Header/Header';
import Footer from '../Componets/Footer/Footer';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Cilium() {
  const [ciliumStatus, setCiliumStatus] = useState('checking');
  const [serviceNames, setServiceNames] = useState([]);
  const [selectedAdapter, setSelectedAdapter] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkPolicies, setNetworkPolicies] = useState([]);

  useEffect(() => {
    const fetchCiliumStatus = async () => {
      try {
        setLoading(true);
        // Check if Cilium pods are running in kube-system namespace
        const response = await axios.get('http://localhost:8080/api/kube/workloads');
        setCiliumStatus('active');
        toast.success('Cilium status checked successfully');
      } catch (error) {
        console.error('Error fetching Cilium status:', error);
        setCiliumStatus('inactive');
        toast.error('Error fetching Cilium status');
      } finally {
        setLoading(false);
      }
    };

    fetchCiliumStatus();
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8080/api/adapters', {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
      .then((response) => {
        setServiceNames(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (event) => {
    setSelectedAdapter(event.target.value);
    toast.success(`Selected Cilium service: ${event.target.value}`);
  };

  const handleNetworkPolicyClick = () => {
    toast.info('Network Policy management - Feature coming soon!');
  };

  const handleSecurityPolicyClick = () => {
    toast.info('Security Policy configuration - Feature coming soon!');
  };

  const handleObservabilityClick = () => {
    toast.info('Observability setup - Feature coming soon!');
  };

  const handleLoadBalancingClick = () => {
    toast.info('Load Balancing configuration - Feature coming soon!');
  };

  const handleServiceMeshClick = () => {
    toast.info('Service Mesh integration - Feature coming soon!');
  };

  const handleClusterMeshClick = () => {
    toast.info('Cluster Mesh setup - Feature coming soon!');
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
            <h3 className="text-xl font-bold text-base-content">Cilium CNI & Service Mesh</h3>
            <FaNetworkWired className="text-2xl ml-5 text-primary" />
          </div>

          {/* Cilium Status Badge */}
          <div className="mb-4">
            <div className={`badge gap-2 ${ciliumStatus === 'active' ? 'badge-success' : 'badge-warning'}`}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6" cy="6" r="6" fill="currentColor" />
              </svg>
              Cilium Status: {ciliumStatus === 'active' ? 'Active' : 'Checking...'}
            </div>
          </div>

          <select
            className="select select-bordered w-full max-w-xs bg-base-200 text-base-content"
            id="services"
            value={selectedAdapter}
            onChange={handleSelectChange}
          >
            <option disabled value="">
              Select a Cilium service
            </option>
            {Object.keys(serviceNames).map((serviceName) => (
              <option key={serviceName} value={serviceName}>
                {serviceName}
              </option>
            ))}
          </select>
        </div>

        {/* Main Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Network Policies */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-base-content">
                Network Policy Management
              </h4>
              <p className="text-base-content/70 text-base mb-4">
                Define and enforce network security policies at Layer 3 and Layer 4. Control traffic
                flow between pods, namespaces, and external endpoints with fine-grained rules.
              </p>

              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-circle btn-outline btn-primary">
                  <FaPlus className="text-lg" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300"
                >
                  <li>
                    <button onClick={handleNetworkPolicyClick} className="btn btn-primary btn-sm">
                      Create Network Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2 - Security Policies */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-base-content">
                Security & Identity Management
              </h4>
              <p className="text-base-content/70 text-base mb-4">
                Implement identity-based security policies, mutual TLS authentication, and advanced
                threat detection. Secure your microservices with zero-trust networking.
              </p>

              <button
                className="btn btn-circle btn-outline btn-secondary"
                onClick={handleSecurityPolicyClick}
              >
                <FaShieldAlt className="text-lg" />
              </button>
            </div>
          </div>

          {/* Card 3 - Observability */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
            <div className="p-6">
              <h4 className="font-bold text-xl mb-4 text-base-content">
                Observability & Monitoring
              </h4>
              <p className="text-base-content/70 text-base mb-4">
                Deep network visibility with flow logs, metrics, and tracing. Monitor network
                performance and security events in real-time with Hubble.
              </p>

              <button
                className="btn btn-circle btn-outline btn-accent"
                onClick={handleObservabilityClick}
              >
                <FaEye className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Cilium Specific Features Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-base-content mb-6">Advanced Cilium Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Load Balancing Card */}
            <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">Load Balancing</h4>
                  <p className="text-base-content/60 text-sm">eBPF-based load balancing</p>
                </div>
              </div>
              <button
                className="btn btn-outline btn-primary btn-sm"
                onClick={handleLoadBalancingClick}
              >
                Configure Load Balancer
              </button>
            </div>

            {/* Service Mesh Card */}
            <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">Service Mesh</h4>
                  <p className="text-base-content/60 text-sm">Sidecar-free service mesh</p>
                </div>
              </div>
              <button
                className="btn btn-outline btn-secondary btn-sm"
                onClick={handleServiceMeshClick}
              >
                Enable Service Mesh
              </button>
            </div>

            {/* Cluster Mesh Card */}
            <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content">Cluster Mesh</h4>
                  <p className="text-base-content/60 text-sm">Multi-cluster connectivity</p>
                </div>
              </div>
              <button
                className="btn btn-outline btn-accent btn-sm"
                onClick={handleClusterMeshClick}
              >
                Setup Cluster Mesh
              </button>
            </div>
          </div>
        </div>

        {/* eBPF Programs Status */}
        <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
          <h3 className="text-xl font-bold text-base-content mb-4">eBPF Programs Status</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="text-base-content">Program Type</th>
                  <th className="text-base-content">Status</th>
                  <th className="text-base-content">Nodes</th>
                  <th className="text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-base-content">Network Policy</td>
                  <td>
                    <div className="badge badge-success">Active</div>
                  </td>
                  <td className="text-base-content">3/3</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">View Details</button>
                  </td>
                </tr>
                <tr>
                  <td className="text-base-content">Load Balancer</td>
                  <td>
                    <div className="badge badge-success">Active</div>
                  </td>
                  <td className="text-base-content">3/3</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">View Details</button>
                  </td>
                </tr>
                <tr>
                  <td className="text-base-content">Service Mesh</td>
                  <td>
                    <div className="badge badge-warning">Pending</div>
                  </td>
                  <td className="text-base-content">0/3</td>
                  <td>
                    <button className="btn btn-ghost btn-xs">Enable</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </NavigationDrawer>
  );
}
