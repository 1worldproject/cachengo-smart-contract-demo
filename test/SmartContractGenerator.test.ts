import { expect } from "chai";
import hre from "hardhat";

describe("SmartContractGenerator", function () {
  it("Should deploy successfully", async function () {
    const artifact = await hre.artifacts.readArtifact("SmartContractGenerator");
    expect(artifact.contractName).to.equal("SmartContractGenerator");
    expect(artifact.abi).to.not.be.undefined;
  });

  it("Should have correct contract structure", async function () {
    const artifact = await hre.artifacts.readArtifact("SmartContractGenerator");
    const abiNames = artifact.abi.map((item: any) => item.name);
    
    expect(abiNames).to.include("createAgreement");
    expect(abiNames).to.include("executeAgreement");
    expect(abiNames).to.include("getAgreement");
  });
});
