import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  const contractAddress = "0xB31ec51ce49F0047C156f40b0aF0A78a369422b1";
  
  console.log("Interacting with SmartContractGenerator at:", contractAddress);
  
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );
  
  // Load contract
  const artifact = await hre.artifacts.readArtifact("SmartContractGenerator");
  const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);
  
  console.log("\n📊 Current agreement counter:", await contract.agreementCounter());
  
  // Create a test agreement
  console.log("\n🔄 Creating test agreement...");
  const party2 = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"; // Account #1
  const threshold = ethers.parseEther("0.5");
  const amount = ethers.parseEther("1.0");
  
  const tx = await contract.createAgreement(
    party2,
    threshold,
    6000, // 60%
    4000, // 40%
    { value: amount }
  );
  
  await tx.wait();
  console.log("✅ Agreement created! Transaction hash:", tx.hash);
  
  console.log("📊 New agreement counter:", await contract.agreementCounter());
  
  // Get agreement details
  const agreement = await contract.getAgreement(1);
  console.log("\n📋 Agreement Details:");
  console.log("  Party 1:", agreement.party1);
  console.log("  Party 2:", agreement.party2);
  console.log("  Amount:", ethers.formatEther(agreement.amount), "ETH");
  console.log("  Threshold:", ethers.formatEther(agreement.threshold), "ETH");
  console.log("  Party 1 Share:", agreement.party1Share / 100, "%");
  console.log("  Party 2 Share:", agreement.party2Share / 100, "%");
  console.log("  Executed:", agreement.executed);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
