import React, { useState } from 'react';
import Header from '../../Componets/Header/Header';
import Footer from '../../Componets/Footer/Footer';
import logo from "../../assets/logo.svg";
import { FaChevronDown, FaGithub, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { SiKubernetes } from 'react-icons/si';

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
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center">
            <img src={logo} alt="Meshify-logo" className="w-10 h-10 mr-3" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">Meshify</span>
              <span className="text-sm text-base-content/60">Provider</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="hero min-h-[calc(100vh-200px)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            {/* Logo and Title */}
            <div className="mb-8">
              <img src={logo} className="w-24 h-24 mx-auto mb-4" alt="Meshify Logo" />
              <h1 className="text-5xl font-bold text-primary mb-2">Meshify</h1>
              <p className="text-lg text-base-content/70">
                Kubernetes Service Mesh Management Platform
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center p-6">
                  <SiKubernetes className="text-4xl text-primary mb-2" />
                  <h3 className="card-title text-base">Multi-Mesh Support</h3>
                  <p className="text-sm text-base-content/70">Istio, Linkerd, Cilium</p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center p-6">
                  <FaShieldAlt className="text-4xl text-success mb-2" />
                  <h3 className="card-title text-base">Secure Access</h3>
                  <p className="text-sm text-base-content/70">OAuth & RBAC</p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center p-6">
                  <FaRocket className="text-4xl text-accent mb-2" />
                  <h3 className="card-title text-base">Easy Deploy</h3>
                  <p className="text-sm text-base-content/70">One-click setup</p>
                </div>
              </div>
            </div>

            {/* Authentication Card */}
            <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
              <div className="card-body">
                <h2 className="card-title justify-center text-2xl mb-6">
                  Choose Authentication Provider
                </h2>
                
                {/* Provider Dropdown */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Authentication Provider</span>
                  </label>
                  
                  <div className="dropdown dropdown-end w-full">
                    <div 
                      tabIndex={0} 
                      role="button" 
                      className="btn btn-outline w-full justify-between"
                      onClick={handleToggleDropdown}
                    >
                      <div className="flex items-center">
                        {selectedProvider === 'Meshify' && <FaGithub className="mr-2" />}
                        {selectedProvider}
                      </div>
                      <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isOpen && (
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1">
                        {providers.map((provider, index) => (
                          <li key={index}>
                            <button
                              className="flex items-center"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setIsOpen(false);
                                handleSelectProvider(provider);
                              }}
                            >
                              {provider === 'Meshify' && <FaGithub className="mr-2" />}
                              {provider}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Provider Info */}
                <div className="mt-6">
                  {selectedProvider === 'Meshify' ? (
                    <div className="alert alert-info">
                      <FaGithub className="text-lg" />
                      <div>
                        <h3 className="font-bold">GitHub OAuth</h3>
                        <div className="text-xs">Secure authentication via GitHub</div>
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      <FaShieldAlt className="text-lg" />
                      <div>
                        <h3 className="font-bold">No Authentication</h3>
                        <div className="text-xs">Direct access (not recommended for production)</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="card-actions justify-center mt-6">
                  <button 
                    className={`btn btn-wide ${selectedProvider === 'Meshify' ? 'btn-primary' : 'btn-warning'}`}
                    onClick={() => handleSelectProvider(selectedProvider)}
                  >
                    {selectedProvider === 'Meshify' ? (
                      <>
                        <FaGithub className="mr-2" />
                        Continue with GitHub
                      </>
                    ) : (
                      <>
                        <FaRocket className="mr-2" />
                        Continue without Auth
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-base-content/60">
                By continuing, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
