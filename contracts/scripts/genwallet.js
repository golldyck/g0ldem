// Generates a fresh throwaway HD wallet for the Galileo testnet.
// Writes the private key into contracts/.env (gitignored) and prints the
// 12-word recovery phrase + address so it can be imported into MetaMask.
const { Wallet } = require("ethers");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");

const w = Wallet.createRandom();
const env = [
  "# 0G Galileo Testnet",
  "OG_RPC_URL=https://evmrpc-testnet.0g.ai",
  "# Throwaway deployer key — testnet only, never reuse on mainnet.",
  `DEPLOYER_PRIVATE_KEY=${w.privateKey}`,
  "",
].join("\n");

fs.writeFileSync(envPath, env, { mode: 0o600 });

console.log("✅ New HD wallet generated. Private key saved to contracts/.env (gitignored).");
console.log("");
console.log("   Secret Recovery Phrase (12 words) — import into MetaMask:");
console.log(`   ${w.mnemonic.phrase}`);
console.log("");
console.log("   Address (fund THIS at https://faucet.0g.ai):");
console.log(`   ${w.address}`);
