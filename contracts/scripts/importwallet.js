// Imports a wallet from a BIP39 mnemonic passed as CLI args.
// Writes the derived private key into contracts/.env (gitignored), prints the address.
const { Wallet } = require("ethers");
const fs = require("fs");
const path = require("path");

const phrase = process.argv.slice(2).join(" ").trim();
if (!phrase) {
  console.error("Usage: node scripts/importwallet.js <12 words>");
  process.exit(1);
}

let w;
try {
  w = Wallet.fromPhrase(phrase);
} catch (e) {
  console.error("❌ Invalid mnemonic:", e.shortMessage || e.message);
  process.exit(1);
}

const envPath = path.join(__dirname, "..", ".env");
const env = [
  "# 0G Galileo Testnet",
  "OG_RPC_URL=https://evmrpc-testnet.0g.ai",
  "# Imported from user's MetaMask seed phrase — testnet only.",
  `DEPLOYER_PRIVATE_KEY=${w.privateKey}`,
  "",
].join("\n");
fs.writeFileSync(envPath, env, { mode: 0o600 });

console.log("✅ Wallet imported. Private key saved to contracts/.env (gitignored).");
console.log("");
console.log("   Derived address (must match your MetaMask account):");
console.log(`   ${w.address}`);
