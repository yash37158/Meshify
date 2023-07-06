import React, { useEffect, useState } from 'react'
import NavigationDrawer from '../Componets/NavDrawer/NavigationDrawer'
import Header from '../Componets/Header/Header'
import Footer from '../Componets/Footer/Footer'
import { toast, ToastContainer } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { RotateSpinner } from "react-spinners-kit";

function ServiceMeshHealth() {
    const [loading, setLoading] = useState(false);
    const [setFetchedUrl] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/prometheusgrafana/health/status');
          const data = response.data;
    
          data.forEach((service) => {
            const { name, address } = service;
            toast.info(`${name}: ${address}`);
            setLoading(false);
          });
        } catch (error) {

          console.error('Error fetching data:', error);
          toast.error('Error fetching integrations');
        }
      };

      const fetchUrl = async () => {
        try {
          const response = await axios.get("/api/dashboard/prometheus");
          const { data } = response;
          
          if (response.status === 200) {
            setFetchedUrl(data);
            window.open(data, "_blank");
          } else {
            // Handle other status codes if needed
          }
        } catch (error) {
          console.log(error);
          // Handle the error
        }
      };


  return (
    <>
     <Header/>
    <NavigationDrawer />
    <div className="flex flex-col h-[600px] mr-10 ml-[280px] p-10 mt-10 rounded-md shadow-md bg-[#E8EFF6]">
    {loading && (
        <div className="fixed bottom-12 right-9">
          <RotateSpinner size={50} color="#111827" />
        </div>
      )}
    <h2 className="text-2xl font-medium mb-2 ">Service Mesh Health</h2>
    <p className="text-lg text-gray-600 mt" > Ensuring the Well-being of your Service Mesh</p>

    <div className="flex flex-wrap mt-8 -mx-4">
  <div className="w-full md:w-1/1 px-4 mb-8">
    <div className={"bg-white rounded-lg shadow-lg overflow-hidden h-64"}>
        <div className="p-4">
          {/* Card 1 */}
          <h4 className="font-bold text-xl mb-2">Prometheus</h4>
          <p className="text-gray-700 text-base">
          Prometheus is an open-source monitoring and alerting toolkit that collects and stores time-series data, allowing you to gain insights into the performance, health, and behavior of your applications and infrastructure.
          </p>
          <div className="mt-2 ml-4">
          <ul className="list-disc list-inside">
                <li>Make sure Prometheus and Grafana are working fine</li>
                <li>BookInfo Application is accessible</li>
            </ul>
          </div>
         
          <div className="flex justify-end mr-6 mt-8">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-[#4c70cc] focus:outline-none" onClick={fetchUrl}>
                      View Dashboard
                    </button>
            
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
    <ToastContainer />
    <Footer/>
    </>

  )
}

export default ServiceMeshHealth