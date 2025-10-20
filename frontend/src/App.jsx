import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, FileText, DollarSign, Briefcase, Car, Home, Settings, Sparkles, CheckCircle, ExternalLink, Download } from 'lucide-react'
import { ethers } from 'ethers'
import { P2PLoanForm, BusinessPartnershipForm, VehicleSaleForm, PropertySaleForm, ServiceAgreementForm, CustomContractForm } from './components/TemplateForms'
import { PathSelection } from './components/PathSelection'
import { DecisionTree } from './components/DecisionTree'
import { AIAssistant } from './components/AIAssistant'
import { FileUpload } from './components/FileUpload'
import { deploySmartContract } from './utils/deployment'
import './App.css'

const CONTRACT_TEMPLATES = [
  {
    id: 'peer-loan',
    title: 'Peer-to-Peer Loan',
    icon: DollarSign,
    description: 'Lend or borrow money with clear terms',
    color: 'from-cyan-400 to-blue-500',
    accentColor: '#06b6d4',
    component: P2PLoanForm
  },
  {
    id: 'business',
    title: 'Business Partnership',
    icon: Briefcase,
    description: 'Revenue splits and equity agreements',
    color: 'from-purple-400 to-pink-500',
    accentColor: '#a855f7',
    component: BusinessPartnershipForm
  },
  {
    id: 'vehicle',
    title: 'Vehicle Sale',
    icon: Car,
    description: 'Buy or sell cars with payment terms',
    color: 'from-orange-400 to-red-500',
    accentColor: '#f97316',
    component: VehicleSaleForm
  },
  {
    id: 'property',
    title: 'Property Sale',
    icon: Home,
    description: 'Real estate transactions',
    color: 'from-green-400 to-emerald-500',
    accentColor: '#10b981',
    component: PropertySaleForm
  },
  {
    id: 'service',
    title: 'Service Agreement',
    icon: FileText,
    description: 'Freelance and contractor agreements',
    color: 'from-yellow-400 to-orange-500',
    accentColor: '#eab308',
    component: ServiceAgreementForm
  },
  {
    id: 'custom',
    title: 'Custom Contract',
    icon: Settings,
    description: 'Build your own from scratch',
    color: 'from-indigo-400 to-purple-500',
    accentColor: '#6366f1',
    component: CustomContractForm
  }
]

function App() {
  const [step, setStep] = useState('landing')
  const [selectedPath, setSelectedPath] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [deploymentResult, setDeploymentResult] = useState(null)
  const [contractData, setContractData] = useState(null)

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!')
      return
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await web3Provider.send('eth_requestAccounts', [])
      
      setProvider(web3Provider)
      setAccount(accounts[0])
      setStep('path-selection')
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet. Please try again.')
    }
  }

  const handlePathSelection = (pathType) => {
    setSelectedPath(pathType)
    if (pathType === 'ai') {
      setStep('decision-tree')
    } else if (pathType === 'templates') {
      setStep('template')
    }
  }

  const handleDecisionPath = (action) => {
    setSelectedPath(action)
    if (action === 'upload') {
      setStep('file-upload')
    } else if (action === 'refine' || action === 'scratch') {
      setStep('ai-assistant')
    } else if (action === 'templates') {
      setStep('template')
    }
  }

  const handleAIComplete = (data) => {
    setContractData(data)
    // Route to appropriate template or custom form
    setStep('form')
  }

  const handleFileUploadComplete = (extractedData) => {
    setContractData(extractedData)
    setStep('ai-assistant')
  }

  const selectTemplate = (template) => {
    setSelectedTemplate(template)
    setStep('form')
  }

  const handleFormSubmit = async (formData) => {
    setContractData(formData)
    setStep('deploying')

    try {
      const result = await deploySmartContract(provider, account, formData, selectedTemplate.id)
      setDeploymentResult(result)
      setStep('success')
    } catch (error) {
      console.error('Deployment error:', error)
      alert('Failed to deploy contract. Please try again.')
      setStep('form')
    }
  }

  const downloadPDF = () => {
    console.log('Download PDF functionality would be implemented here')
    alert('PDF download feature coming soon!')
  }

  const createNewContract = () => {
    setStep('path-selection')
    setSelectedTemplate(null)
    setSelectedPath(null)
    setContractData(null)
    setDeploymentResult(null)
  }

  const goBack = () => {
    if (step === 'path-selection') {
      setStep('landing')
      setAccount(null)
      setProvider(null)
    } else if (step === 'decision-tree') {
      setStep('path-selection')
    } else if (step === 'template' || step === 'ai-assistant' || step === 'file-upload') {
      if (selectedPath === 'templates') {
        setStep('path-selection')
      } else {
        setStep('decision-tree')
      }
    } else if (step === 'form') {
      if (selectedPath === 'templates') {
        setStep('template')
      } else {
        setStep('ai-assistant')
      }
    }
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="landing-screen"
          >
            <div className="hero-content">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hero-badge"
              >
                <Sparkles size={16} />
                <span>AI-Powered Smart Contracts</span>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="hero-title"
              >
                Create Legal Agreements
                <span className="gradient-text">in Seconds</span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="hero-subtitle"
              >
                Blockchain-powered contracts with automatic execution.
                <br />No lawyers needed.
              </motion.p>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={connectWallet}
                className="cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet size={20} />
                Connect Wallet to Start
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="features-grid"
              >
                <div className="feature">
                  <CheckCircle size={20} />
                  <span>Instant Deployment</span>
                </div>
                <div className="feature">
                  <CheckCircle size={20} />
                  <span>IPFS Storage</span>
                </div>
                <div className="feature">
                  <CheckCircle size={20} />
                  <span>Self-Executing</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 'path-selection' && (
          <motion.div
            key="path-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PathSelection onSelect={handlePathSelection} onBack={goBack} />
          </motion.div>
        )}

        {step === 'decision-tree' && (
          <motion.div
            key="decision-tree"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DecisionTree onPathSelect={handleDecisionPath} onBack={goBack} />
          </motion.div>
        )}

        {step === 'ai-assistant' && (
          <motion.div
            key="ai-assistant"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AIAssistant 
              mode={selectedPath === 'upload' ? 'refine' : 'scratch'}
              onComplete={handleAIComplete}
              onBack={goBack}
            />
          </motion.div>
        )}

        {step === 'file-upload' && (
          <motion.div
            key="file-upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FileUpload 
              onComplete={handleFileUploadComplete}
              onBack={goBack}
            />
          </motion.div>
        )}

        {step === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="template-selection"
          >
            <div className="template-header">
              <button onClick={goBack} className="back-button">
                ← Back
              </button>
              <h2>Choose Your Contract Template</h2>
              <p>Select a template that matches your needs</p>
            </div>

            <div className="template-grid">
              {CONTRACT_TEMPLATES.map((template, index) => {
                const Icon = template.icon
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="template-card"
                    onClick={() => selectTemplate(template)}
                  >
                    <div className={`template-icon bg-gradient-to-br ${template.color}`}>
                      <Icon size={32} />
                    </div>
                    <h3>{template.title}</h3>
                    <p>{template.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 'form' && selectedTemplate && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="form-screen"
          >
            <div className="form-container">
              <div className="form-header">
                <button onClick={goBack} className="back-button">
                  ← Back to Templates
                </button>
                <div className="selected-template-badge">
                  {(() => {
                    const Icon = selectedTemplate.icon
                    return <Icon size={20} />
                  })()}
                  <span>{selectedTemplate.title}</span>
                </div>
              </div>

              {(() => {
                const FormComponent = selectedTemplate.component
                return (
                  <FormComponent
                    onSubmit={handleFormSubmit}
                    initialData={contractData}
                  />
                )
              })()}
            </div>
          </motion.div>
        )}

        {step === 'deploying' && (
          <motion.div
            key="deploying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="deploying-screen"
          >
            <div className="deploying-content">
              <div className="spinner-container">
                <motion.div
                  className="spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h2>Deploying Your Contract...</h2>
              <p>This may take a few moments</p>
              
              <div className="deployment-steps">
                <motion.div
                  className="step active"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle size={20} />
                  <span>Uploading to IPFS...</span>
                </motion.div>
                <motion.div
                  className="step active"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CheckCircle size={20} />
                  <span>Recording on blockchain...</span>
                </motion.div>
                <motion.div
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="step-loader" />
                  <span>Confirming transaction...</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && deploymentResult && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="success-screen"
          >
            <div className="success-content">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="success-icon"
              >
                <CheckCircle size={80} />
              </motion.div>

              <h1>Contract Deployed Successfully!</h1>
              <p className="success-subtitle">Your smart contract is now live on Polygon Amoy</p>

              <div className="deployment-info">
                <div className="info-card">
                  <label>Contract Address</label>
                  <div className="info-value">
                    {deploymentResult.contractAddress}
                    <a 
                      href={`https://amoy.polygonscan.com/address/${deploymentResult.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {deploymentResult.agreementId && (
                  <div className="info-card">
                    <label>Agreement ID</label>
                    <div className="info-value">{deploymentResult.agreementId}</div>
                  </div>
                )}

                <div className="info-card">
                  <label>Transaction Hash</label>
                  <div className="info-value">
                    {deploymentResult.transactionHash}
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${deploymentResult.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                <div className="info-card">
                  <label>IPFS Metadata</label>
                  <div className="info-value">
                    {deploymentResult.ipfsHash}
                    <a 
                      href={deploymentResult.ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="success-actions">
                <button onClick={downloadPDF} className="btn-primary">
                  <Download size={20} />
                  Download PDF
                </button>
                <button onClick={createNewContract} className="btn-secondary">
                  Create Another Contract
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
