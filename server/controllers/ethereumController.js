const NFTsSchema = require("../models/NFTsModel.js");
const { tokenURIABI, balanceOfABI } = require("../utils/web3ABIs.js");

const getNFTMetadata = async (req, res) => {
  const { tokenId, contractAddress } = req.body;
  const web3 = req.app.locals.web3;

  // Body params validation
  if (!tokenId) {
    return res.status(400).json({ error: "Please provide a tokenId" });
  }

  if (!contractAddress) {
    return res.status(400).json({ error: "Please provide a contractAddress" });
  } 

  if (!web3.utils.isAddress(contractAddress)) {
    return res.status(400).json({ error: "Please provide a valid contractAddress" });
  }

  const INFURA_IPFS_SUBDOMAIN = req.app.locals.INFURA_IPFS_SUBDOMAIN;


  const contract = new web3.eth.Contract(tokenURIABI, contractAddress);

  try {
    const result = await contract.methods.tokenURI(tokenId).call();
    const ipfsURL = addIPFSProxy(result, INFURA_IPFS_SUBDOMAIN);

    // Get the metadata from IPFS
    const response = await fetch(ipfsURL);
    const metadata = await response.json();

    // Create the NFT in the database
    const nft = await NFTsSchema.create({
      id: tokenId,
      address: contractAddress,
      url: ipfsURL,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
    });

    res.status(200).json(nft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBalance = async (req, res) => {
  const { tokenContractAddress, walletAddress } = req.body;
  const web3 = req.app.locals.web3;

  // Body params validation
  if (!web3.utils.isAddress(tokenContractAddress)) {
    return res.status(400).json({ error: "Please provide a valid contractAddress" });
  }

  if (!web3.utils.isAddress(walletAddress)) {
    return res.status(400).json({ error: "Please provide a valid walletAddress" });
  }

  const contract = new web3.eth.Contract(balanceOfABI, tokenContractAddress);

  try {
    // Get the balance of the wallet
    const balance = await contract.methods.balanceOf(walletAddress).call();

    // Convert the balance from wei to ether
    const formattedBalance = web3.utils.fromWei(balance, "ether");

    res.status(200).json({ balance: formattedBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add the IPFS proxy to the IPFS URL
function addIPFSProxy(ipfsHash, subdomain) {
  const URL = `https://${subdomain}.infura-ipfs.io/ipfs/`;
  const hash = ipfsHash.replace(/^ipfs?:\/\//, "");
  const ipfsURL = URL + hash;

  return ipfsURL;
}

module.exports = { getNFTMetadata, getBalance };
