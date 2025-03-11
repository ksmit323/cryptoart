// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/// @title Cryptoart NFT Contract
/// @notice This contract allows users to claim NFTs for physical art pieces and the owner to mint NFTs directly, organized into editions with limited supply.
contract CryptoartNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    /* 
    !!!
        Below is official Solidity NatSpec of state variables and functions. In production, however, 
        I HIGHLY disagree with this amount of doc strings. It clutters code and makes it more 
        difficult to maintain. I do it here just as a proper example of using natspec, but again, 
        I would not do this in production.
    !!!
    */

    /// @dev Mapping from art piece ID to token ID to track claims.
    mapping(string => uint256) private artPieceToTokenId;

    /// @dev Mapping from edition name to its maximum supply.
    mapping(string => uint256) private editionSizes;

    /// @dev Mapping from edition name to the number of NFTs minted in that edition.
    mapping(string => uint256) private editionMinted;

    /// @dev Counter for generating unique token IDs.
    uint256 private tokenIdCounter;

    /// @notice Emitted when an art piece is claimed or minted.
    /// @param collector The address that received the NFT.
    /// @param tokenId The ID of the minted NFT.
    /// @param artPieceId The unique identifier of the physical art piece.
    event ArtPieceClaimed(address indexed collector, uint256 indexed tokenId, string artPieceId);

    /// @notice Initializes the contract with a name and symbol for the NFT collection.
    /// @param name The name of the NFT collection.
    /// @param symbol The symbol of the NFT collection.
    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {}

    /// @notice Allows a user to claim an NFT for a physical art piece.
    /// @param artPieceId The unique identifier of the physical art piece.
    /// @param editionName The name of the edition this art piece belongs to.
    /// @param metadataURI The URI pointing to the metadata of the NFT.
    function claimArtPiece(string memory artPieceId, string memory editionName, string memory metadataURI)
        external
        nonReentrant
    {
        require(artPieceToTokenId[artPieceId] == 0, "Already claimed");
        require(editionSizes[editionName] > 0, "Invalid edition");
        require(editionMinted[editionName] < editionSizes[editionName], "Edition full");
        _mintNFT(msg.sender, artPieceId, editionName, metadataURI);
    }

    /// @notice Allows the contract owner to mint an NFT directly to an address.
    /// @param to The address to mint the NFT to.
    /// @param editionName The name of the edition this art piece belongs to.
    /// @param artPieceId The unique identifier of the physical art piece.
    /// @param metadataURI The URI pointing to the metadata of the NFT.
    function mintForArtist(address to, string memory editionName, string memory artPieceId, string memory metadataURI)
        external
        onlyOwner
        nonReentrant
    {
        /* Commenting out require statements to just make minting easier for now */

        // require(artPieceToTokenId[artPieceId] == 0, "Already claimed");
        // require(editionSizes[editionName] > 0, "Invalid edition");
        // require(editionMinted[editionName] < editionSizes[editionName], "Edition full");
        _mintNFT(to, artPieceId, editionName, metadataURI);
    }

    /// @notice Creates a new edition with a specified maximum supply.
    /// @param editionName The name of the edition.
    /// @param maxSupply The maximum number of NFTs that can be minted in this edition.
    function createEdition(string memory editionName, uint256 maxSupply) external onlyOwner {
        require(editionSizes[editionName] == 0, "Edition exists");
        editionSizes[editionName] = maxSupply;
    }

    /// @notice Checks if an art piece has already been claimed.
    /// @param artPieceId The unique identifier of the physical art piece.
    /// @return True if the art piece has been claimed, false otherwise.
    function isClaimed(string memory artPieceId) external view returns (bool) {
        return artPieceToTokenId[artPieceId] != 0;
    }

    /// @notice Retrieves the token ID associated with an art piece.
    /// @param artPieceId The unique identifier of the physical art piece.
    /// @return The token ID of the claimed NFT, or 0 if not claimed.
    function getTokenId(string memory artPieceId) external view returns (uint256) {
        return artPieceToTokenId[artPieceId];
    }

    /// @dev Mints an NFT to the specified address and updates tracking mappings.
    /// @param to The address to mint the NFT to.
    /// @param artPieceId The unique identifier of the physical art piece.
    /// @param editionName The name of the edition this art piece belongs to.
    /// @param metadataURI The URI pointing to the metadata of the NFT.
    function _mintNFT(address to, string memory artPieceId, string memory editionName, string memory metadataURI)
        internal
    {
        uint256 tokenId = tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        artPieceToTokenId[artPieceId] = tokenId;
        editionMinted[editionName]++;
        emit ArtPieceClaimed(to, tokenId, artPieceId);
    }
}
