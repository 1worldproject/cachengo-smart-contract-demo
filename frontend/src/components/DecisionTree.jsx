import { motion } from 'framer-motion'
import { FileUp, FileText, Sparkles, Zap, ArrowLeft } from 'lucide-react'

export function DecisionTree({ onPathSelect, onBack }) {
  const paths = [
    {
      id: 'existing-contract',
      icon: FileUp,
      title: 'I Have an Existing Contract',
      description: 'Upload your current agreement and convert it to a smart contract',
      color: 'from-blue-400 to-cyan-500',
      action: 'upload'
    },
    {
      id: 'framework',
      icon: FileText,
      title: 'I Have a Framework/Outline',
      description: 'Let AI help refine your contract outline into a complete agreement',
      color: 'from-purple-400 to-pink-500',
      action: 'refine'
    },
    {
      id: 'scratch',
      icon: Sparkles,
      title: 'Start From Scratch',
      description: 'Build a completely custom contract with AI guidance',
      color: 'from-pink-400 to-rose-500',
      action: 'scratch'
    },
    {
      id: 'templates',
      icon: Zap,
      title: 'Use Quick Templates',
      description: 'Choose from pre-built templates for common contracts',
      color: 'from-green-400 to-emerald-500',
      action: 'templates'
    }
  ]

  return (
    <div className="decision-tree-screen">
      <div className="decision-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="wizard-badge"
        >
          <Sparkles size={16} />
          <span>Smart Contract Wizard</span>
        </motion.div>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          What brings you here today?
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="decision-subtitle"
        >
          Let's find the best way to create your smart contract
        </motion.p>
      </div>

      <div className="decision-grid">
        {paths.map((path, index) => {
          const Icon = path.icon
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="decision-card"
              onClick={() => onPathSelect(path.action)}
            >
              <div className={`decision-icon bg-gradient-to-br ${path.color}`}>
                <Icon size={40} />
              </div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className="decision-arrow">→</div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="learn-more"
      >
        <button className="text-link">
          ℹ️ What is a Smart Contract?
        </button>
      </motion.div>
    </div>
  )
}
