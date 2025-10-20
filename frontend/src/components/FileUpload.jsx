import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'

export function FileUpload({ onComplete, onBack }) {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [error, setError] = useState('')

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (uploadedFile) => {
    setError('')
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowedTypes.includes(uploadedFile.type)) {
      setError('Please upload a PDF, DOCX, DOC, or TXT file')
      return
    }

    // Validate file size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setFile(uploadedFile)
    setIsProcessing(true)

    try {
      // TODO: Integrate with document parsing service (e.g., pdf.js, mammoth.js for DOCX)
      // For now, simulate extraction
      await simulateExtraction(uploadedFile)
    } catch (err) {
      setError('Failed to process file. Please try again.')
      setIsProcessing(false)
    }
  }

  const simulateExtraction = async (file) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate extracted text
    const mockExtractedText = `CONTRACT AGREEMENT

This agreement is made between Party A and Party B.

Terms:
- Payment: $10,000
- Duration: 12 months
- Deliverables: As specified in Exhibit A

Both parties agree to the terms outlined above.

[Simulated extraction from ${file.name}]`

    setExtractedText(mockExtractedText)
    setIsProcessing(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setExtractedText('')
    setError('')
  }

  const handleConvertToSmartContract = () => {
    // Pass extracted data to AI assistant or directly to contract builder
    const contractData = {
      type: 'Converted Contract',
      originalFileName: file.name,
      extractedText: extractedText,
      timestamp: new Date().toISOString()
    }
    
    onComplete(contractData)
  }

  return (
    <div className="file-upload-screen">
      <div className="upload-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>Upload Your Existing Contract</h2>
        <p className="upload-subtitle">
          Upload a PDF, DOCX, or DOC file and we'll help convert it to a smart contract
        </p>
      </div>

      <div className="upload-container">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleChange}
            />
            <label htmlFor="file-upload" className="upload-label">
              <Upload size={48} className="upload-icon" />
              <h3>Drag & drop your contract here</h3>
              <p>or click to browse</p>
              <div className="supported-formats">
                Supports: PDF, DOCX, DOC, TXT (max 10MB)
              </div>
            </label>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="file-preview"
          >
            <div className="file-info">
              <FileText size={40} className="file-icon" />
              <div className="file-details">
                <h4>{file.name}</h4>
                <p>{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              {!isProcessing && (
                <button onClick={handleRemoveFile} className="remove-button">
                  <X size={20} />
                </button>
              )}
            </div>

            {isProcessing && (
              <div className="processing-indicator">
                <div className="spinner-small"></div>
                <p>Extracting contract content...</p>
              </div>
            )}

            {extractedText && !isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="extraction-result"
              >
                <div className="extraction-header">
                  <CheckCircle size={20} className="success-icon" />
                  <h4>Contract Extracted Successfully</h4>
                </div>
                
                <div className="extracted-content">
                  <h5>Extracted Text Preview:</h5>
                  <pre>{extractedText}</pre>
                </div>

                <div className="extraction-actions">
                  <button onClick={handleConvertToSmartContract} className="btn-primary">
                    Convert to Smart Contract →
                  </button>
                  <button onClick={handleRemoveFile} className="btn-secondary">
                    Upload Different File
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      <div className="upload-info">
        <h4>What happens next?</h4>
        <ul>
          <li>📄 We'll extract the key terms from your contract</li>
          <li>🤖 Our AI will analyze the structure and content</li>
          <li>✨ You'll be guided to convert it into a smart contract</li>
          <li>⛓️ Deploy to blockchain with IPFS storage</li>
        </ul>
      </div>
    </div>
  )
}
