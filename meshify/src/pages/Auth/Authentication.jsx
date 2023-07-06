import React from 'react'
import Header from '../../Componets/Header/Header'
import Footer from '../../Componets/Footer/Footer'
import logo from "../../assets/logo.svg"
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';



export default function Authentication() {
    const [selectedProvider, setSelectedProvider] = useState('Meshify');
    const [isOpen, setIsOpen] = useState(false);
    const providers = ['Meshify', 'None'];
  
    const handleSelectProvider = (provider) => {
        if (provider === 'Meshify') {
            window.location.href = 'http://localhost:8080/auth/github';
          } else {
            window.location.href = 'http://localhost:3000/dashboard';
          }
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
      };
  return (
    <>
        <div class="containe bg-blue-50 flex flex-wrap p-4 flex-col md:flex-row">
        <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <div>
        <img src={logo} alt="Meshify-logo" class="w-fit h-14 text-white p-2  rounded-full" viewBox="0 0 24 24">
      </img>
        </div>
      <span class="ml-3 text-2xl text-[#214DBE]">Meshify</span>
      <span class="text-xl ml-3 italic text-[#214DBE] opacity-80">Provider</span>
    </a>
    </div>
    <div className="flex flex-col h-[600px] m-80 p-10 mt-10 rounded-md shadow-md bg-[#E8EFF6]">
    <div className="flex items-center justify-center ">
    <div className="max-w-sm h-[500px] w-[500px] rounded-md overflow-hidden shadow-lg bg-[#ffff]">
    <img src={logo} class="mx-auto w-32 h-48" alt="Logo" />
    <div className="">
      <div className="font-bold text-xl mb-2 text-center text-[#214DBE]">Meshify</div>
    </div>
    <div className="px-6 py-4">
      <div className="font-semibold text-xl mb-2 text-center text-[#214DBE]">Choose a Provider to continue</div>
    </div>
    <div className="flex justify-center">
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            className="inline-flex justify-between w-[300px]  rounded-md border border-gray-400 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id="options-menu"
            aria-controls="options-menu"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={handleToggleDropdown}
          >
            {selectedProvider}
            <FaChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
        </div>

        {isOpen && (
          <div className="origin-top-right absolute w-[300px] right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {providers.map((provider, index) => (
              <div key={index} className="py-1">
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={() => handleSelectProvider(provider)}
                >
                  {provider}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
    </div>
    <Footer />
    </>

  )
}
