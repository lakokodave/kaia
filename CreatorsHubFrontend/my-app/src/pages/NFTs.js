// src/pages/NFTs.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { motion } from 'framer-motion';
import SimpleNFTABI from './SimpleNFT_ABI.json';
import './NFTs.css';
import image4 from './images/image4.jpg';

const NFTs = () => {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert('MetaMask not detected');
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        await fetchNFTs(accounts[0]);
      } else {
        console.error("No accounts available from wallet.");
      }
    } catch (error) {
      console.error('Connection failed', error);
    }
  };

  const fetchNFTs = async (account) => {
    try {
      const nftContractAddress = '0x404ADcEce67ba3380f86f36Dc852C1ec1C2208DC';
      const nftContract = new web3.eth.Contract(SimpleNFTABI, nftContractAddress);
      const balance = await nftContract.methods.balanceOf(account).call();
      const nftData = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.methods.tokenOfOwnerByIndex(account, i).call();
        const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        nftData.push({ tokenId, metadata });
      }
      setNfts(nftData);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      // Optionally check for specific error messages
      if (error.message && error.message.includes("LocalWalletNotAvailableError")) {
        console.error("Local wallet not available. Please ensure your wallet is connected properly.");
      }
    }
  };

  const buyNFT = async (nft) => {
    if (web3 && account) {
      try {
        const recipientAddress = '0xRecipientAddress'; // Replace with actual recipient address
        const priceInEther = '0.1'; // Example price

        await web3.eth.sendTransaction({
          from: account,
          to: recipientAddress,
          value: web3.utils.toWei(priceInEther, 'ether'),
        });

        alert(`Successfully purchased ${nft.metadata.name}`);
      } catch (error) {
        console.error('Transaction failed', error);
      }
    } else {
      alert('Please connect your wallet first.');
    }
  };

  // Sample NFT data as fallback for display in grid (if you wish to show 12 NFT cards)
  const sampleNFTData = [
    { id: 1, name: 'NFT 1', image: 'path_to_image1.jpg', description: 'Description for NFT 1' },
    { id: 2, name: 'NFT 2', image: 'path_to_image2.jpg', description: 'Description for NFT 2' },
    { id: 3, name: 'NFT 3', image: 'path_to_image3.jpg', description: 'Description for NFT 3' },
    { id: 4, name: 'NFT 4', image: {image4}, description: 'Description for NFT 4' },
    { id: 5, name: 'NFT 5', image: 'path_to_image5.jpg', description: 'Description for NFT 5' },
    { id: 6, name: 'NFT 6', image: 'path_to_image6.jpg', description: 'Description for NFT 6' },
    { id: 7, name: 'NFT 7', image: 'path_to_image7.jpg', description: 'Description for NFT 7' },
    { id: 8, name: 'NFT 8', image: 'path_to_image8.jpg', description: 'Description for NFT 8' },
    { id: 9, name: 'NFT 9', image: 'path_to_image9.jpg', description: 'Description for NFT 9' },
    { id: 10, name: 'NFT 10', image: 'path_to_image10.jpg', description: 'Description for NFT 10' },
    { id: 11, name: 'NFT 11', image: 'path_to_image11.jpg', description: 'Description for NFT 11' },
    { id: 12, name: 'NFT 12', image: 'path_to_image12.jpg', description: 'Description for NFT 12' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Section for NFTs fetched from contract */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 text-center w-96 shadow-lg rounded-2xl bg-gray-800"
      >
        <h1 className="text-2xl font-bold mb-4">Your NFTs And NFTs To Buy</h1>
        {account ? (
          <div>
            {nfts.length > 0 ? (
              nfts.map((nft) => (
                <div key={nft.tokenId} className="mb-4 bg-gray-700 rounded-2xl overflow-hidden">
                  <img src={nft.metadata.image} alt={nft.metadata.name} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{nft.metadata.name}</h2>
                    <p className="mt-2 text-gray-400">{nft.metadata.description}</p>
                    <button onClick={() => buyNFT(nft)} className="nft-buy-button">
                      Buy NFT
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-2 text-blue-400">No NFTs found in your wallet.</p>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Connect MetaMask
          </button>
        )}
      </motion.div>

      {/* Section for sample NFT grid */}
      <div className="nft-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="nft-grid flex flex-wrap justify-center gap-4"
          style={{ height: 'min(calc(100vh - 200px), 500px)' }}
        >
          {sampleNFTData.map((nft) => (
            <div key={nft.id} className="nft-card w-24 h-24 cursor-pointer">
              <img
                src={nft.image}
                alt={nft.name}
                className="object-cover w-full h-full rounded-lg"
                onClick={() => buyNFT(nft)}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NFTs;
