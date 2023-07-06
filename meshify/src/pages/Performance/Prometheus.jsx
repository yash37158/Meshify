import React, { useState } from 'react'
import Header from '../../Componets/Header/Header'
import NavigationDrawer from '../../Componets/NavDrawer/NavigationDrawer'
import Footer from '../../Componets/Footer/Footer'
import { SiGrafana, SiPrometheus } from 'react-icons/si';
import { RiBarChart2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

export default function Prometheus() {


  const navigate = useNavigate();

  const handleNavigation = (page) => {
        navigate('/service-mesh-health')
    }
    

  return (
    <>
    <Header/>
    <NavigationDrawer />

      <div className="flex flex-col h-[600px] mr-10 ml-[280px] p-10 mt-10 rounded-md shadow-md bg-[#E8EFF6]">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold">Metrics</h2>
          <RiBarChart2Fill className="text-2xl ml-2" />
        </div>
          <p className="text-lg text-gray-600">Metrics are the key to understanding the health of your system. Meshify provides a way to visualize your metrics in a way that is easy to understand</p>

        <div className="flex items-center mb-4 mt-10">
          <SiGrafana className="text-xl mr-2" />
          <h2 className="text-lg font-semibold">Grafana</h2>
        </div>
        <p className="text-lg text-gray-600" > Unleashing Data Visualization with Grafana</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <select className="border border-gray-300 rounded-md p-4 h-8">
            {/* options for the first select tag */}
          </select>

          <select className="border border-gray-300 rounded-md p-4 h-8">
            {/* options for the second select tag */}
          </select>
        </div>


        <div className="flex items-center mb-4 mt-10">
          <SiPrometheus className="text-xl mr-2" />
          <h2 className="text-lg font-semibold">Prometheus</h2>
        </div>
        <p className="text-lg text-gray-600" > Empowering Monitoring and Alerting with Prometheus</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <select className="border border-gray-300 rounded-md p-4 h-8">
            {/* options for the first select tag */}
          </select>

          <select className="border border-gray-300 rounded-md p-4 h-8">
            {/* options for the second select tag */}
          </select>
        </div>


        {/* Dropdown menu for Metrics */}
        {/* Add your dropdown menu component for Metrics here */}

        {/* Dropdown menu for Grafana */}
        {/* Add your dropdown menu component for Grafana here */}

        {/* Dropdown menu for Prometheus */}
        {/* Add your dropdown menu component for Prometheus here */}

        <button className="mt-10 text-xs float-left mb-4 bg-[#4e72cc] text-white font-bold py-2 px-4 rounded-md" onClick={handleNavigation} >
                Visulalize Metrics
              </button>

      </div>
    
      

    <Footer/>
    </>
  )
}
