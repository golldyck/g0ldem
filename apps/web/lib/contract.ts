// Deployed GolemINFT address. Set in apps/web/.env.local as NEXT_PUBLIC_GOLEM_ADDRESS.
export const GOLEM_ADDRESS = (process.env.NEXT_PUBLIC_GOLEM_ADDRESS || "") as `0x${string}` | "";

export const GOLEM_ABI = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "totalMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "golemData",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "encryptedURI", type: "string" },
      { name: "metadataHash", type: "bytes32" },
      { name: "personaHash", type: "bytes32" },
      { name: "creator", type: "address" },
    ],
  },
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI_", type: "string" },
      { name: "encryptedURI", type: "string" },
      { name: "metadataHash", type: "bytes32" },
      { name: "personaHash", type: "bytes32" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "event",
    name: "Forged",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "metadataHash", type: "bytes32", indexed: false },
      { name: "personaHash", type: "bytes32", indexed: false },
    ],
  },
] as const;
