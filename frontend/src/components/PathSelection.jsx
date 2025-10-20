import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'

export function PathSelection({ onSelect, onBack }) {
  return (
    <div className="path-selection-screen">
      <div className="path-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>How would you like to create your contract?</h2>
        <p className="path-subtitle">Choose the method that works best for you</p>
      </div>

      <div className="path-options">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="path-option ai-path"
          onClick={() => onSelect('ai')}
        >
          <div className="path-icon">
            <Sparkles size={48} />
          </div>
          <h3>AI Assistant</h3>
          <p>Have a conversation with our AI to build your contract step-by-step</p>
          <ul className="path-features">
            <li>✨ Conversational interface</li>
            <li>🎤 Voice input supported</li>
            <li>🤖 Intelligent guidance</li>
            <li>📝 Customized to your needs</li>
          </ul>
          <div className="path-badge recommended">Recommended</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="path-option template-path"
          onClick={() => onSelect('templates')}
        >
          <div className="path-icon">
            <Zap size={48} />
          </div>
          <h3>Quick Templates</h3>
          <p>Start with pre-built templates and fill in the details</p>
          <ul className="path-features">
            <li>⚡ Fast and simple</li>
            <li>📋 6 ready-to-use templates</li>
            <li>✅ Pre-validated structure</li>
            <li>🚀 Deploy in minutes</li>
          </ul>
          <div className="path-badge fast">Fastest</div>
        </motion.div>
      </div>

      <div className="path-comparison">
        <h4>Not sure which to choose?</h4>
        <div className="comparison-grid">
          <div className="comparison-item">
            <strong>Use AI Assistant if:</strong>
            <ul>
              <li>You want personalized guidance</li>
              <li>Your contract has unique requirements</li>
              <li>You prefer conversational interaction</li>
            </ul>
          </div>
          <div className="comparison-item">
            <strong>Use Quick Templates if:</strong>
            <ul>
              <li>You know exactly what you need</li>
              <li>Your contract fits a standard format</li>
              <li>You want the fastest path to deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
