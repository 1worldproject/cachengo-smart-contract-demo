import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, FileText, DollarSign, Briefcase, Car, Home, Settings, Sparkles } from 'lucide-react'
import './App.css'

const CONTRACT_TEMPLATES = [
  {
    id: 'peer-loan',
    title: 'Peer-to-Peer Loan',
    icon: DollarSign,
    description: 'Lend or borrow money with clear terms',
    color: 'from-cyan-400 to-blue-500',
    accentColor: '#06b6d4'
  },
  {
    id: 'business',
    title: 'Business Partnership',
    icon: Briefcase,
    description: 'Revenue splits and equity agreements',
    color: 'from-purple-400 to-pink-500',
    accentColor: '#a855f7'
  },
  {
    id: 'vehicle',
    title: 'Vehicle Sale',
    icon: Car,
    description: 'Buy or sell cars with payment terms',
    color: 'from-orange-400 to-red-500',
    accentColor: '#f97316'
  },
  {
    id: 'property',
    title: 'Property Sale',
    icon: Home,
    description: 'Real estate transactions',
    color: 'from-green-400 to-emerald-500',
    accentColor: '#10b981'
  },
  {
    id: 'service',
    title: 'Service Agreement',
    icon: FileText,
    description: 'Freelance and contractor agreements',
    color: 'from-yellow-400 to-orange-500',
    accentColor: '#eab308'
  },
  {
    id: 'custom',
    title: 'Custom Contract',
    icon: Settings,
    description: 'Build your own from scratch',
    color: 'from-indigo-400 to-purple-500',
    accentColor: '#6366f1'
  }
]

function App() {
  const [step, setStep] = useState('landing') // landing, template, form, review, success
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [account, setAccount] = useState(null)

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!')
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      setStep('template')
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const selectTemplate = (template) => {
    setSelectedTemplate(template)
    setStep('form')
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
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="hero-stats"
              >
                <div className="stat">
                  <span className="stat-value">$2.5M+</span>
                  <span className="stat-label">Secured</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-value">1,200+</span>
                  <span className="stat-label">Contracts</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-value">&lt; 2min</span>
                  <span className="stat-label">Average Time</span>
                </div>
              </motion.div>
            </div>

            <div className="hero-decoration">
              <div className="floating-card card-1" />
              <div className="floating-card card-2" />
              <div className="floating-card card-3" />
            </div>
          </motion.div>
        )}

        {step === 'template' && (
          <motion.div
            key="template"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="template-screen"
          >
            <div className="template-header">
              <h2>Choose Your Agreement Type</h2>
              <p>Select a template to get started quickly</p>
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
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="template-card"
                    onClick={() => selectTemplate(template)}
                    style={{ '--accent-color': template.accentColor }}
                  >
                    <div className={`template-icon bg-gradient-to-br ${template.color}`}>
                      <Icon size={32} />
                    </div>
                    <h3>{template.title}</h3>
                    <p>{template.description}</p>
                    <div className="template-arrow">→</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {step === 'form' && selectedTemplate && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-screen"
          >
            <div className="form-header">
              <button onClick={() => setStep('template')} className="back-button">
                ← Back
              </button>
              <h2>{selectedTemplate.title}</h2>
            </div>

            <div className="form-content">
              <p>Form for {selectedTemplate.title} coming next...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
