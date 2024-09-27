const express = require("express");
const { getNFTMetadata, getBalance } = require("../controllers/ethereumController.js");

const router = express.Router();

// Gets the metadata of an NFT
// Parameters: tokenContractAddress, tokenId
// Returns: NFT metadata (name, description, image, url)
router.get("/nft", getNFTMetadata);

// Gets the balance of a token in the user's wallet
// Parameters: tokenContractAddress, walletAddress
// Returns: balance of the token in the user's wallet in ether
router.get("/balance", getBalance);

module.exports = router;
