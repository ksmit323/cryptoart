// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Cryptoart NFT
 * @dev A smart contract for Cryptoart that bridges physical art with NFTs
 * Each physical art piece with a private key can be verified and claimed as an NFT
 */
contract CryptoartNFT is ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using ECDSA for bytes32;

    // Events
    event ArtPieceClaimed(address indexed collector, uint256 indexed tokenId, string artPieceId);
    event BaseURIUpdated(string newBaseURI);
    event ClaimSignerUpdated(address newSigner);

    // Storage
    string private _baseTokenURI;
    mapping(string => bool) private _claimedArtPieces; // artPieceId => claimed status
    mapping(string => uint256) private _artPieceToTokenId; // artPieceId => tokenId
    mapping(uint256 => string) private _tokenIdToArtPieceId; // tokenId => artPieceId
    mapping(string => uint256) private _editionSizes; // edition => max supply
    mapping(string => uint256) private _editionMinted; // edition => current supply

    uint256 private _tokenIdCounter;
    address private _claimSigner;
    bool public claimingActive = true;

    /**
     * @dev Constructor initializes the NFT contract with a name and symbol
     * @param name The name of the NFT collection
     * @param symbol The symbol for the NFT collection
     * @param baseURI The base URI for token metadata
     * @param claimSigner The address authorized to sign claim messages
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address claimSigner
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        _claimSigner = claimSigner;
    }

    /**
     * @dev Resolves the inheritance conflict between ERC721URIStorage and ERC721Enumerable
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Sets the base URI for all token metadata
     * @param newBaseURI The new base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Sets the address authorized to sign claim messages
     * @param newSigner The new signer address
     */
    function setClaimSigner(address newSigner) external onlyOwner {
        _claimSigner = newSigner;
        emit ClaimSignerUpdated(newSigner);
    }

    /**
     * @dev Toggles the claiming functionality on/off
     * @param status The new status of claiming
     */
    function setClaimingActive(bool status) external onlyOwner {
        claimingActive = status;
    }

    /**
     * @dev Creates a new edition with a specified size
     * @param editionName The name of the edition
     * @param maxSupply The maximum supply for this edition
     */
    function createEdition(string memory editionName, uint256 maxSupply) external onlyOwner {
        require(_editionSizes[editionName] == 0, "Edition already exists");
        _editionSizes[editionName] = maxSupply;
    }

    /**
     * @dev Returns information about an edition
     * @param editionName The name of the edition
     * @return maxSupply The maximum supply for this edition
     * @return currentSupply The current minted supply for this edition
     */
    function getEditionInfo(string memory editionName) external view returns (uint256 maxSupply, uint256 currentSupply) {
        return (_editionSizes[editionName], _editionMinted[editionName]);
    }

    /**
     * @dev Allows a collector to claim an NFT by providing a signature proving ownership
     * of a physical art piece
     * @param artPieceId The unique identifier of the physical art piece
     * @param editionName The edition name this art piece belongs to
     * @param signature The signature verifying the claim, signed by authorized signer
     * @param metadataURI The URI to the metadata for this specific token
     */
    function claimArtPieceNFT(
        string memory artPieceId,
        string memory editionName,
        bytes memory signature,
        string memory metadataURI
    ) external nonReentrant {
        require(claimingActive, "Claiming is not active");
        require(!_claimedArtPieces[artPieceId], "Art piece already claimed");
        require(_editionSizes[editionName] > 0, "Invalid edition");
        require(_editionMinted[editionName] < _editionSizes[editionName], "Edition sold out");
        
        // Verify the signature
        bytes32 messageHash = keccak256(abi.encodePacked(artPieceId, msg.sender, editionName));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        
        require(signer == _claimSigner, "Invalid signature");
        
        // Mint the NFT
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Update mappings
        _claimedArtPieces[artPieceId] = true;
        _artPieceToTokenId[artPieceId] = tokenId;
        _tokenIdToArtPieceId[tokenId] = artPieceId;
        _editionMinted[editionName]++;
        
        emit ArtPieceClaimed(msg.sender, tokenId, artPieceId);
    }

    /**
     * @dev Mint function for the contract owner to create NFTs directly
     * @param to The address to mint the NFT to
     * @param editionName The edition name this art piece belongs to
     * @param artPieceId The unique identifier for the physical art piece
     * @param metadataURI The URI to the metadata for this specific token
     */
    function mintForArtist(
        address to,
        string memory editionName,
        string memory artPieceId,
        string memory metadataURI
    ) external onlyOwner {
        require(!_claimedArtPieces[artPieceId], "Art piece already claimed");
        require(_editionSizes[editionName] > 0, "Invalid edition");
        require(_editionMinted[editionName] < _editionSizes[editionName], "Edition sold out");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Update mappings
        _claimedArtPieces[artPieceId] = true;
        _artPieceToTokenId[artPieceId] = tokenId;
        _tokenIdToArtPieceId[tokenId] = artPieceId;
        _editionMinted[editionName]++;
        
        emit ArtPieceClaimed(to, tokenId, artPieceId);
    }

    /**
     * @dev Checks if a physical art piece has been claimed
     * @param artPieceId The unique identifier of the physical art piece
     * @return claimed Whether the art piece has been claimed
     */
    function isArtPieceClaimed(string memory artPieceId) external view returns (bool) {
        return _claimedArtPieces[artPieceId];
    }

    /**
     * @dev Gets the token ID associated with a physical art piece
     * @param artPieceId The unique identifier of the physical art piece
     * @return tokenId The token ID or 0 if not claimed
     */
    function getTokenIdForArtPiece(string memory artPieceId) external view returns (uint256) {
        return _artPieceToTokenId[artPieceId];
    }

    /**
     * @dev Gets the physical art piece ID associated with a token
     * @param tokenId The NFT token ID
     * @return artPieceId The physical art piece identifier
     */
    function getArtPieceForToken(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenIdToArtPieceId[tokenId];
    }

    /**
     * @dev Internal function to check if a token exists
     * @param tokenId The token ID to check
     * @return bool Whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Withdraw function for contract owner
     */
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
}