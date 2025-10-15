import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import { Wallet, FileText, Users, DollarSign, FileCheck, Download, Eye, Plus, Trash2, Calendar, Settings } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import './App.css'
import contractABI from './contracts/SmartContractGenerator.json'
import config from './contracts/config.json'

const CHAINS = [
  { id: "polygon", label: "Polygon Amoy" },
  { id: "ethereum", label: "Ethereum" },
  { id: "base", label: "Base" }
]

const CURRENCIES = ["MATIC", "USDC", "USDT", "ETH"]

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe']

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  
  const [draft, setDraft] = useState({
    metadata: {
      title: '',
      description: '',
      effectiveDate: '',
      endDate: '',
      governingLaw: '',
      arbitrationVenue: '',
      autoRenew: false
    },
    payments: {
      currency: 'MATIC',
      chain: 'polygon',
      tokenAddress: '',
      milestones: []
    },
    parties: [],
    terms: {
      confidentiality: false,
      ipOwnership: 'Joint',
      termination: '',
      lateFees: ''
    },
    signatures: {
      requireEIP712: false,
      signers: []
    }
  })

  const [showPreview, setShowPreview] = useState(false)
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false)
  const [currentMilestone, setCurrentMilestone] = useState(null)
  const [loading, setLoading] = useState(false)

  // Helper functions
  const uid = () => Math.random().toString(36).substr(2, 9)
  
  const sumSplits = (parties) => {
    return parties
      .filter(p => p.role !== "Sub-Party")
      .reduce((sum, p) => sum + (p.splitPct || 0), 0)
  }

  const sumSubSplits = (parties, parentId) => {
    return parties
      .filter(p => p.parentId === parentId)
      .reduce((sum, p) => sum + (p.splitPct || 0), 0)
  }

  const totalMilestones = draft.payments.milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
  const splitTotal = sumSplits(draft.parties)
  
  const splitData = draft.parties
    .filter(p => p.role !== "Sub-Party")
    .map(p => ({
      name: p.displayName || p.role,
      value: p.splitPct || 0
    }))

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      
      setAccount(accounts[0])
      
      const contractInstance = new ethers.Contract(
        config.contractAddress,
        contractABI.abi,
        signer
      )
      setContract(contractInstance)
      
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== config.chainId) {
        alert(`Please switch to Polygon Amoy testnet (Chain ID: ${config.chainId})`)
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  // Party management
  const addPrimaryParty = () => {
    const existingRoles = draft.parties.filter(p => p.role !== "Sub-Party").map(p => p.role)
    const role = existingRoles.includes("Party A") ? "Party B" : "Party A"
    
    setDraft({
      ...draft,
      parties: [...draft.parties, {
        id: uid(),
        role,
        displayName: '',
        legalName: '',
        wallet: '',
        email: '',
        splitPct: 50,
        parentId: null
      }]
    })
  }

  const addSubParty = (parentId) => {
    setDraft({
      ...draft,
      parties: [...draft.parties, {
        id: uid(),
        role: "Sub-Party",
        displayName: '',
        legalName: '',
        wallet: '',
        email: '',
        splitPct: 0,
        parentId
      }]
    })
  }

  const updateParty = (id, updates) => {
    setDraft({
      ...draft,
      parties: draft.parties.map(p => p.id === id ? { ...p, ...updates } : p)
    })
  }

  const removeParty = (id) => {
    setDraft({
      ...draft,
      parties: draft.parties.filter(p => p.id !== id && p.parentId !== id)
    })
  }

  // Milestone management
  const addMilestone = () => {
    setCurrentMilestone({
      id: uid(),
      label: '',
      amount: 0,
      dueDate: '',
      conditions: ''
    })
    setShowMilestoneDialog(true)
  }

  const saveMilestone = () => {
    if (currentMilestone) {
      const existing = draft.payments.milestones.find(m => m.id === currentMilestone.id)
      if (existing) {
        setDraft({
          ...draft,
          payments: {
            ...draft.payments,
            milestones: draft.payments.milestones.map(m => 
              m.id === currentMilestone.id ? currentMilestone : m
            )
          }
        })
      } else {
        setDraft({
          ...draft,
          payments: {
            ...draft.payments,
            milestones: [...draft.payments.milestones, currentMilestone]
          }
        })
      }
    }
    setShowMilestoneDialog(false)
    setCurrentMilestone(null)
  }

  const removeMilestone = (id) => {
    setDraft({
      ...draft,
      payments: {
        ...draft.payments,
        milestones: draft.payments.milestones.filter(m => m.id !== id)
      }
    })
  }

  const editMilestone = (milestone) => {
    setCurrentMilestone(milestone)
    setShowMilestoneDialog(true)
  }

  // Export & Preview
  const downloadJSON = (filename, data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const compiledContract = {
    ...draft,
    payments: {
      ...draft.payments,
      totalValue: totalMilestones
    },
    signatures: {
      ...draft.signatures,
      signers: account ? [account] : []
    }
  }

  const isSplitValid = splitTotal === 100
  const hasMillestones = draft.payments.milestones.length > 0

  return (
    <div className="app">
      <header>
        <h1>🤝 Cachengo Contract Builder</h1>
        <p>Professional smart contract generation with full metadata</p>
      </header>

      {!account ? (
        <motion.div 
          className="connect-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button onClick={connectWallet} className="connect-btn">
            <Wallet size={24} />
            Connect MetaMask
          </button>
        </motion.div>
      ) : (
        <div className="dashboard">
          {/* Header Actions */}
          <div className="header-actions">
            <div className="wallet-info">
              <Wallet size={20} />
              <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
              {draft.signatures.requireEIP712 && <span className="badge">EIP-712</span>}
            </div>
            <div className="action-buttons">
              <button onClick={() => setShowPreview(true)} className="btn-secondary">
                <Eye size={18} /> Preview
              </button>
              <button onClick={() => downloadJSON('contract.json', compiledContract)} className="btn-secondary">
                <Download size={18} /> Export JSON
              </button>
            </div>
          </div>

          <div className="grid-layout">
            {/* Agreement Meta Card */}
            <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2><FileText size={24} /> Agreement Metadata</h2>
              <div className="form-group">
                <label>Contract Title</label>
                <input
                  type="text"
                  value={draft.metadata.title}
                  onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, title: e.target.value}})}
                  placeholder="e.g., Partnership Agreement"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={draft.metadata.description}
                  onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, description: e.target.value}})}
                  placeholder="Brief description of the agreement"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Effective Date</label>
                  <input
                    type="date"
                    value={draft.metadata.effectiveDate}
                    onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, effectiveDate: e.target.value}})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={draft.metadata.endDate}
                    onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, endDate: e.target.value}})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Governing Law</label>
                <input
                  type="text"
                  value={draft.metadata.governingLaw}
                  onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, governingLaw: e.target.value}})}
                  placeholder="e.g., State of Delaware"
                />
              </div>
              <div className="form-group">
                <label>Arbitration Venue</label>
                <input
                  type="text"
                  value={draft.metadata.arbitrationVenue}
                  onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, arbitrationVenue: e.target.value}})}
                  placeholder="e.g., AAA Rules"
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.metadata.autoRenew}
                    onChange={(e) => setDraft({...draft, metadata: {...draft.metadata, autoRenew: e.target.checked}})}
                  />
                  Auto-Renew Contract
                </label>
              </div>
            </motion.div>

            {/* Terms Card */}
            <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h2><Settings size={24} /> Legal Terms</h2>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.terms.confidentiality}
                    onChange={(e) => setDraft({...draft, terms: {...draft.terms, confidentiality: e.target.checked}})}
                  />
                  Confidentiality Agreement
                </label>
              </div>
              <div className="form-group">
                <label>IP Ownership</label>
                <select
                  value={draft.terms.ipOwnership}
                  onChange={(e) => setDraft({...draft, terms: {...draft.terms, ipOwnership: e.target.value}})}
                >
                  <option value="Retained by A">Retained by Party A</option>
                  <option value="Retained by B">Retained by Party B</option>
                  <option value="Joint">Joint Ownership</option>
                  <option value="Assigned">Assigned</option>
                </select>
              </div>
              <div className="form-group">
                <label>Termination Clause</label>
                <textarea
                  value={draft.terms.termination}
                  onChange={(e) => setDraft({...draft, terms: {...draft.terms, termination: e.target.value}})}
                  placeholder="Describe termination conditions"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Late Payment Fees</label>
                <input
                  type="text"
                  value={draft.terms.lateFees}
                  onChange={(e) => setDraft({...draft, terms: {...draft.terms, lateFees: e.target.value}})}
                  placeholder="e.g., 5% per month"
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.signatures.requireEIP712}
                    onChange={(e) => setDraft({...draft, signatures: {...draft.signatures, requireEIP712: e.target.checked}})}
                  />
                  Require EIP-712 Signatures
                </label>
              </div>
            </motion.div>

            {/* Parties Card */}
            <motion.div className="card card-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2><Users size={24} /> Parties & Revenue Splits</h2>
              
              <button onClick={addPrimaryParty} className="btn-add">
                <Plus size={18} /> Add Primary Party
              </button>

              {draft.parties.filter(p => p.role !== "Sub-Party").map(party => (
                <div key={party.id} className="party-section">
                  <div className="party-header">
                    <h3>{party.role}</h3>
                    <button onClick={() => removeParty(party.id)} className="btn-icon">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Display Name</label>
                      <input
                        type="text"
                        value={party.displayName}
                        onChange={(e) => updateParty(party.id, { displayName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Legal Name</label>
                      <input
                        type="text"
                        value={party.legalName}
                        onChange={(e) => updateParty(party.id, { legalName: e.target.value })}
                        placeholder="John Doe LLC"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Wallet Address</label>
                      <input
                        type="text"
                        value={party.wallet}
                        onChange={(e) => updateParty(party.id, { wallet: e.target.value })}
                        placeholder="0x... or ENS"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={party.email}
                        onChange={(e) => updateParty(party.id, { email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Revenue Split (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={party.splitPct}
                      onChange={(e) => updateParty(party.id, { splitPct: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <button onClick={() => addSubParty(party.id)} className="btn-secondary btn-sm">
                    <Plus size={16} /> Add Sub-Party
                  </button>

                  {/* Sub-parties */}
                  {draft.parties.filter(p => p.parentId === party.id).map(sub => (
                    <div key={sub.id} className="sub-party">
                      <div className="sub-party-header">
                        <span>Sub-Party</span>
                        <button onClick={() => removeParty(sub.id)} className="btn-icon">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            value={sub.displayName}
                            onChange={(e) => updateParty(sub.id, { displayName: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Split (%)</label>
                          <input
                            type="number"
                            min="0"
                            max={party.splitPct}
                            value={sub.splitPct}
                            onChange={(e) => updateParty(sub.id, { splitPct: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Split Visualization */}
              {splitData.length > 0 && (
                <div className="split-visualization">
                  <h3>Revenue Distribution</h3>
                  <div className="split-status">
                    Total: <span className={isSplitValid ? 'valid' : 'invalid'}>{splitTotal}%</span>
                    {!isSplitValid && <span className="error-text">Must equal 100%</span>}
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={splitData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {splitData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>

            {/* Payments & Milestones Card */}
            <motion.div className="card card-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2><DollarSign size={24} /> Payments & Milestones</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={draft.payments.currency}
                    onChange={(e) => setDraft({...draft, payments: {...draft.payments, currency: e.target.value}})}
                  >
                    {CURRENCIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Blockchain</label>
                  <select
                    value={draft.payments.chain}
                    onChange={(e) => setDraft({...draft, payments: {...draft.payments, chain: e.target.value}})}
                  >
                    {CHAINS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Token Contract Address (optional)</label>
                <input
                  type="text"
                  value={draft.payments.tokenAddress}
                  onChange={(e) => setDraft({...draft, payments: {...draft.payments, tokenAddress: e.target.value}})}
                  placeholder="0x..."
                />
              </div>

              <div className="milestones-header">
                <h3>Payment Milestones</h3>
                <button onClick={addMilestone} className="btn-add btn-sm">
                  <Plus size={16} /> Add Milestone
                </button>
              </div>

              <div className="milestones-summary">
                Total Value: <strong>{totalMilestones} {draft.payments.currency}</strong>
              </div>

              <div className="milestones-list">
                {draft.payments.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="milestone-item">
                    <div className="milestone-info">
                      <span className="milestone-number">{index + 1}</span>
                      <div>
                        <div className="milestone-label">{milestone.label}</div>
                        <div className="milestone-details">
                          {milestone.amount} {draft.payments.currency}
                          {milestone.dueDate && <span> • {new Date(milestone.dueDate).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="milestone-actions">
                      <button onClick={() => editMilestone(milestone)} className="btn-icon">
                        <FileText size={16} />
                      </button>
                      <button onClick={() => removeMilestone(milestone.id)} className="btn-icon">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Generate Card */}
            <motion.div className="card card-full generate-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2><FileCheck size={24} /> Generate Agreement</h2>
              
              <div className="validation-checks">
                <div className={`check-item ${isSplitValid ? 'valid' : 'invalid'}`}>
                  {isSplitValid ? '✓' : '✗'} Revenue splits equal 100%
                </div>
                <div className={`check-item ${hasMillestones ? 'valid' : 'invalid'}`}>
                  {hasMillestones ? '✓' : '✗'} At least one milestone defined
                </div>
                <div className={`check-item ${draft.metadata.title ? 'valid' : 'invalid'}`}>
                  {draft.metadata.title ? '✓' : '✗'} Contract title provided
                </div>
              </div>

              <button 
                onClick={() => downloadJSON('contract.json', compiledContract)}
                disabled={!isSplitValid || !hasMillestones}
                className="btn-generate"
              >
                <Download size={20} /> Generate Contract JSON
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* Milestone Dialog */}
      {showMilestoneDialog && (
        <div className="modal-overlay" onClick={() => setShowMilestoneDialog(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{currentMilestone?.label ? 'Edit' : 'Add'} Milestone</h2>
            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                value={currentMilestone?.label || ''}
                onChange={(e) => setCurrentMilestone({...currentMilestone, label: e.target.value})}
                placeholder="e.g., Initial Payment"
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                value={currentMilestone?.amount || 0}
                onChange={(e) => setCurrentMilestone({...currentMilestone, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={currentMilestone?.dueDate || ''}
                onChange={(e) => setCurrentMilestone({...currentMilestone, dueDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Conditions</label>
              <textarea
                value={currentMilestone?.conditions || ''}
                onChange={(e) => setCurrentMilestone({...currentMilestone, conditions: e.target.value})}
                placeholder="Payment conditions..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowMilestoneDialog(false)} className="btn-secondary">Cancel</button>
              <button onClick={saveMilestone} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>Contract Preview</h2>
            <pre className="json-preview">{JSON.stringify(compiledContract, null, 2)}</pre>
            <div className="modal-actions">
              <button onClick={() => setShowPreview(false)} className="btn-secondary">Close</button>
              <button onClick={() => downloadJSON('contract.json', compiledContract)} className="btn-primary">
                <Download size={18} /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
