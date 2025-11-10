import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { ethers } from 'ethers'

export function StructuredDataCollector({ contractType, initialData, onComplete }) {
  const [formData, setFormData] = useState(() => {
    const defaultData = getInitialData(contractType)
    return { ...defaultData, ...initialData }
  })
  const [errors, setErrors] = useState({})
  
  function getInitialData(type) {
    const today = new Date().toISOString().split('T')[0]
    
    switch(type) {
      case 'service':
        return {
          serviceName: '',
          serviceDescription: '',
          providerName: '',
          clientName: '',
          clientAddress: '',
          totalFee: '',
          paymentStructure: 'milestone',
          milestones: '25% - Project kickoff\n25% - Design completion\n25% - Development completion\n25% - Final delivery',
          startDate: today,
          endDate: '',
          deliverables: '',
          revisions: '2'
        }
      case 'peer-loan':
        return {
          loanAmount: '',
          interestRate: '',
          durationDays: '',
          borrowerAddress: '',
          lenderName: '',
          borrowerName: '',
          repaymentSchedule: 'monthly'
        }
      case 'business':
        return {
          businessName: '',
          partnerAName: '',
          partnerBName: '',
          partnerAAddress: '',
          partnerBAddress: '',
          revenueSplitA: '50',
          revenueSplitB: '50',
          milestones: '',
          startDate: today
        }
      case 'vehicle':
        return {
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: new Date().getFullYear(),
          vin: '',
          mileage: '',
          salePrice: '',
          sellerName: '',
          buyerName: '',
          buyerAddress: '',
          paymentTerms: 'full-payment'
        }
      case 'property':
        return {
          propertyAddress: '',
          propertyType: 'residential',
          salePrice: '',
          depositAmount: '',
          closingDate: '',
          squareFeet: '',
          bedrooms: '',
          bathrooms: '',
          sellerName: '',
          buyerName: '',
          buyerAddress: ''
        }
      default:
        return {}
    }
  }
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    // Validate Ethereum addresses
    Object.keys(formData).forEach(key => {
      if (key.includes('Address') && formData[key]) {
        if (!ethers.isAddress(formData[key])) {
          newErrors[key] = 'Invalid Ethereum address'
        }
      }
    })
    
    // Validate required fields based on contract type
    if (contractType === 'service') {
      if (!formData.serviceName) newErrors.serviceName = 'Required'
      if (!formData.clientAddress) newErrors.clientAddress = 'Required'
      if (!formData.totalFee) newErrors.totalFee = 'Required'
    } else if (contractType === 'peer-loan') {
      if (!formData.loanAmount) newErrors.loanAmount = 'Required'
      if (!formData.borrowerAddress) newErrors.borrowerAddress = 'Required'
      if (!formData.interestRate) newErrors.interestRate = 'Required'
    }
    // Add validation for other types...
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = () => {
    if (validateForm()) {
      onComplete({
        type: contractType,
        data: formData
      })
    }
  }
  
  const renderServiceFields = () => (
    <>
      <div className="form-section">
        <h4>Service Information</h4>
        <div className="form-field">
          <label>Service Name *</label>
          <input
            type="text"
            value={formData.serviceName}
            onChange={(e) => handleChange('serviceName', e.target.value)}
            placeholder="e.g., Web Development Services"
          />
          {errors.serviceName && <span className="error">{errors.serviceName}</span>}
        </div>
        
        <div className="form-field">
          <label>Service Description *</label>
          <textarea
            value={formData.serviceDescription}
            onChange={(e) => handleChange('serviceDescription', e.target.value)}
            placeholder="Describe the services to be provided..."
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-field">
            <label>Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>End Date *</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h4>Payment Terms</h4>
        <div className="form-row">
          <div className="form-field">
            <label>Total Fee (MATIC) *</label>
            <input
              type="number"
              value={formData.totalFee}
              onChange={(e) => handleChange('totalFee', e.target.value)}
              placeholder="5000"
            />
            {errors.totalFee && <span className="error">{errors.totalFee}</span>}
          </div>
          <div className="form-field">
            <label>Payment Structure *</label>
            <select
              value={formData.paymentStructure}
              onChange={(e) => handleChange('paymentStructure', e.target.value)}
            >
              <option value="milestone">Milestone-Based</option>
              <option value="hourly">Hourly</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>
        </div>
        
        <div className="form-field">
          <label>Payment Milestones *</label>
          <textarea
            value={formData.milestones}
            onChange={(e) => handleChange('milestones', e.target.value)}
            placeholder="List payment milestones..."
            rows="4"
          />
        </div>
      </div>
      
      <div className="form-section">
        <h4>Party Information</h4>
        <div className="form-row">
          <div className="form-field">
            <label>Service Provider Name *</label>
            <input
              type="text"
              value={formData.providerName}
              onChange={(e) => handleChange('providerName', e.target.value)}
              placeholder="Your full name or company"
            />
          </div>
          <div className="form-field">
            <label>Client Name *</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="Client's full name or company"
            />
          </div>
        </div>
        
        <div className="form-field">
          <label>Client Wallet Address *</label>
          <input
            type="text"
            value={formData.clientAddress}
            onChange={(e) => handleChange('clientAddress', e.target.value)}
            placeholder="0x..."
          />
          {errors.clientAddress && <span className="error">{errors.clientAddress}</span>}
        </div>
      </div>
      
      <div className="form-section">
        <h4>Deliverables & Terms</h4>
        <div className="form-field">
          <label>Deliverables *</label>
          <textarea
            value={formData.deliverables}
            onChange={(e) => handleChange('deliverables', e.target.value)}
            placeholder="List deliverables (one per line)..."
            rows="4"
          />
        </div>
        
        <div className="form-field">
          <label>Number of Revisions Included</label>
          <input
            type="number"
            value={formData.revisions}
            onChange={(e) => handleChange('revisions', e.target.value)}
          />
        </div>
      </div>
    </>
  )
  
  const renderLoanFields = () => (
    <>
      <div className="form-section">
        <h4>Loan Terms</h4>
        <div className="form-row">
          <div className="form-field">
            <label>Loan Amount (MATIC) *</label>
            <input
              type="number"
              value={formData.loanAmount}
              onChange={(e) => handleChange('loanAmount', e.target.value)}
              placeholder="1000"
            />
            {errors.loanAmount && <span className="error">{errors.loanAmount}</span>}
          </div>
          <div className="form-field">
            <label>Interest Rate (%) *</label>
            <input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => handleChange('interestRate', e.target.value)}
              placeholder="5.5"
            />
            {errors.interestRate && <span className="error">{errors.interestRate}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-field">
            <label>Duration (Days) *</label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) => handleChange('durationDays', e.target.value)}
              placeholder="365"
            />
          </div>
          <div className="form-field">
            <label>Repayment Schedule</label>
            <select
              value={formData.repaymentSchedule}
              onChange={(e) => handleChange('repaymentSchedule', e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="lump-sum">Lump Sum at End</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h4>Party Information</h4>
        <div className="form-row">
          <div className="form-field">
            <label>Lender Name *</label>
            <input
              type="text"
              value={formData.lenderName}
              onChange={(e) => handleChange('lenderName', e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="form-field">
            <label>Borrower Name *</label>
            <input
              type="text"
              value={formData.borrowerName}
              onChange={(e) => handleChange('borrowerName', e.target.value)}
              placeholder="Borrower's full name"
            />
          </div>
        </div>
        
        <div className="form-field">
          <label>Borrower Wallet Address *</label>
          <input
            type="text"
            value={formData.borrowerAddress}
            onChange={(e) => handleChange('borrowerAddress', e.target.value)}
            placeholder="0x..."
          />
          {errors.borrowerAddress && <span className="error">{errors.borrowerAddress}</span>}
        </div>
      </div>
    </>
  )
  
  const getContractTitle = () => {
    switch(contractType) {
      case 'service': return 'Service Agreement'
      case 'peer-loan': return 'Peer-to-Peer Loan'
      case 'business': return 'Business Partnership'
      case 'vehicle': return 'Vehicle Sale'
      case 'property': return 'Property Sale'
      default: return 'Contract'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="structured-data-collector"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '20px',
        maxWidth: '800px'
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          color: '#a78bfa', 
          marginBottom: '8px',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          {getContractTitle()} Details
        </h3>
        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '14px',
          margin: 0 
        }}>
          Fill in the required information to generate your smart contract
        </p>
      </div>
      
      <div className="form-content">
        {contractType === 'service' && renderServiceFields()}
        {contractType === 'peer-loan' && renderLoanFields()}
        {/* Add other contract types as needed */}
      </div>
      
      <button
        onClick={handleSubmit}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '24px',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        <CheckCircle size={20} />
        Complete & Generate Contract
      </button>
      
      <style jsx>{`
        .form-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .form-section:last-of-type {
          border-bottom: none;
        }
        .form-section h4 {
          color: #c4b5fd;
          font-size: 16px;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .form-field {
          margin-bottom: 16px;
        }
        .form-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }
        .form-field input,
        .form-field textarea,
        .form-field select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.3);
          color: white;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(0,0,0,0.4);
        }
        .form-field textarea {
          resize: vertical;
          min-height: 80px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
      `}</style>
    </motion.div>
  )
}
