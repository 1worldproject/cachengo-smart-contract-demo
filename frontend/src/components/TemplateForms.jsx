import { useState } from 'react'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'

// Peer-to-Peer Loan Form
export function P2PLoanForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    durationDays: '',
    borrowerAddress: '',
    lenderName: '',
    borrowerName: '',
    repaymentSchedule: 'monthly'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!ethers.isAddress(formData.borrowerAddress)) {
      alert('Please enter a valid Ethereum address for the borrower')
      return
    }

    onSubmit({
      type: 'Peer-to-Peer Loan Agreement',
      data: formData,
      templateId: 'peer-loan'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="template-form"
    >
      <div className="form-section">
        <h3>Loan Details</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Loan Amount (MATIC) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.loanAmount}
              onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
              placeholder="100"
              required
            />
          </div>

          <div className="form-field">
            <label>Interest Rate (%) *</label>
            <input
              type="number"
              step="0.1"
              value={formData.interestRate}
              onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
              placeholder="5.0"
              required
            />
          </div>

          <div className="form-field">
            <label>Duration (days) *</label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) => setFormData({...formData, durationDays: e.target.value})}
              placeholder="365"
              required
            />
          </div>

          <div className="form-field">
            <label>Repayment Schedule</label>
            <select
              value={formData.repaymentSchedule}
              onChange={(e) => setFormData({...formData, repaymentSchedule: e.target.value})}
            >
              <option value="monthly">Monthly Payments</option>
              <option value="quarterly">Quarterly Payments</option>
              <option value="lump-sum">Lump Sum at End</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Party Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Lender Name (You) *</label>
            <input
              type="text"
              value={formData.lenderName}
              onChange={(e) => setFormData({...formData, lenderName: e.target.value})}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-field">
            <label>Borrower Name *</label>
            <input
              type="text"
              value={formData.borrowerName}
              onChange={(e) => setFormData({...formData, borrowerName: e.target.value})}
              placeholder="Borrower's full name"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Borrower Wallet Address *</label>
            <input
              type="text"
              value={formData.borrowerAddress}
              onChange={(e) => setFormData({...formData, borrowerAddress: e.target.value})}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Deploy Contract →
        </button>
      </div>
    </motion.div>
  )
}

// Business Partnership Form
export function BusinessPartnershipForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    businessName: '',
    partnerAName: '',
    partnerBName: '',
    partnerAAddress: '',
    partnerBAddress: '',
    revenueSplitA: '50',
    revenueSplitB: '50',
    milestones: '',
    startDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!ethers.isAddress(formData.partnerAAddress) || !ethers.isAddress(formData.partnerBAddress)) {
      alert('Please enter valid Ethereum addresses for both partners')
      return
    }

    onSubmit({
      type: 'Business Partnership Agreement',
      data: formData,
      templateId: 'business'
    })
  }

  const handleRevenueSplitChange = (value) => {
    const splitA = Math.min(100, Math.max(0, Number(value)))
    setFormData({
      ...formData,
      revenueSplitA: String(splitA),
      revenueSplitB: String(100 - splitA)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="template-form"
    >
      <div className="form-section">
        <h3>Business Information</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Business Name *</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              placeholder="Your business name"
              required
            />
          </div>

          <div className="form-field">
            <label>Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Partner A Details</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Partner A Name *</label>
            <input
              type="text"
              value={formData.partnerAName}
              onChange={(e) => setFormData({...formData, partnerAName: e.target.value})}
              placeholder="First partner"
              required
            />
          </div>

          <div className="form-field">
            <label>Revenue Share (%) *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.revenueSplitA}
              onChange={(e) => handleRevenueSplitChange(e.target.value)}
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Partner A Wallet Address *</label>
            <input
              type="text"
              value={formData.partnerAAddress}
              onChange={(e) => setFormData({...formData, partnerAAddress: e.target.value})}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Partner B Details</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Partner B Name *</label>
            <input
              type="text"
              value={formData.partnerBName}
              onChange={(e) => setFormData({...formData, partnerBName: e.target.value})}
              placeholder="Second partner"
              required
            />
          </div>

          <div className="form-field">
            <label>Revenue Share (%) *</label>
            <input
              type="number"
              value={formData.revenueSplitB}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-field full-width">
            <label>Partner B Wallet Address *</label>
            <input
              type="text"
              value={formData.partnerBAddress}
              onChange={(e) => setFormData({...formData, partnerBAddress: e.target.value})}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Milestones & Deliverables</h3>
        <div className="form-field">
          <label>Key Milestones (one per line)</label>
          <textarea
            rows="5"
            value={formData.milestones}
            onChange={(e) => setFormData({...formData, milestones: e.target.value})}
            placeholder="Launch MVP&#10;Reach 1,000 users&#10;Achieve $100k revenue&#10;Hire first employee"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Deploy Contract →
        </button>
      </div>
    </motion.div>
  )
}

// Vehicle Sale Form
export function VehicleSaleForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vin: '',
    mileage: '',
    salePrice: '',
    sellerName: '',
    buyerName: '',
    buyerAddress: '',
    paymentTerms: 'full-payment',
    depositAmount: '',
    condition: 'used'
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!ethers.isAddress(formData.buyerAddress)) {
      alert('Please enter a valid Ethereum address for the buyer')
      return
    }

    if (formData.vin.length !== 17) {
      alert('VIN must be exactly 17 characters')
      return
    }

    onSubmit({
      type: 'Vehicle Sale Agreement',
      data: formData,
      templateId: 'vehicle'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="template-form"
    >
      <div className="form-section">
        <h3>Vehicle Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Make *</label>
            <input
              type="text"
              value={formData.vehicleMake}
              onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
              placeholder="Toyota"
              required
            />
          </div>

          <div className="form-field">
            <label>Model *</label>
            <input
              type="text"
              value={formData.vehicleModel}
              onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
              placeholder="Camry"
              required
            />
          </div>

          <div className="form-field">
            <label>Year *</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.vehicleYear}
              onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label>Condition *</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            >
              <option value="new">New</option>
              <option value="used">Used - Excellent</option>
              <option value="good">Used - Good</option>
              <option value="fair">Used - Fair</option>
            </select>
          </div>

          <div className="form-field full-width">
            <label>VIN Number (17 characters) *</label>
            <input
              type="text"
              value={formData.vin}
              onChange={(e) => setFormData({...formData, vin: e.target.value.toUpperCase()})}
              placeholder="1HGBH41JXMN109186"
              maxLength="17"
              required
            />
          </div>

          <div className="form-field">
            <label>Mileage *</label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({...formData, mileage: e.target.value})}
              placeholder="50000"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Sale Terms</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Sale Price (MATIC) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
              placeholder="5000"
              required
            />
          </div>

          <div className="form-field">
            <label>Payment Terms *</label>
            <select
              value={formData.paymentTerms}
              onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
            >
              <option value="full-payment">Full Payment</option>
              <option value="installments">Installment Plan</option>
              <option value="deposit-balance">Deposit + Balance</option>
            </select>
          </div>

          {formData.paymentTerms !== 'full-payment' && (
            <div className="form-field">
              <label>Deposit Amount (MATIC)</label>
              <input
                type="number"
                step="0.01"
                value={formData.depositAmount}
                onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
                placeholder="1000"
              />
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Party Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Seller Name (You) *</label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-field">
            <label>Buyer Name *</label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
              placeholder="Buyer's full name"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Buyer Wallet Address *</label>
            <input
              type="text"
              value={formData.buyerAddress}
              onChange={(e) => setFormData({...formData, buyerAddress: e.target.value})}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Deploy Contract →
        </button>
      </div>
    </motion.div>
  )
}

// Property Sale Form
export function PropertySaleForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
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
    buyerAddress: '',
    includesInspection: true,
    includesAppraisal: true,
    contingencies: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!ethers.isAddress(formData.buyerAddress)) {
      alert('Please enter a valid Ethereum address for the buyer')
      return
    }

    onSubmit({
      type: 'Property Sale Agreement',
      data: formData,
      templateId: 'property'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="template-form"
    >
      <div className="form-section">
        <h3>Property Information</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Property Address *</label>
            <input
              type="text"
              value={formData.propertyAddress}
              onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
              placeholder="123 Main St, City, State, ZIP"
              required
            />
          </div>

          <div className="form-field">
            <label>Property Type *</label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="multi-family">Multi-Family</option>
            </select>
          </div>

          <div className="form-field">
            <label>Square Feet</label>
            <input
              type="number"
              value={formData.squareFeet}
              onChange={(e) => setFormData({...formData, squareFeet: e.target.value})}
              placeholder="2000"
            />
          </div>

          <div className="form-field">
            <label>Bedrooms</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
              placeholder="3"
            />
          </div>

          <div className="form-field">
            <label>Bathrooms</label>
            <input
              type="number"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
              placeholder="2"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Sale Terms</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Sale Price (MATIC) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
              placeholder="350000"
              required
            />
          </div>

          <div className="form-field">
            <label>Deposit Amount (MATIC) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.depositAmount}
              onChange={(e) => setFormData({...formData, depositAmount: e.target.value})}
              placeholder="35000"
              required
            />
          </div>

          <div className="form-field">
            <label>Closing Date *</label>
            <input
              type="date"
              value={formData.closingDate}
              onChange={(e) => setFormData({...formData, closingDate: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                type="checkbox"
                checked={formData.includesInspection}
                onChange={(e) => setFormData({...formData, includesInspection: e.target.checked})}
                style={{width: 'auto', margin: 0}}
              />
              Includes Home Inspection
            </label>
          </div>

          <div className="form-field">
            <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                type="checkbox"
                checked={formData.includesAppraisal}
                onChange={(e) => setFormData({...formData, includesAppraisal: e.target.checked})}
                style={{width: 'auto', margin: 0}}
              />
              Includes Appraisal
            </label>
          </div>

          <div className="form-field full-width">
            <label>Contingencies (one per line)</label>
            <textarea
              rows="4"
              value={formData.contingencies}
              onChange={(e) => setFormData({...formData, contingencies: e.target.value})}
              placeholder="Financing approval&#10;Clear title&#10;Home inspection passed"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Party Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Seller Name (You) *</label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-field">
            <label>Buyer Name *</label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
              placeholder="Buyer's full name"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Buyer Wallet Address *</label>
            <input
              type="text"
              value={formData.buyerAddress}
              onChange={(e) => setFormData({...formData, buyerAddress: e.target.value})}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Deploy Contract →
        </button>
      </div>
    </motion.div>
  )
}

// Service Agreement Form
export function ServiceAgreementForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: '',
    providerName: '',
    clientName: '',
    clientAddress: '',
    totalFee: '',
    paymentStructure: 'milestone',
    milestones: '',
    startDate: '',
    endDate: '',
    deliverables: '',
    revisions: '2'
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!ethers.isAddress(formData.clientAddress)) {
      alert('Please enter a valid Ethereum address for the client')
      return
    }

    onSubmit({
      type: 'Service Agreement',
      data: formData,
      templateId: 'service'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="template-form"
    >
      <div className="form-section">
        <h3>Service Information</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Service Name *</label>
            <input
              type="text"
              value={formData.serviceName}
              onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
              placeholder="Web Development Services"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Service Description *</label>
            <textarea
              rows="3"
              value={formData.serviceDescription}
              onChange={(e) => setFormData({...formData, serviceDescription: e.target.value})}
              placeholder="Describe the services to be provided..."
              required
            />
          </div>

          <div className="form-field">
            <label>Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>

          <div className="form-field">
            <label>End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Payment Terms</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Total Fee (MATIC) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.totalFee}
              onChange={(e) => setFormData({...formData, totalFee: e.target.value})}
              placeholder="5000"
              required
            />
          </div>

          <div className="form-field">
            <label>Payment Structure *</label>
            <select
              value={formData.paymentStructure}
              onChange={(e) => setFormData({...formData, paymentStructure: e.target.value})}
            >
              <option value="milestone">Milestone-Based</option>
              <option value="hourly">Hourly Rate</option>
              <option value="upfront">Upfront Payment</option>
              <option value="monthly">Monthly Retainer</option>
            </select>
          </div>

          <div className="form-field full-width">
            <label>Payment Milestones (one per line)</label>
            <textarea
              rows="4"
              value={formData.milestones}
              onChange={(e) => setFormData({...formData, milestones: e.target.value})}
              placeholder="25% - Project kickoff&#10;25% - Design completion&#10;25% - Development completion&#10;25% - Final delivery"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Deliverables & Terms</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Deliverables (one per line) *</label>
            <textarea
              rows="4"
              value={formData.deliverables}
              onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
              placeholder="Website design mockups&#10;Fully functional website&#10;Source code&#10;Documentation"
              required
            />
          </div>

          <div className="form-field">
            <label>Number of Revisions Included</label>
            <input
              type="number"
              value={formData.revisions}
              onChange={(e) => setFormData({...formData, revisions: e.target.value})}
              placeholder="2"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Party Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Service Provider Name (You) *</label>
            <input
              type="text"
              value={formData.providerName}
              onChange={(e) => setFormData({...formData, providerName: e.target.value})}
              placeholder="Your full name or company"
              required
            />
          </div>

          <div className="form-field">
            <label>Client Name *</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              placeholder="Client's full name or company"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Client Wallet Address *</label>
            <input
              type="text"
              value={formData.clientAddress}
              onChange={(e) => setFormData({...formData, clientAddress: e.target.value})}
              placeholder="0x..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Deploy Contract →
        </button>
      </div>
    </motion.div>
  )
}

// Custom Contract Form
export function CustomContractForm({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    contractTitle: '',
    contractDescription: '',
    partyAName: '',
    partyBName: '',
    partyAAddress: '',
    partyBAddress: '',
    terms: '',
    obligations: '',
    paymentAmount: '',
    paymentSchedule: '',
    duration: '',
    terminationConditions: '',
    additionalClauses: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formData.partyAAddress && !ethers.isAddress(formData.partyAAddress)) {
      alert('Please enter a valid Ethereum address for Party A')
      return
    }

    if (formData.partyBAddress && !ethers.isAddress(formData.partyBAddress)) {
      alert('Please enter a valid Ethereum address for Party B')
      return
    }

    onSubmit({
      type: 'Custom Contract Agreement',
      data: formData,
      templateId: 'custom'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="template-form"
    >
      <div className="form-section">
        <h3>Contract Information</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Contract Title *</label>
            <input
              type="text"
              value={formData.contractTitle}
              onChange={(e) => setFormData({...formData, contractTitle: e.target.value})}
              placeholder="Enter a descriptive title for your contract"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Contract Description *</label>
            <textarea
              rows="3"
              value={formData.contractDescription}
              onChange={(e) => setFormData({...formData, contractDescription: e.target.value})}
              placeholder="Describe the purpose and scope of this agreement..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Parties</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Party A Name *</label>
            <input
              type="text"
              value={formData.partyAName}
              onChange={(e) => setFormData({...formData, partyAName: e.target.value})}
              placeholder="First party name"
              required
            />
          </div>

          <div className="form-field">
            <label>Party B Name *</label>
            <input
              type="text"
              value={formData.partyBName}
              onChange={(e) => setFormData({...formData, partyBName: e.target.value})}
              placeholder="Second party name"
              required
            />
          </div>

          <div className="form-field">
            <label>Party A Wallet Address</label>
            <input
              type="text"
              value={formData.partyAAddress}
              onChange={(e) => setFormData({...formData, partyAAddress: e.target.value})}
              placeholder="0x... (optional)"
            />
          </div>

          <div className="form-field">
            <label>Party B Wallet Address</label>
            <input
              type="text"
              value={formData.partyBAddress}
              onChange={(e) => setFormData({...formData, partyBAddress: e.target.value})}
              placeholder="0x... (optional)"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Terms & Conditions</h3>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Key Terms (one per line) *</label>
            <textarea
              rows="5"
              value={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.value})}
              placeholder="List the key terms of the agreement...&#10;Term 1&#10;Term 2&#10;Term 3"
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Obligations (one per line) *</label>
            <textarea
              rows="5"
              value={formData.obligations}
              onChange={(e) => setFormData({...formData, obligations: e.target.value})}
              placeholder="List the obligations of each party...&#10;Party A will...&#10;Party B will..."
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Payment & Duration</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Payment Amount (MATIC)</label>
            <input
              type="number"
              step="0.01"
              value={formData.paymentAmount}
              onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
              placeholder="Optional"
            />
          </div>

          <div className="form-field">
            <label>Payment Schedule</label>
            <input
              type="text"
              value={formData.paymentSchedule}
              onChange={(e) => setFormData({...formData, paymentSchedule: e.target.value})}
              placeholder="e.g., Monthly, One-time, Milestone-based"
            />
          </div>

          <div className="form-field">
            <label>Contract Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g., 12 months, Ongoing, Until completion"
            />
          </div>

          <div className="form-field">
            <label>Termination Conditions</label>
            <input
              type="text"
              value={formData.terminationConditions}
              onChange={(e) => setFormData({...formData, terminationConditions: e.target.value})}
              placeholder="30 days notice, Breach of terms, etc."
            />
          </div>

          <div className="form-field full-width">
            <label>Additional Clauses</label>
            <textarea
              rows="4"
              value={formData.additionalClauses}
              onChange={(e) => setFormData({...formData, additionalClauses: e.target.value})}
              placeholder="Any additional terms, conditions, or clauses..."
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Deploy Contract →
        </button>
      </div>
    </motion.div>
  )
}
