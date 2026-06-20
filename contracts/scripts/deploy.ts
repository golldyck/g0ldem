import { ethers, network } from "hardhat";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`Network:  ${network.name} (chainId ${network.config.chainId})`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance:  ${ethers.formatEther(balance)} 0G`);

  if (balance === 0n) {
    throw new Error("Deployer has 0 balance — fund it at https://faucet.0g.ai");
  }

  const factory = await ethers.getContractFactory("GolemINFT");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`\n✅ GolemINFT deployed at: ${address}`);
  console.log(`   Explorer: https://chainscan-galileo.0g.ai/address/${address}`);

  // Persist address so the SDK / frontend can read it
  const out = {
    network: network.name,
    chainId: Number(network.config.chainId),
    GolemINFT: address,
    deployedAt: new Date().toISOString(),
  };
  const dir = join(__dirname, "..", "deployments");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${network.name}.json`), JSON.stringify(out, null, 2));
  console.log(`   Saved → contracts/deployments/${network.name}.json`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
