# 🤝 Cachengo Smart Contract Generator

**AI-powered smart contract generation with IPFS metadata storage and on-chain execution**

## 🎯 Project Overview

Cachengo is a professional contract builder that generates legally-binding smart contracts with:
- Rich metadata (parties, milestones, legal terms) stored on IPFS
- On-chain execution with automatic payment distribution
- Multi-party agreements with sub-party revenue splits
- Integration with ChatGPT for natural language contract generation

## 🏗️ Architecture
```
User Input → Frontend → IPFS (Pinata) → Smart Contract (Polygon) → Execution
                ↓                              ↓
          Full Metadata              Payment Distribution
```

### Key Components

1. **Frontend (React + Vite)**
   - Contract builder dashboard with glass-morphism UI
   - Agreement metadata, parties, milestones, legal terms
   - Revenue split visualization (Recharts pie chart)
   - MetaMask wallet integration

2. **IPFS Storage (Pinata)**
   - Immutable metadata storage
   - Full contract details, legal text, milestones
   - Referenced by on-chain contract via IPFS hash

3. **Smart Contract (Solidity)**
   - Lean on-chain contract with IPFS reference
   - Automatic payment distribution with sub-party support
   - Deployed on Polygon Amoy testnet

## 📦 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons
- **Blockchain:** Hardhat, Ethers.js, Solidity 0.8.20
- **Storage:** IPFS (Pinata API)
- **Network:** Polygon Amoy Testnet (Chain ID: 80002)

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- MetaMask wallet
- Polygon Amoy test MATIC

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd cachengo-smart-contract-demo

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

Create `.env` file in project root:
```env
# Polygon Amoy RPC
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Your wallet private key (TEST WALLET ONLY)
PRIVATE_KEY=your_private_key_here

# Pinata IPFS credentials
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### Development
```bash
# Compile smart contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start frontend dev server
cd frontend
npm run dev
```

## 📝 Contract Deployment

### Method 1: From JSON (Manual)
```bash
# 1. Create contract JSON using frontend
# 2. Save as contract-to-deploy.json in project root
# 3. Deploy with IPFS
npx hardhat run scripts/deploy-with-ipfs.ts --network amoy
```

### Method 2: Integrated (Coming Soon)

Deploy directly from frontend UI with one click.

## 🔗 Deployed Contracts

### Latest Deployment (Test)

- **Contract:** `0x6eC6bFaF8eB83627012fA122B4d52052372231F7`
- **IPFS Hash:** `QmaZ7g6ZWGTtNMwMsv9SVE7QiCMiKykNt7i695ae4CuxoE`
- **Network:** Polygon Amoy Testnet
- **Explorer:** https://www.oklink.com/amoy/address/0x6eC6bFaF8eB83627012fA122B4d52052372231F7

## 💡 How It Works

### 1. User Creates Agreement

User fills out contract builder:
- Metadata (title, dates, governing law)
- Parties with revenue splits (50/50, 60/40, etc.)
- Sub-parties (take % from parent's share)
- Payment milestones with conditions
- Legal terms (confidentiality, IP ownership, etc.)

### 2. System Uploads to IPFS
```javascript
// Full contract metadata stored immutably
{
  metadata: { title, description, dates, legal... },
  parties: [ { name, wallet, split, subParties... } ],
  payments: { milestones, currency, chain... },
  terms: { confidentiality, IP, termination... }
}
```

### 3. Smart Contract Deployed
```solidity
contract IPFSAgreement {
  string public ipfsHash;  // Points to full metadata
  Party[] public parties;   // On-chain party data
  
  function executeAgreement() payable {
    // Distributes payment according to splits
    // Handles sub-party allocations automatically
  }
}
```

### 4. Execution & Distribution

When parties execute:
- Send MATIC to contract
- Contract reads party splits
- Calculates sub-party shares (% of parent)
- Distributes automatically

**Example:**
- Party A: 50% → Gets 47.5% (50% - 2.5% sub-party)
  - Sub-party A1: 5% of Party A = 2.5% of total
- Party B: 50% → Gets 42.5% (50% - 7.5% sub-party)
  - Sub-party B1: 15% of Party B = 7.5% of total

## 🧪 Testing
```bash
# Run smart contract tests
npx hardhat test

# Check wallet balance
npx hardhat run scripts/check-balance.ts --network amoy

# Deploy test contract
npx hardhat run scripts/deploy-with-ipfs.ts --network amoy
```

## 📊 Project Structure
```
cachengo-smart-contract-demo/
├── contracts/              # Solidity smart contracts
│   ├── IPFSAgreement.sol  # Main IPFS-based contract
│   └── ...
├── scripts/                # Deployment & utility scripts
│   ├── deploy-with-ipfs.ts
│   ├── check-balance.ts
│   └── ...
├── test/                   # Smart contract tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main contract builder UI
│   │   ├── contracts/     # ABIs and config
│   │   └── ...
│   └── package.json
├── hardhat.config.ts       # Hardhat configuration
├── .env                    # Environment variables (not committed)
└── README.md
```

## 🔐 Security Notes

⚠️ **Important Security Practices:**

- Never commit `.env` file to Git
- Use TEST wallets only for development
- Never share private keys or API secrets
- Audit contracts before mainnet deployment
- Test thoroughly on testnet first

## 🛣️ Roadmap

- [x] Contract builder UI with full metadata
- [x] IPFS integration (Pinata)
- [x] Smart contract with sub-party splits
- [x] Deployment to Polygon Amoy
- [ ] Frontend deployment integration
- [ ] ChatGPT/GPT integration for natural language
- [ ] Contract templates library
- [ ] Multi-chain support (Ethereum, Base, etc.)
- [ ] EIP-712 signature support
- [ ] Mainnet deployment
- [ ] Cachengo Edge GPT integration

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Links

- **Polygon Amoy Faucet:** https://faucet.polygon.technology/
- **Pinata IPFS:** https://app.pinata.cloud/
- **Hardhat Docs:** https://hardhat.org/docs
- **Polygon Docs:** https://docs.polygon.technology/

## 📧 Contact

For questions or support, please open an issue.

---

**Built with ❤️ for the Cachengo ecosystem**
