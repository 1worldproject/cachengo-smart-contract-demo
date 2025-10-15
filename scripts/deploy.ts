import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Deploying SmartContractGenerator...");
  console.log("Network:", hre.network.name);

  let wallet: ethers.Wallet;
  let provider: ethers.Provider;

  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    // Local network - use first hardhat account
    provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      provider
    );
    console.log("Deploying from:", wallet.address);
  } else {
    // Remote network - use .env private key
    provider = new ethers.JsonRpcProvider(
      process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology"
    );
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    console.log("Deploying from:", wallet.address);
  }

  // Read the contract artifact
  const artifact = await hre.artifacts.readArtifact("SmartContractGenerator");
  
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ SmartContractGenerator deployed to:", address);
  console.log("📝 Save this address for frontend integration!");
  
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    console.log("🔍 Local deployment - check your Hardhat node terminal for transaction details");
  } else {
    console.log(`🔍 View on Explorer: https://www.oklink.com/amoy/address/${address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
