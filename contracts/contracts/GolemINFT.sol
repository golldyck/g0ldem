// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title GolemINFT — Ownable AI Agents (Golems) as Intelligent NFTs on 0G
/// @notice Lore: a golem is forged from clay (the base LLM on 0G Compute) and brought to
///         life by a written word, the *shem* (the persona prompt = the encrypted brain).
///         The shem lives encrypted in 0G Storage; on-chain we keep only the public card
///         metadata (`tokenURI`), the encrypted-brain pointer (`encryptedURI`) and its
///         `metadataHash`. The shem is NEVER stored or logged in plaintext (SPEC §4.1).
/// @dev    "forge" == mint. Phase 2 adds ERC-7857 secure transfer (oracle proof, nonce +
///         expiry, re-encryption). Function names stay technical for tooling/standard
///         compatibility; the lore lives in the UI/narrative (SPEC §0).
contract GolemINFT is ERC721, Ownable, ReentrancyGuard {
    struct GolemData {
        string encryptedURI;   // the shem: pointer to the AES-256-GCM encrypted brain in 0G Storage
        bytes32 metadataHash;  // keccak256 commit of the encrypted metadata (anti-tamper)
        bytes32 personaHash;   // hash of the public persona → seeds the Soul Sigil
        address creator;       // original forger (vibe-coder)
    }

    uint256 private _nextTokenId;
    mapping(uint256 => GolemData) private _golems;
    mapping(uint256 => string) private _tokenURIs; // public passport-card metadata

    /// @dev Emitted when a golem is forged (minted).
    event Forged(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed owner,
        bytes32 metadataHash,
        bytes32 personaHash
    );

    constructor() ERC721("Golem", "GLDM") Ownable(msg.sender) {}

    /// @notice Forge (mint) a golem INFT. Phase 1 flow; secured with proofs/oracle in Phase 2.
    /// @param to            recipient (owner) of the golem
    /// @param tokenURI_     public card metadata URI (0G Storage or data: URI)
    /// @param encryptedURI  the shem — pointer to the encrypted brain in 0G Storage
    /// @param metadataHash  keccak256 of the encrypted metadata
    /// @param personaHash   keccak256 of canonical public persona (Soul Sigil seed)
    function mint(
        address to,
        string calldata tokenURI_,
        string calldata encryptedURI,
        bytes32 metadataHash,
        bytes32 personaHash
    ) external nonReentrant returns (uint256 tokenId) {
        require(to != address(0), "Golem: zero recipient");
        require(bytes(encryptedURI).length != 0, "Golem: empty shem URI");
        require(metadataHash != bytes32(0), "Golem: empty metadata hash");

        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI_;
        _golems[tokenId] = GolemData({
            encryptedURI: encryptedURI,
            metadataHash: metadataHash,
            personaHash: personaHash,
            creator: msg.sender
        });

        emit Forged(tokenId, msg.sender, to, metadataHash, personaHash);
    }

    /// @notice Public passport-card metadata. The shem stays private in `encryptedURI`.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    /// @notice Encrypted shem pointer + integrity hashes for a golem.
    function golemData(uint256 tokenId)
        external
        view
        returns (string memory encryptedURI, bytes32 metadataHash, bytes32 personaHash, address creator)
    {
        _requireOwned(tokenId);
        GolemData storage g = _golems[tokenId];
        return (g.encryptedURI, g.metadataHash, g.personaHash, g.creator);
    }

    /// @notice Total golems forged so far.
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }
}
