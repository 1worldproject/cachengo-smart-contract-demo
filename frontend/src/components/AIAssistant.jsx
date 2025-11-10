import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Loader, Sparkles, FileText, ArrowLeft } from 'lucide-react'

// Question flows for different contract types
const CONTRACT_FLOWS = {
  'service': [
    { field: 'serviceName', question: 'What is the name of the service or project?', type: 'text' },
    { field: 'serviceDescription', question: 'Please describe the services to be provided:', type: 'textarea' },
    { field: 'totalFee', question: 'What is the total fee in MATIC?', type: 'number' },
    { field: 'startDate', question: 'What is the start date? (format: dd/mm/yyyy)', type: 'date' },
    { field: 'endDate', question: 'What is the end date? (format: dd/mm/yyyy)', type: 'date' },
    { field: 'providerName', question: 'What is the service provider\'s name or company?', type: 'text' },
    { field: 'providerAddress', question: 'What is the service provider\'s Ethereum address?', type: 'address' },
    { field: 'clientName', question: 'What is the client\'s name or company?', type: 'text' },
    { field: 'clientAddress', question: 'What is the client\'s Ethereum address?', type: 'address' },
    { field: 'deliverables', question: 'What are the key deliverables? (List them, one per line)', type: 'textarea' }
  ],
  'peer-loan': [
    { field: 'loanAmount', question: 'What is the loan amount in MATIC?', type: 'number' },
    { field: 'interestRate', question: 'What is the interest rate (as a percentage, e.g., 5 for 5%)?', type: 'number' },
    { field: 'repaymentDate', question: 'What is the repayment deadline? (format: dd/mm/yyyy)', type: 'date' },
    { field: 'lenderAddress', question: 'What is the lender\'s Ethereum address?', type: 'address' },
    { field: 'borrowerAddress', question: 'What is the borrower\'s Ethereum address?', type: 'address' }
  ],
  'business': [
    { field: 'businessName', question: 'What is the business or partnership name?', type: 'text' },
    { field: 'partner1Name', question: 'What is the first partner\'s name?', type: 'text' },
    { field: 'partner1Address', question: 'What is the first partner\'s Ethereum address?', type: 'address' },
    { field: 'equity1', question: 'What is the first partner\'s equity percentage?', type: 'number' },
    { field: 'partner2Name', question: 'What is the second partner\'s name?', type: 'text' },
    { field: 'partner2Address', question: 'What is the second partner\'s Ethereum address?', type: 'address' },
    { field: 'equity2', question: 'What is the second partner\'s equity percentage?', type: 'number' }
  ]
}

export function AIAssistant({ mode, onComplete, onBack }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contractType, setContractType] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [collectedData, setCollectedData] = useState({})
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const modeConfig = {
    upload: {
      title: 'Contract Conversion Assistant',
      initialMessage: "Hi! I'll help you convert your existing contract into a smart contract. Please describe what type of contract you have, or tell me about the key terms."
    },
    refine: {
      title: 'Contract Refinement Assistant',
      initialMessage: "Hello! I'll help you refine your contract framework. Please share your outline or describe the agreement you want to create."
    },
    scratch: {
      title: 'AI Contract Builder',
      initialMessage: "Hi! I'm here to help you create a smart contract from scratch. Let's start - what type of agreement do you need? For example:\n\n• Service contract (paying team, freelancers, contractors)\n• Loan agreement (borrowing or lending money)\n• Business partnership\n• Sale agreement\n\nOr just describe your situation!"
    }
  }

  useEffect(() => {
    // Initialize with AI greeting
    setMessages([{
      role: 'assistant',
      content: modeConfig[mode]?.initialMessage || modeConfig.scratch.initialMessage,
      timestamp: new Date()
    }])

    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const lastResultIndex = event.results.length - 1
        const transcript = event.results[lastResultIndex][0].transcript
        
        if (event.results[lastResultIndex].isFinal) {
          setInputText(prev => prev ? prev + ' ' + transcript.trim() : transcript.trim())
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          try {
            recognitionRef.current.start()
          } catch (error) {
            setIsListening(false)
          }
        } else {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [mode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const detectContractType = (text) => {
    const lowerText = text.toLowerCase()
    
    // Service agreement - check for payment/team/work keywords first
    if (lowerText.includes('service') || lowerText.includes('freelance') || 
        lowerText.includes('work') || lowerText.includes('pay') || 
        lowerText.includes('team') || lowerText.includes('staff') ||
        lowerText.includes('contractor') || lowerText.includes('employee') || 
        lowerText.includes('project') || lowerText.includes('monthly')) {
      return 'service'
    }
    
    // Loan
    if (lowerText.includes('loan') || lowerText.includes('borrow') || 
        lowerText.includes('lend')) {
      return 'peer-loan'
    }
    
    // Business partnership
    if (lowerText.includes('business') || lowerText.includes('partnership') || 
        lowerText.includes('partner') || lowerText.includes('equity')) {
      return 'business'
    }
    
    return null
  }

  const extractValue = (text, fieldType) => {
    const trimmed = text.trim()
    
    switch (fieldType) {
      case 'number':
        const num = trimmed.replace(/[^\d.]/g, '')
        return num ? parseFloat(num) : trimmed
      
      case 'address':
        // Look for Ethereum address pattern
        const addressMatch = trimmed.match(/0x[a-fA-F0-9]{40}/)
        return addressMatch ? addressMatch[0] : trimmed
      
      case 'date':
        // Try multiple date formats
        const trimmedLower = trimmed.toLowerCase()
        
        // Format 1: dd/mm/yyyy or dd-mm-yyyy
        const ddmmyyyy = trimmed.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
        if (ddmmyyyy) {
          const [_, day, month, year] = ddmmyyyy
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
        
        // Format 2: Handle text dates like "9th of November 2026"
        const months = {
          january: '01', february: '02', march: '03', april: '04',
          may: '05', june: '06', july: '07', august: '08',
          september: '09', october: '10', november: '11', december: '12'
        }
        
        // Extract day number (handles "9th", "1st", "2nd", "21st", etc.)
        const dayMatch = trimmed.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/)
        
        // Find month
        let monthNum = null
        for (const [monthName, num] of Object.entries(months)) {
          if (trimmedLower.includes(monthName)) {
            monthNum = num
            break
          }
        }
        
        // Extract year
        const yearMatch = trimmed.match(/\b(20\d{2})\b/)
        
        if (dayMatch && monthNum && yearMatch) {
          return `${yearMatch[1]}-${monthNum}-${dayMatch[1].padStart(2, '0')}`
        }
        
        return trimmed
      
      default:
        return trimmed
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = inputText
    setInputText('')
    setIsProcessing(true)

    try {
      await processUserResponse(userInput)
    } catch (error) {
      console.error('AI Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing that. Could you rephrase?",
        timestamp: new Date()
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const processUserResponse = async (userInput) => {
    await new Promise(resolve => setTimeout(resolve, 800))

    // Step 1: Detect contract type if not yet determined
    if (!contractType) {
      const detectedType = detectContractType(userInput)
      
      if (detectedType) {
        setContractType(detectedType)
        
        const typeNames = {
          'service': 'Service Agreement',
          'peer-loan': 'Peer-to-Peer Loan',
          'business': 'Business Partnership'
        }
        
        const flow = CONTRACT_FLOWS[detectedType]
        const response = `Perfect! I'll help you create a ${typeNames[detectedType]}. Let me ask you a few questions to gather the necessary details.\n\n${flow[0].question}`
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I understand. Could you clarify what type of contract you need? For example:\n• Service contract (for paying team/contractors)\n• Loan agreement\n• Business partnership\n• Or describe your specific situation",
          timestamp: new Date()
        }])
      }
      return
    }

    // Step 2: Process answer to current question
    const flow = CONTRACT_FLOWS[contractType]
    const currentQuestion = flow[currentQuestionIndex]
    
    // Extract and store the value
    const extractedValue = extractValue(userInput, currentQuestion.type)
    setCollectedData(prev => ({
      ...prev,
      [currentQuestion.field]: extractedValue
    }))

    // Move to next question or complete
    if (currentQuestionIndex < flow.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Got it! ${flow[nextIndex].question}`,
        timestamp: new Date()
      }])
    } else {
      // All questions answered
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Excellent! I've gathered all the information needed. Click 'Generate Smart Contract' below to review and finalize your contract.",
        timestamp: new Date()
      }])
    }
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser.')
      return
    }

    if (!isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        alert('Failed to start voice recognition.')
      }
    } else {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleGenerateContract = () => {
    const finalData = {
      ...collectedData,
      suggestedTemplate: contractType,
      conversationSummary: messages.map(m => m.content).join('\n'),
      timestamp: new Date()
    }
    
    onComplete(finalData)
  }

  const canGenerateContract = contractType && currentQuestionIndex >= CONTRACT_FLOWS[contractType].length - 1

  return (
    <div className="ai-assistant-screen">
      <div className="ai-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ai-badge"
        >
          <Sparkles size={16} />
          <span>{modeConfig[mode]?.title || 'AI Assistant'}</span>
        </motion.div>

        <h2>{modeConfig[mode]?.title || 'AI Contract Builder'}</h2>
        <p className="ai-subtitle">Chat with me to build your smart contract</p>
      </div>

      <div className="chat-wrapper">
        <div className="chat-container">
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`message ${message.role}`}
                >
                  <div className="message-icon">
                    {message.role === 'assistant' ? <Sparkles size={16} /> : '👤'}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="message assistant"
              >
                <div className="message-icon">
                  <Sparkles size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="chat-input-area">
          <div className="chat-input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice input..."
              className="chat-input"
              rows="1"
              disabled={isProcessing}
            />
            <div className="input-actions">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoiceInput}
                className={`voice-button ${isListening ? 'listening' : ''}`}
                title="Voice Input"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="send-button"
                disabled={!inputText.trim() || isProcessing}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>

          {canGenerateContract && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateContract}
              className="generate-button"
            >
              <FileText size={20} />
              Generate Smart Contract
            </motion.button>
          )}

          <div className="ai-tip">
            <span className="tip-icon">💡</span>
            <span className="tip-text">
              Tip: Be specific about amounts, dates, and parties involved. The more details you provide, the better your smart contract will be.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
