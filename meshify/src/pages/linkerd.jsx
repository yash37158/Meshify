import React from 'react'
import { FaCloud, FaCodepen, FaPlus } from 'react-icons/fa'
import { useState, useEffect } from 'react';
import Select from 'react-select';
import Header from '../Componets/Header/Header';
import Footer from '../Componets/Footer/Footer';
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer';
import axios from "axios"
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BarLoader } from 'react-spinners';
import { css } from '@emotion/react';

export default function Linkerd() {

  const [linkerdStatus, setLinkerdStatus] = useState([]);
  const [linkerdSelectedAdapter, setlinkerdSelectedAdapter] = useState("");
  const [serviceNames, setServiceNames] = useState([]);
  const [cardHeight, setCardHeight] = useState('h-64');
  const [selectedAdapter, setSelectedAdapter] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");

  const handleDropdownToggle = () => {
    setOpenDropdown(!openDropdown);
    setCardHeight(openDropdown ? 'h-64' : 'h-[280px]');
  };


  useEffect(() => {
    const fetchLinkerdStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/check-linkerd');
        setLinkerdStatus(response.data);
        toast.success('Linkerd status: ' + response.data);
      } catch (error) {
        console.error('Error fetching Linkerd status:', error);
        toast.error('Error fetching Linkerd status');
      }
    };

    fetchLinkerdStatus();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/api/linkerd-adapters', {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
      .then(response => {
        setServiceNames(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSelectChange = (event) => {
    setSelectedAdapter(event.target.value);
    axios.get(`http://localhost:8080/api/linkerd-adapters?service=${selectedAdapter}`)
    .then(response => {
      console.log(response.data)
      toast.success(`Selected adapter: ${selectedAdapter}, IP address: ${response.data[selectedAdapter]}`);
    })
    .catch(error => {
      console.error("Failed to fetch adapter:", error);
      toast.error("Failed to fetch adapter:", error);
    });
  };



  return (
    <>
    <Header />
    <NavigationDrawer />
    <ToastContainer />
  <div className="flex flex-col h-[600px] mr-10 ml-[280px] p-10 mt-10 rounded-md shadow-md bg-[#E8EFF6]" >
  <div className="flex items-center mb-4">
  <h3 className="text-xl font-bold">Choose Adapter</h3>
  <FaCloud className="text-2xl ml-5" />
  </div>
  <select className="border border-gray-300 rounded-md p-2 h-10 overflow-y-scroll" id="services" value={linkerdSelectedAdapter} onChange={handleSelectChange}>
  {Object.keys(serviceNames).map(serviceNames => (
          <option key={serviceNames} value={serviceNames}>{serviceNames}</option>
        ))}
</select>
  <div className="flex flex-wrap mt-8 -mx-4">
  <div className="w-full md:w-1/3 px-4 mb-8">
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${cardHeight}`}>
        <div className="p-4">
          {/* Card 1 */}
          <h4 className="font-bold text-xl mb-2">Manage lifecycle of service mesh</h4>
          <p className="text-gray-700 text-base">
            Managing your service mesh lifecycle is crucial for the efficient operation of your microservices-based applications. A service mesh can provide essential capabilities such as traffic management, load balancing, service discovery, security, and observability.
          </p>
          <div className="relative">
            <FaPlus className="mt-4 text-xl float-left mb-4" onClick={handleDropdownToggle} />
            {openDropdown && (
              <button className="absolute top-6 left-0 mt-4 mr-4 bg-blue-500 text-white px-4 py-2 rounded-md" >
                Bookinfo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 ">
          <div className="bg-white w-1/2 rounded-lg shadow-lg p-8 w-[500px]">
            <div className="flex items-center mb-4">
              <FaCodepen className="mr-2 text-2xl text-blue-500" />
              <h2 className="font-bold text-lg">Deploy Bookinfo</h2>
            </div>
            <div className="mb-4">
              <label htmlFor="checkbox" className="flex items-center">
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={checkboxChecked}
                  onChange={() => setCheckboxChecked(!checkboxChecked)}
                  className="mr-2"
                />
                <span className="text-gray-700">Agree to deploy Bookinfo in kubernetes cluster</span>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={!checkboxChecked}
                onClick={handleDeployClick}
              >
                Deploy
              </button>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
    <div className="w-full md:w-1/3 px-4 mb-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h4 className="font-bold text-xl mb-2">Manage sample application for service mesh</h4>
          <p className="text-gray-700 text-base">managing service mesh is crucial for organizations that are adopting microservices architecture. It helps to improve application performance, scalability, and security, while also simplifying the management of microservices. </p>
          <FaPlus className="mt-4 text-xl float-left mb-4"/>
        </div>
      </div>
    </div>
    <div className="w-full md:w-1/3 px-4 mb-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h4 className="font-bold text-xl mb-2">Add custom configuration</h4>
          <p className="text-gray-700 text-base">Adding custom configuration to your service mesh is necessary because it allows you to tailor your service mesh to meet the specific needs of your application. By defining custom configurations, you can ensure that your service mesh is optimized for performance, reliability, and security. </p>
          <FaPlus className="mt-4 text-xl float-left mb-4"/>
        </div>
      </div>
    </div>
  </div>
  <ToastContainer />
</div>
<Footer />
    </>
  )
}
