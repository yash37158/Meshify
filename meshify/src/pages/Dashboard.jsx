import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Linechart from '../Componets/DashboardComponets/Linechart';
import Header from '../../src/Componets/Header/Header';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import Footer from '../Componets/Footer/Footer';
import axios from 'axios';
import { RotateSpinner } from 'react-spinners-kit';
import { MdWarningAmber } from 'react-icons/md';

export default function Dashboard() {
  const [workloads, setWorkloads] = useState({});
  const [error, setError] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/kube/workloads');
        setWorkloads(response.data || {});
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchClusterInfo() {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/kube/cluster');
        setClusters(response.data?.clusters || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setClusters([]);
        console.error(error);
      }
    }

    fetchClusterInfo();
  }, []);

  if (error) {
    return (
      <NavigationDrawer>
        <Header />
        <div className="bg-[#E8EFF6] text-red-800 py-4 px-6 rounded-md mt-10 mx-10">
          <div className="flex items-center">
            <span className="mr-2">
              <MdWarningAmber className="text-2xl" />
            </span>
            <span className="font-bold">Error:</span>
          </div>
          <p className="mt-2">Oops! Something went wrong. Don't panic, but we encountered an error.</p>
          <p className="mt-2 font-bold">Error Details:</p>
          <div className="text-red-700 py-2 px-4 rounded-md mt-2">{error.message}</div>
          <p className="mt-4">Please check your server is working or contact support for assistance.</p>
          <p className="mt-2">In the meantime, why not take a deep breath and enjoy this funky message:</p>
          <p className="mt-4 text-2xl font-bold">Oops! The gremlins are at it again! 🚀</p>
        </div>
        <Footer />
      </NavigationDrawer>
    );
  }

  return (
    <NavigationDrawer>
      <Header />
      <div className="p-4 lg:p-6">
        {loading && (
          <div className="fixed bottom-12 right-9 z-50">
            <RotateSpinner size={50} color="#111827" />
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Kubernetes Workloads - Full width on mobile, 2 cols on xl */}
          <div className="xl:col-span-2 bg-base-100 shadow-md rounded-lg p-6 border border-base-300">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Kubernetes Workloads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300">
                <span className="font-medium text-base-content/70">DaemonSets:</span>
                <span className="text-lg font-bold text-blue-600">{workloads.numDaemonSets || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300">
                <span className="font-medium text-base-content/70">Deployments:</span>
                <span className="text-lg font-bold text-green-600">{workloads.numDeployments || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300">
                <span className="font-medium text-base-content/70">Nodes:</span>
                <span className="text-lg font-bold text-purple-600">{workloads.numNodes || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300">
                <span className="font-medium text-base-content/70">Pod Templates:</span>
                <span className="text-lg font-bold text-orange-600">{workloads.numPodTemplates || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300">
                <span className="font-medium text-base-content/70">Replication Controllers:</span>
                <span className="text-lg font-bold text-red-600">{workloads.numReplicationControllers || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300">
                <span className="font-medium text-base-content/70">Pods:</span>
                <span className="text-lg font-bold text-indigo-600">{workloads.numPods || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-base-200 rounded border border-base-300 md:col-span-2">
                <span className="font-medium text-base-content/70">Services:</span>
                <span className="text-lg font-bold text-teal-600">{workloads.numServices || 0}</span>
              </div>
            </div>
          </div>

          {/* Right column - Connection Status */}
          <div className="bg-base-100 shadow-md rounded-lg p-6 border border-base-300">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Connection Status</h3>
            <div className="space-y-3">
              {Array.isArray(clusters) && clusters.length > 0 ? (
                clusters.map((cluster) => (
                  <div
                    key={cluster.name}
                    className={`flex items-center p-3 rounded-lg border ${
                      cluster.isactive === 'true' 
                        ? 'bg-success/10 text-success border-success/30' 
                        : 'bg-base-200 text-base-content/50 border-base-300'
                    }`}
                  >
                    <span className={`h-3 w-3 mr-3 rounded-full ${
                      cluster.isactive === 'true' ? 'bg-success' : 'bg-base-content/30'
                    }`}></span>
                    <span className="font-medium">{cluster.name}</span>
                  </div>
                ))
              ) : (
                <div className="text-base-content/50 text-center py-4">No clusters connected</div>
              )}
            </div>
          </div>

          {/* Performance Chart - Full width */}
          <div className="xl:col-span-3 bg-base-100 shadow-md rounded-lg p-6 border border-base-300">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Performance Metrics</h3>
            <div className="h-80">
              <Linechart />
            </div>
          </div>

          {/* Service Mesh Adapters */}
          <div className="xl:col-span-2 bg-base-100 shadow-md rounded-lg p-6 border border-base-300">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Service Mesh Adapters</h3>
            <div className="max-h-60 overflow-y-auto">
              {Array.isArray(workloads.serviceNames) && workloads.serviceNames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {workloads.serviceNames.map((serviceName, index) => (
                    <div key={index} className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                      <span className="text-primary font-medium">{serviceName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-base-content/50 text-center py-8">No service mesh adapters found</div>
              )}
            </div>
          </div>

          {/* Performance Tools */}
          <div className="bg-base-100 shadow-md rounded-lg p-6 border border-base-300">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Performance Tools</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg border border-warning/30 hover:bg-warning/20 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="font-medium text-warning">Prometheus</span>
                </div>
                <FaPlus className="text-warning" />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/30 hover:bg-secondary/20 transition-colors cursor-pointer">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <span className="font-medium text-secondary">Grafana</span>
                </div>
                <FaPlus className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </NavigationDrawer>
  );
}
