# Cachengo Smart Contract Generator

A modern, user-friendly Web3 application for creating and deploying smart contract agreements to the blockchain. Generate legal agreements in seconds without needing lawyers or technical blockchain knowledge.

![Cachengo Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.1-blue)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.15-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### 6 Professional Contract Templates
- **💰 Peer-to-Peer Loan** - Create secure loan agreements with interest rates, duration, and repayment schedules
- **🤝 Business Partnership** - Define revenue splits, milestones, and equity agreements
- **🚗 Vehicle Sale** - Complete vehicle sale contracts with VIN, mileage, and payment terms
- **🏠 Property Sale** - Real estate transactions with contingencies and closing dates
- **📋 Service Agreement** - Freelance and contractor agreements with deliverables and milestones
- **⚡ Custom Contract** - Build fully customizable contracts from scratch

### Core Functionality
- ✨ Beautiful, animated user interface with smooth transitions
- 🔗 MetaMask wallet integration for Polygon Amoy testnet
- ✅ Comprehensive form validation (Ethereum addresses, required fields, data types)
- 📦 **Real IPFS storage via Pinata** - All contract data stored permanently and immutably
- 🎯 Success screens with blockchain details and transaction links
- 🔗 Direct links to PolygonScan and IPFS for verification
- 📱 **Fully responsive** - Optimized for mobile, tablet, and desktop
- 🎨 Modern design with glassmorphism, gradients, and micro-animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Polygon Amoy testnet configured in MetaMask
- Test MATIC tokens (get from [Polygon Faucet](https://faucet.polygon.technology/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/1worldproject/cachengo-smart-contract-demo.git
cd cachengo-smart-contract-demo
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `frontend` directory:
```env
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
VITE_CONTRACT_ADDRESS=0x6eC6bFaF8eB83627012fA122B4d52052372231F7
VITE_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

**Getting Pinata Credentials:**
1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Navigate to API Keys in your dashboard
3. Create a new API key with pinning permissions
4. Copy the API Key and Secret Key to your `.env` file

4. **Start the development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating Your First Contract

1. **Connect Wallet**
   - Click "Connect Wallet to Start" on the landing page
   - Approve the MetaMask connection request
   - Ensure you're on Polygon Amoy testnet

2. **Select Template**
   - Choose from 6 professional contract templates
   - Each template is pre-configured for specific use cases

3. **Fill Out the Form**
   - Complete all required fields (marked with *)
   - Enter valid Ethereum addresses for counter-parties
   - Add relevant details like amounts, dates, and terms

4. **Deploy Contract**
   - Click "Deploy Contract"
   - Your contract metadata is uploaded to IPFS (permanent storage)
   - A blockchain record is created (simulated for demo)
   - View success screen with all deployment details

5. **Access Your Contract**
   - Copy the IPFS hash to view metadata
   - Click external links to view on PolygonScan and IPFS
   - Download PDF (coming soon)

## 🏗️ Project Structure
```
cachengo-smart-contract-demo/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TemplateForms.jsx      # All 6 contract form components
│   │   ├── utils/
│   │   │   └── deployment.js          # IPFS upload & deployment logic
│   │   ├── App.jsx                    # Main application component
│   │   ├── App.css                    # Responsive styles
│   │   ├── index.css                  # Global styles
│   │   └── main.jsx                   # React entry point
│   ├── .env                           # Environment variables
│   ├── package.json                   # Dependencies
│   └── vite.config.js                 # Vite configuration
├── contracts/
│   └── IPFSAgreement.sol              # Smart contract (Solidity)
├── scripts/
│   └── deploy-with-ipfs.ts            # Deployment script
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1** - Modern UI library with hooks
- **Vite 7.1** - Lightning-fast build tool and dev server
- **Framer Motion 12.23** - Smooth animations and transitions
- **Ethers.js 6.15** - Ethereum library for blockchain interaction
- **Lucide React** - Beautiful, consistent icons
- **Axios** - HTTP client for API requests

### Blockchain & Storage
- **Polygon Amoy Testnet** - Layer 2 scaling solution
- **IPFS (via Pinata)** - Decentralized storage for contract metadata
- **Solidity** - Smart contract programming language
- **MetaMask** - Web3 wallet for authentication

### Styling
- **CSS3** with custom properties
- **Glassmorphism** effects
- **Gradient backgrounds**
- **Responsive breakpoints** for all devices

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 **Mobile phones** (320px - 480px) - iPhone SE, Galaxy S8+
- 📲 **Large phones** (481px - 767px) - iPhone 12 Pro, Pixel 7
- 📋 **Tablets** (768px - 1024px) - iPad, iPad Pro, Surface Pro
- 💻 **Desktops** (1025px+) - Full desktop experience

### Responsive Features
- Stacked layouts on mobile (single column)
- Touch-friendly buttons and inputs (min 44px tap targets)
- Optimized font sizes for readability
- Flexible grid systems
- Landscape mode support

## 🔐 Security Considerations

### Current Implementation
- ✅ Client-side validation for all form inputs
- ✅ Ethereum address validation using ethers.js
- ✅ Secure MetaMask integration
- ✅ IPFS metadata stored immutably
- ⚠️ **Demo Mode**: Blockchain transactions are currently simulated

### Production Recommendations
- [ ] Add server-side validation
- [ ] Implement rate limiting for IPFS uploads
- [ ] Add multi-signature support for high-value contracts
- [ ] Integrate real contract deployment with compiled bytecode
- [ ] Add contract verification on PolygonScan
- [ ] Implement audit logging
- [ ] Add encryption for sensitive data before IPFS upload

## 🧪 Testing

### Manual Testing Checklist
- [ ] Connect/disconnect MetaMask wallet
- [ ] Fill out each contract template
- [ ] Test form validation (invalid addresses, missing fields)
- [ ] Deploy contract and verify IPFS upload
- [ ] Check success screen displays correct data
- [ ] Test responsive design on multiple devices
- [ ] Verify external links work (PolygonScan, IPFS)

### Test Data
Use these sample Ethereum addresses for testing:
- `0x70B18355667E8F5Ba99F13b1542B61eC988f339b`
- `0x3313140fda6843b64fA29eC3EA55690d66b71A09`

## 🚢 Deployment

### Build for Production
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables for Production
Remember to set these in your hosting platform:
- `VITE_PINATA_API_KEY`
- `VITE_PINATA_SECRET_KEY`
- `VITE_CONTRACT_ADDRESS`
- `VITE_POLYGON_RPC_URL`

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Complete)
- [x] 6 contract templates
- [x] MetaMask integration
- [x] IPFS storage via Pinata
- [x] Responsive design
- [x] Form validation

### Phase 2: Enhanced Features (In Progress)
- [ ] PDF generation with professional formatting
- [ ] Email notifications on contract deployment
- [ ] Contract dashboard (view all your contracts)
- [ ] Real blockchain deployment (not simulated)
- [ ] Multi-language support

### Phase 3: Advanced Features (Planned)
- [ ] Multi-signature contracts
- [ ] Payment escrow functionality
- [ ] Contract templates marketplace
- [ ] AI-powered contract generation via voice
- [ ] Integration with DocuSign for off-chain signatures
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Cachengo** - Smart Contract Generator
- GitHub: [@1worldproject](https://github.com/1worldproject)
- Repository: [cachengo-smart-contract-demo](https://github.com/1worldproject/cachengo-smart-contract-demo)

## 🙏 Acknowledgments

- **Anthropic Claude** - AI assistance in development
- **Polygon** - Layer 2 scaling solution
- **Pinata** - IPFS pinning service
- **MetaMask** - Web3 wallet
- **Framer Motion** - Animation library
- **Lucide** - Icon library

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact: [Your contact information]

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Link to docs]
- **Smart Contract**: [PolygonScan Link](https://amoy.polygonscan.com/address/0x6eC6bFaF8eB83627012fA122B4d52052372231F7)

---

**Built with ❤️ for the Web3 community**

*Making legal agreements accessible, transparent, and blockchain-powered.*
