import hre from "hardhat";
import { ethers } from "ethers";
import fs from 'fs';
import axios from 'axios';

async function uploadToIPFS(contractData: any): Promise<string> {
  console.log('📤 Uploading metadata to IPFS via Pinata...');
  
  const data = JSON.stringify({
    pinataContent: contractData,
    pinataMetadata: {
      name: `cachengo-contract-${contractData.metadata.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`
    }
  });

  const config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': process.env.PINATA_API_KEY!,
      'pinata_secret_api_key': process.env.PINATA_SECRET_KEY!
    },
    data: data
  };

  try {
    const response = await axios(config);
    const ipfsHash = response.data.IpfsHash;
    console.log('✅ Uploaded to IPFS:', ipfsHash);
    console.log('🔗 View metadata:', `https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    return ipfsHash;
  } catch (error: any) {
    console.error('Error uploading to IPFS:', error.response?.data || error.message);
    throw error;
  }
}

async function main() {
  const jsonPath = './contract-to-deploy.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Contract JSON not found:', jsonPath);
    process.exit(1);
  }

  const contractData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('🚀 Deploying Smart Contract with IPFS Metadata');
  console.log('═══════════════════════════════════════════════');
  console.log('📋 Title:', contractData.metadata.title);
  console.log('💰 Total Value:', contractData.payments.totalValue, contractData.payments.currency, '(stored in IPFS only)');
  console.log('👥 Parties:', contractData.parties.length);
  console.log('📅 Milestones:', contractData.payments.milestones.length);
  console.log('');

  // Step 1: Upload to IPFS
  const ipfsHash = await uploadToIPFS(contractData);
  
  // Step 2: Deploy smart contract with IPFS hash
  console.log('\n📝 Deploying smart contract to Polygon Amoy...');
  
  const provider = new ethers.JsonRpcProvider(
    process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  console.log('Deploying from:', wallet.address);
  
  const artifact = await hre.artifacts.readArtifact("IPFSAgreement");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  const contract = await factory.deploy(
    ipfsHash,
    contractData.metadata.title
  );
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log('\n✅ Smart Contract Deployed!');
  console.log('📍 Address:', address);
  console.log('🔍 Explorer:', `https://www.oklink.com/amoy/address/${address}`);
  
  // Step 3: Add parties to contract
  console.log('\n👥 Adding parties to contract...');
  for (let i = 0; i < contractData.parties.length; i++) {
    const party = contractData.parties[i];
    const isSub = party.role === "Sub-Party";
    const parentIndex = isSub ? contractData.parties.findIndex((p: any) => p.id === party.parentId) : 0;
    
    const tx = await contract.addParty(
      party.wallet || ethers.ZeroAddress,
      party.splitPct * 100, // Convert to basis points
      isSub,
      parentIndex
    );
    await tx.wait();
    
    const subInfo = isSub ? ` (sub-party of ${contractData.parties[parentIndex].displayName})` : '';
    console.log(`  ✓ ${party.displayName || party.role}: ${party.splitPct}%${subInfo}`);
  }
  
  // Step 4: Save deployment info
  const deploymentInfo = {
    contractAddress: address,
    ipfsHash: ipfsHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    network: "Polygon Amoy",
    chainId: 80002,
    explorerUrl: `https://www.oklink.com/amoy/address/${address}`,
    metadata: {
      title: contractData.metadata.title,
      totalValue: contractData.payments.totalValue,
      currency: contractData.payments.currency,
      parties: contractData.parties.length,
      milestones: contractData.payments.milestones.length
    },
    deployedAt: new Date().toISOString(),
    deployedBy: wallet.address
  };
  
  fs.writeFileSync(
    'deployed-contract.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log('\n💾 Deployment info saved to deployed-contract.json');
  console.log('\n🎉 SUCCESS! Smart contract deployed with IPFS metadata!');
  console.log('\n📖 How it works:');
  console.log('   1. Full contract details (1010 USDC value) stored on IPFS');
  console.log('   2. Smart contract references IPFS hash on-chain');
  console.log('   3. Parties send actual payment when executing (any amount)');
  console.log('   4. Contract distributes according to splits + sub-parties');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
