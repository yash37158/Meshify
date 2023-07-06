import React, { useState, useEffect } from 'react'
import Header from '../Componets/Header/Header'
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import Footer from '../Componets/Footer/Footer';
import { FaCloud } from 'react-icons/fa'
import { RiBarChart2Fill } from 'react-icons/ri';
import {BiReset} from 'react-icons/bi';
import axios from 'axios';
import { MdWarningAmber } from 'react-icons/md';

export default function Settings() {
  const [activeWindow, setActiveWindow] = useState('environment');
  const [clusters, setClusters] = useState([]);

  const handleWindowClick = (windowName) => {
    setActiveWindow(windowName);
  };



  useEffect(() => {
    axios.get('http://localhost:8080/api/kube/cluster')
      .then(response => {
        setClusters(response.data.clusters);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
    <Header/>
    <NavigationDrawer />
    <div className="flex flex-col h-[600px] mr-10 ml-[280px] p-10 mt-10 rounded-md shadow-md bg-[#E8EFF6]">
      <div className="container mx-auto">
        <div className="flex justify-center mt-8 ">
          <div className="sm:w-3/4 lg:w-1/2">
            <div className="relative">
              <div className="flex justify-center space-x-60">
                <button
                  className={`window ${activeWindow === 'environment' ? 'active-window' : ''} text-xl font-medium`}
                  onClick={() => handleWindowClick('environment')}
                >
                    <FaCloud className="text-2xl ml-5" />
                  <span className={`tab-text ${activeWindow === 'environment' ? 'text-blue-800' : 'text-gray-500'}`}>Environment</span>
                </button>
                <button
                  className={`window ${activeWindow === 'metrics' ? 'active-window' : ''} text-xl`}
                  onClick={() => handleWindowClick('metrics')}
                >
                   <RiBarChart2Fill className="text-2xl ml-2" />
                  <span className={`tab-text ${activeWindow === 'metrics' ? 'text-blue-800' : 'text-gray-500'}`}>Metrics</span>
                </button>
                <button
                  className={`window ${activeWindow === 'reset' ? 'active-window' : ''} text-xl`}
                  onClick={() => handleWindowClick('reset')}
                >
                  <BiReset className="text-2xl ml-2" />
                  <span className={`tab-text ${activeWindow === 'reset' ? 'text-blue-800' : 'text-gray-500'}`}>Reset</span>
                </button>
              </div>

            </div>

            <div className="w-full flex justify-center mt 10"> {/* Updated: Added justify-center */}
              {activeWindow === 'environment' && (
                <div className="window-content">
                  <h2 className="text-2xl font-bold mt-10"></h2>
                  {/* Environment settings content goes here */}
                  <table className="w-[700px] bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="py-3 px-6 font-medium text-sm uppercase border-b border-gray-200">Context</th>
                        <th className="py-3 px-6 font-medium text-sm uppercase border-b border-gray-200">In Cluster</th>
                        <th className="py-3 px-6 font-medium text-sm uppercase border-b border-gray-200">Active</th>
                        <th className="py-3 px-6 font-medium text-sm uppercase border-b border-gray-200">Server</th>
                      </tr>
                    </thead>
                    <tbody>
                    {clusters.map(cluster => (
                            <tr key={cluster.name}>
                          <td className="py-4 px-6 border-b border-gray-200">{cluster.name}</td>
                          <td className="py-4 px-6 border-b border-gray-200">{cluster.server}</td>
                          <td className="py-4 px-6 border-b border-gray-200">{cluster.isactive}</td>
                          <td className="py-4 px-6 border-b border-gray-200">{cluster.server}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeWindow === 'metrics' && (
                <div className="w-full justify-center">
                  <h2 className="text-lg font-semibold mt-12">Prometheus And Grafana Integration</h2>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                      <select className="border border-gray-300 rounded-md p-4 h-8" defaultValue="option2">
                      <option value="option1">Prometheus Url</option>
                      <option value="option2">Prometheus Url</option>
                      <option value="option3">Prometheus Url</option>
                      </select>

                      <select className="border border-gray-300 rounded-md p-4 h-8">
                      <option value="option1">Prometheus API</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                <select className="border border-gray-300 rounded-md p-4 h-8">
                  <option value="option1">Grafana Url</option>
                </select>

                <select className="border border-gray-300 rounded-md p-4 h-8">
                  <option value="option1">Grafana API</option>
                </select>
              </div>

                </div>
              )}
              {activeWindow === 'reset' && (
                <div className="flex justify-center">
                   <div className="bg-white-800 text-blue-800 py-4 px-6 rounded-md mt-10">
                  <div className="flex items-center">
                    <span className="mr-2"><MdWarningAmber className="text-red-500 text-[30px]" /></span>
                    <span className="font-bold">Warning:</span>
                  </div>
                  <p className="mt-2">
                    Before deleting the deployments, please consider the following:
                  </p>
                  <ul className="mt-2 list-disc list-inside">
                    <li>Ensure that all necessary data has been backed up.</li>
                    <li>Verify the impact of deleting the deployments on your application.</li>
                    <li>Communicate the upcoming deletion to relevant stakeholders.</li>
                    <li>Double-check that the correct deployments are selected for deletion.</li>
                  </ul>
                  <p className="mt-2 font-bold">Note: Deleting deployments is a crucial step and cannot be undone.</p>
                  <div className="mt-6 flex justify-start">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">
                      Flush
                    </button>
                  </div>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
