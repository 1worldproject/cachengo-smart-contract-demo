import hre from "hardhat";
import { ethers } from "ethers";
import fs from 'fs';

async function main() {
  // Read the contract JSON (you can pass filename as argument)
  const jsonPath = process.argv[2] || './contract-to-deploy.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Contract JSON not found:', jsonPath);
    console.log('Usage: npx hardhat run scripts/deploy-from-json.ts --network amoy <path-to-json>');
    process.exit(1);
  }

  const contractData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('📋 Deploying contract from JSON...');
  console.log('Title:', contractData.metadata.title);
  console.log('Total Value:', contractData.payments.totalValue, contractData.payments.currency);
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(
    process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  console.log('Deploying from:', wallet.address);
  
  // Deploy main contract
  const artifact = await hre.artifacts.readArtifact("AdvancedAgreement");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  const contract = await factory.deploy(
    contractData.metadata.title,
    contractData.metadata.description,
    ethers.parseEther(contractData.payments.totalValue.toString())
  );
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log('\n✅ Contract deployed to:', address);
  console.log('🔍 View on Explorer:', `https://www.oklink.com/amoy/address/${address}`);
  
  // Add parties
  console.log('\n👥 Adding parties...');
  for (let i = 0; i < contractData.parties.length; i++) {
    const party = contractData.parties[i];
    const isSub = party.role === "Sub-Party";
    const parentIndex = isSub ? contractData.parties.findIndex(p => p.id === party.parentId) : 0;
    
    const tx = await contract.addParty(
      party.wallet || ethers.ZeroAddress,
      party.displayName || party.role,
      party.splitPct * 100, // Convert to basis points
      isSub,
      parentIndex
    );
    await tx.wait();
    console.log(`  ✓ Added ${party.role}: ${party.displayName || party.role} (${party.splitPct}%)`);
  }
  
  // Add milestones
  console.log('\n💰 Adding milestones...');
  for (const milestone of contractData.payments.milestones) {
    const dueDate = milestone.dueDate ? Math.floor(new Date(milestone.dueDate).getTime() / 1000) : 0;
    
    const tx = await contract.addMilestone(
      milestone.label,
      ethers.parseEther(milestone.amount.toString()),
      dueDate,
      milestone.conditions || ''
    );
    await tx.wait();
    console.log(`  ✓ Added milestone: ${milestone.label} (${milestone.amount} ${contractData.payments.currency})`);
  }
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: address,
    network: "Polygon Amoy",
    chainId: 80002,
    explorerUrl: `https://www.oklink.com/amoy/address/${address}`,
    metadata: contractData.metadata,
    deployedAt: new Date().toISOString(),
    deployedBy: wallet.address
  };
  
  fs.writeFileSync(
    'deployed-contract.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log('\n💾 Deployment info saved to deployed-contract.json');
  console.log('\n🎉 Smart contract successfully deployed with all metadata!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
