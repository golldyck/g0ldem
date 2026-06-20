import { expect } from "chai";
import { ethers } from "hardhat";

describe("GolemINFT", () => {
  async function deploy() {
    const [owner, alice] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("GolemINFT");
    const nft = await factory.deploy();
    await nft.waitForDeployment();
    return { nft, owner, alice };
  }

  it("forges a golem and stores shem pointer + hashes", async () => {
    const { nft, alice } = await deploy();
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("encrypted-shem"));
    const personaHash = ethers.keccak256(ethers.toUtf8Bytes("nyx-7-persona"));

    await expect(
      nft.mint(alice.address, "ipfs://card", "0g://shem", metadataHash, personaHash)
    )
      .to.emit(nft, "Forged")
      .withArgs(0, anyAddr(), alice.address, metadataHash, personaHash);

    expect(await nft.ownerOf(0)).to.equal(alice.address);
    expect(await nft.tokenURI(0)).to.equal("ipfs://card");
    expect(await nft.totalMinted()).to.equal(1);

    const [encryptedURI, mh, ph] = await nft.golemData(0);
    expect(encryptedURI).to.equal("0g://shem");
    expect(mh).to.equal(metadataHash);
    expect(ph).to.equal(personaHash);
  });

  it("rejects empty shem URI", async () => {
    const { nft, alice } = await deploy();
    const h = ethers.keccak256(ethers.toUtf8Bytes("x"));
    await expect(
      nft.mint(alice.address, "ipfs://card", "", h, h)
    ).to.be.revertedWith("Golem: empty shem URI");
  });
});

// helper: match any address in withArgs
function anyAddr() {
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  return anyValue;
}
