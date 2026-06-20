// 0G Storage wrapper — server-only. Uploads the encrypted shem (ciphertext) from
// memory via MemData (no temp file), returns the content-addressed root hash.
import { Indexer, MemData } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";

const EVM_RPC = process.env.OG_RPC_URL || "https://evmrpc-testnet.0g.ai";
const INDEXER_RPC = process.env.OG_INDEXER_RPC || "https://indexer-storage-testnet-turbo.0g.ai";

function serverSigner(): ethers.Wallet {
  const pk = process.env.SERVER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
  if (!pk) throw new Error("SERVER_PRIVATE_KEY / DEPLOYER_PRIVATE_KEY not set");
  const provider = new ethers.JsonRpcProvider(EVM_RPC);
  return new ethers.Wallet(pk, provider);
}

const indexer = new Indexer(INDEXER_RPC);

/** Upload raw bytes (e.g. ciphertext) to 0G Storage. Returns the root hash (URI). */
export async function uploadBytes(bytes: Uint8Array): Promise<string> {
  const data = new MemData(bytes);
  const [tree, treeErr] = await data.merkleTree();
  if (treeErr !== null || !tree) throw treeErr ?? new Error("merkleTree failed");
  const rootHash = tree.rootHash();
  if (!rootHash) throw new Error("no root hash");

  const [, uploadErr] = await indexer.upload(data, EVM_RPC, serverSigner());
  // "Data already exists" is fine — the content is content-addressed by rootHash.
  if (uploadErr !== null && !/already exists/i.test(String(uploadErr))) {
    throw uploadErr;
  }
  return rootHash;
}

/** Download bytes by root hash, in-memory (no disk). */
export async function downloadBytes(rootHash: string): Promise<Buffer> {
  const [blob, dlErr] = await indexer.downloadToBlob(rootHash);
  if (dlErr !== null) throw dlErr;
  return Buffer.from(await blob.arrayBuffer());
}

/** Convenience uploader matching sealShem's injected signature. */
export const uploadShemBlob = (blob: Buffer) => uploadBytes(new Uint8Array(blob));
