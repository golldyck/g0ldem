import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// 0G Galileo Testnet — verified against docs.0g.ai/developer-hub/testnet/testnet-overview
// chainId 16602 (NOT 16601 — that is the deprecated initial Galileo id)
const GALILEO_RPC = process.env.OG_RPC_URL || "https://evmrpc-testnet.0g.ai";
const GALILEO_CHAIN_ID = 16602;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    galileo: {
      url: GALILEO_RPC,
      chainId: GALILEO_CHAIN_ID,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  // Block explorer: https://chainscan-galileo.0g.ai
  etherscan: {
    apiKey: { galileo: "empty" },
    customChains: [
      {
        network: "galileo",
        chainId: GALILEO_CHAIN_ID,
        urls: {
          apiURL: "https://chainscan-galileo.0g.ai/open/api",
          browserURL: "https://chainscan-galileo.0g.ai",
        },
      },
    ],
  },
};

export default config;
