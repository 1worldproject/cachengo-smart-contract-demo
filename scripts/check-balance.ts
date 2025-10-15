import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider(
    process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology"
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const address = wallet.address;
  const balance = await provider.getBalance(address);
  
  console.log("Account:", address);
  console.log("Balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    console.log("\n⚠️  You need test MATIC! Get some from:");
    console.log("https://faucet.polygon.technology/");
  } else {
    console.log("\n✅ You have MATIC! Ready to deploy.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
