import React, { useState, useEffect } from 'react'
import { FaPlus, FaUniversalAccess } from 'react-icons/fa'
import Linechart from '../Componets/DashboardComponets/Linechart'
import Header from '../../src/Componets/Header/Header'
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer'
import Footer from '../Componets/Footer/Footer'
import axios from "axios"
import {  RotateSpinner } from 'react-spinners-kit';
import { MdWarningAmber } from 'react-icons/md';


export default function Dashboard() {
  const [workloads, setWorkloads] = useState([]);
  const [error, setError] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/kube/workloads");
        setWorkloads(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
       setError(error)
      }
    };
    

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchClusterInfo() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/kube/cluster");
        setClusters(response.data.clusters);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error(error);
      }
    }

    fetchClusterInfo();
  }, []);



  if (error) {
    return (
      <>
       <div className="bg-[#E8EFF6] text-red-800 py-4 px-6 rounded-md mt-4 ml-10 mr-10 mt-10">
          <div className="flex items-center">
            <span className="mr-2"><MdWarningAmber className="text-2xl" /></span>
            <span className="font-bold">Error:</span>
          </div>
          <p className="mt-2">
            Oops! Something went wrong. Don't panic, but we encountered an error.
          </p>
          <p className="mt-2 font-bold">Error Details:</p>
          <div className="text-red-700 py-2 px-4 rounded-md mt-2">
            {error.message}
          </div>
          <p className="mt-4">Please check your server is working or contact support for assistance.</p>
          <p className="mt-2">In the meantime, why not take a deep breath and enjoy this funky message:</p>
          <p className="mt-4 text-2xl font-bold text-">
            Oops! The gremlins are at it again! 🚀
          </p>
        </div>
      </>
     

    );
  }

  
  return (
    <>
    <Header/>
    <NavigationDrawer />
    <div class="float-right ">
    <div class=" flex-1 inline-flex mr-[100px]">
      <div className="flex">
      <div className="bg-white shadow-md mx-4 my-8 px-4 py-3 rounded-md w-[700px]">
      {loading && (
        <div className="fixed bottom-12 right-9">
          <RotateSpinner size={50} color="#111827" />
        </div>
      )}
  <h3 className="text-xl font-medium mb-2">Kubernetes Workloads</h3>
  <div className="overflow-y-auto max-h-100 mt-10">
    <ul className="border border-gray-300 rounded-md p-4 ">
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Daemons:</p>
        <p className="text-lg font-bold">{workloads.numDaemonSets}</p>
      </li>
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Deployments:</p>
        <p className="text-lg font-bold">{workloads.numDeployments}</p>
      </li>
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Nodes:</p>
        <p className="text-lg font-bold">{workloads.numNodes}</p>
      </li>
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Pod Templates:</p>
        <p className="text-lg font-bold">{workloads.numPodTemplates}</p>
      </li>
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Replication Controllers:</p>
        <p className="text-lg font-bold">{workloads.numReplicationControllers}</p>
      </li>
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Pods:</p>
        <p className="text-lg font-bold">{workloads.numPods}</p>
      </li>
      <li className="flex flex-col space-y-2">
        <p className="font-medium text-gray-600">Number of Services:</p>
        <p className="text-lg font-bold">{workloads.numServices}</p>
      </li>
    </ul>
  </div>
</div>

      <div className="flex flex-col w-3/4 p-4 space-y-4 mt-7">
      <div className="bg-white shadow-md mx-2 p-4 h-[130px] w-[400px]">
        <h3 className="text-xl font-medium mb-2">Connection Status</h3>
        <div>
        <div>
        {clusters.map(cluster => (
          <div 
            key={cluster.name} 
            className={`flex items-center ${cluster.isactive === "true" ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <span className="h-2 w-2 mr-2 rounded-full bg-current"></span>
            <h2>{cluster.name}</h2>
          </div>
        ))}
    </div>


    </div>
      </div>

      <div className="bg-white shadow-md mx-2 p-4 h-[250px] w-[400px]">
        <h3 className="text-xl font-medium mb-2">Service mesh adapters</h3>
        <div className="mt-6">
        <ul className="border border-gray-300 rounded-md p-2 overflow-y-auto max-h-[160px]">
          {workloads.serviceNames &&
            workloads.serviceNames.map((serviceName, index) => (
              <li key={index} className="text-lg">{serviceName}</li>
            ))}
        </ul>
      </div>

      </div>

      <div className="bg-white shadow-md mx-2 p-4 h-[170px] w-[400px]">
        <h3 className="text-xl font-medium mb-2 ">Performance Graph</h3>
        <div className="bg-white rounded-md p-1 flex items-center justify-between mb-2">
        <span className="text-gray-600 mt-2">Prometheus</span>
        <FaPlus className="text-gray-400 text-sm mt-10" />
        </div>
        <div className="bg-white rounded-md p-1 flex items-center justify-between">
        <span className="text-gray-600">Grafana</span>
        <FaPlus className="text-gray-400 text-sm" />
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    <Footer />
    </>
  )
}
