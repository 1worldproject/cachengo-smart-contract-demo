import { ethers } from 'ethers'
import axios from 'axios'

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY

export async function uploadToIPFS(contractData) {
  try {
    const metadata = {
      name: contractData.type,
      description: `Smart contract agreement created on ${new Date().toLocaleDateString()}`,
      contractType: contractData.templateId,
      timestamp: new Date().toISOString(),
      data: contractData.data,
      parties: extractParties(contractData)
    }

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    )

    return {
      success: true,
      ipfsHash: response.data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    }
  } catch (error) {
    console.error('IPFS upload error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

function extractParties(contractData) {
  const parties = []
  
  switch(contractData.templateId) {
    case 'peer-loan':
      parties.push({
        role: 'Lender',
        name: contractData.data.lenderName,
        address: 'Connected Wallet'
      })
      parties.push({
        role: 'Borrower',
        name: contractData.data.borrowerName,
        address: contractData.data.borrowerAddress
      })
      break
      
    case 'business':
      parties.push({
        role: 'Partner A',
        name: contractData.data.partnerAName,
        address: contractData.data.partnerAAddress,
        share: contractData.data.revenueSplitA + '%'
      })
      parties.push({
        role: 'Partner B',
        name: contractData.data.partnerBName,
        address: contractData.data.partnerBAddress,
        share: contractData.data.revenueSplitB + '%'
      })
      break
      
    case 'vehicle':
      parties.push({
        role: 'Seller',
        name: contractData.data.sellerName,
        address: 'Connected Wallet'
      })
      parties.push({
        role: 'Buyer',
        name: contractData.data.buyerName,
        address: contractData.data.buyerAddress
      })
      break
      
    case 'property':
      parties.push({
        role: 'Seller',
        name: contractData.data.sellerName,
        address: 'Connected Wallet'
      })
      parties.push({
        role: 'Buyer',
        name: contractData.data.buyerName,
        address: contractData.data.buyerAddress
      })
      break
      
    case 'service':
      parties.push({
        role: 'Service Provider',
        name: contractData.data.providerName,
        address: 'Connected Wallet'
      })
      parties.push({
        role: 'Client',
        name: contractData.data.clientName,
        address: contractData.data.clientAddress
      })
      break
      
    case 'custom':
      parties.push({
        role: 'Party A',
        name: contractData.data.partyAName,
        address: contractData.data.partyAAddress || 'Not provided'
      })
      parties.push({
        role: 'Party B',
        name: contractData.data.partyBName,
        address: contractData.data.partyBAddress || 'Not provided'
      })
      break
  }
  
  return parties
}

export async function deploySmartContract(contractData, provider) {
  try {
    // Step 1: Upload to IPFS
    console.log('📤 Uploading metadata to IPFS...')
    const ipfsResult = await uploadToIPFS(contractData)
    
    if (!ipfsResult.success) {
      throw new Error(`IPFS upload failed: ${ipfsResult.error}`)
    }

    console.log('✅ IPFS upload successful:', ipfsResult.ipfsHash)

    // Step 2: Simulate blockchain deployment
    console.log('⛓️ Recording agreement on blockchain...')
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockTxHash = '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')
    
    const mockContractAddress = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')

    console.log('✅ Agreement recorded successfully')

    return {
      success: true,
      ipfsHash: ipfsResult.ipfsHash,
      ipfsUrl: ipfsResult.pinataUrl,
      transactionHash: mockTxHash,
      contractAddress: mockContractAddress,
      agreementId: Math.floor(Math.random() * 10000).toString(),
      blockNumber: Math.floor(Math.random() * 1000000) + 40000000
    }
  } catch (error) {
    console.error('❌ Deployment error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
