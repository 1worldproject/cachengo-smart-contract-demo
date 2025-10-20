import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Loader, Sparkles, FileText, ArrowLeft } from 'lucide-react'

export function AIAssistant({ mode, onComplete, onBack }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contractData, setContractData] = useState({})
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
      initialMessage: "Hi! I'm here to help you create a smart contract from scratch. Let's start - what type of agreement do you need? For example: loan agreement, service contract, sale agreement, etc."
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
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        console.log("Voice transcript received:", transcript)
        setInputText(prev => (prev ? prev + ' ' : '') + transcript.trim())
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (event.error === 'no-speech') {
          // User didn't speak, just reset silently
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings.')
        } else if (event.error === 'audio-capture') {
          alert('No microphone found. Please connect a microphone and try again.')
        } else {
          alert('Voice recognition error: ' + event.error)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsProcessing(true)

    try {
      // Simulate AI response
      await simulateAIResponse(inputText)
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

  const simulateAIResponse = async (userInput) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const lowerInput = userInput.toLowerCase()
    let response = ''

    // Simple response logic based on keywords
    if (lowerInput.includes('loan') || lowerInput.includes('borrow') || lowerInput.includes('lend')) {
      response = "Great! A loan agreement. Let me gather some details:\n\n1. Who is the lender? (Please provide their Ethereum address)\n2. Who is the borrower? (Ethereum address)\n3. What is the loan amount in MATIC?\n4. What is the interest rate?\n5. When is the repayment deadline?\n\nPlease provide these details and I'll help structure your smart contract."
    } else if (lowerInput.includes('service') || lowerInput.includes('work') || lowerInput.includes('freelance')) {
      response = "Perfect! A service agreement. I'll need:\n\n1. Service provider's Ethereum address\n2. Client's Ethereum address\n3. Description of services\n4. Payment amount in MATIC\n5. Project deadline\n6. Milestones (if any)\n\nShare these details and we'll create your contract."
    } else if (lowerInput.includes('sale') || lowerInput.includes('buy') || lowerInput.includes('sell')) {
      response = "Understood! A sale agreement. Please tell me:\n\n1. What's being sold?\n2. Seller's Ethereum address\n3. Buyer's Ethereum address\n4. Sale price in MATIC\n5. Any special conditions?\n\nProvide these details and I'll help create the contract."
    } else if (messages.length <= 2) {
      response = "I see. To help you better, could you specify what type of contract you need? For example:\n\n• Loan agreement\n• Service contract\n• Sale agreement\n• Partnership agreement\n• Rental agreement\n\nOr describe your specific situation and I'll guide you."
    } else {
      response = "Thank you for that information. Could you provide more specific details about the parties involved (Ethereum addresses) and the key terms (amounts, dates, conditions)? The more details you provide, the better I can help structure your smart contract."
    }

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    }])
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (!isListening) {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Failed to start voice recognition:', error)
        alert('Failed to start voice recognition. Please try again.')
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
    // Extract contract data from conversation
    // This is a simplified version - in production, use proper NLP
    onComplete(contractData)
  }

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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`chat-message ${message.role}`}
                >
                  <div className={`message-avatar ${message.role}`}>
                    {message.role === 'assistant' ? <Sparkles size={20} /> : '👤'}
                  </div>
                  <div className="message-content">
                    <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="chat-message assistant"
              >
                <div className="message-avatar assistant">
                  <Sparkles size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-wrapper">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice input..."
              className="chat-input"
              rows="3"
              disabled={isProcessing}
            />

            <div className="input-actions">
              <button
                onClick={toggleVoiceInput}
                className={`voice-button ${isListening ? 'listening' : ''}`}
                title={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={handleSendMessage}
                className="send-button"
                disabled={!inputText.trim() || isProcessing}
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {messages.length > 4 && (
            <button
              onClick={handleGenerateContract}
              className="generate-contract-button"
            >
              <FileText size={20} />
              Generate Smart Contract
            </button>
          )}
        </div>
      </div>

      <div className="ai-info">
        <p className="disclaimer">
          💡 <strong>Tip:</strong> Be specific about amounts, dates, and parties involved.
          The more details you provide, the better your smart contract will be.
        </p>
      </div>
    </div>
  )
}
