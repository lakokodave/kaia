import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { motion } from 'framer-motion';
import SimpleNFTABI from './SimpleNFT_ABI.json';
import './NFTs.css';
import image4 from './images/image4.jpg';

const nftContractAddress = '0x4785DC840cA06B9D24E609C5555404ec82FD8Cc4';

const NFTs = () => {
  const [account, setAccount] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(SimpleNFTABI, nftContractAddress);
      setContract(contractInstance);
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
      } else {
        console.error("No accounts available from wallet.");
      }
    } catch (error) {
      console.error('Connection failed', error);
    }
  };

  const buyNFT = async (nft) => {
    if (web3 && account && contract) {
      try {
        await contract.methods.mint(account).send({ from: account });
        alert(`Successfully purchased ${nft.name}`);
      } catch (error) {
        console.error('Transaction failed', error);
      }
    } else {
      alert('Please connect your wallet first.');
    }
  };

  const sendNFT = async (nft) => {
    if (web3 && account && recipient && contract) {
      try {
        await contract.methods.safeTransferFrom(account, recipient, nft.id).send({ from: account });
        alert(`NFT ${nft.name} sent to ${recipient}`);
      } catch (error) {
        console.error('Transaction failed', error);
      }
    } else {
      alert('Please connect your wallet and enter a valid recipient address.');
    }
  };

  const sampleNFTData = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: `NFT ${index + 1}`,
    image: image4,
    description: `Description for NFT ${index + 1}`,
    price: '0.1 ETH',
    date: `2024-02-${index + 1}`
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 text-center w-96 shadow-lg rounded-2xl bg-gray-800"
      >
        <h1 className="text-2xl font-bold mb-4">Your NFTs And NFTs To Buy</h1>
        {account ? (
          <div>
            <input 
              type="text" 
              placeholder="Enter recipient address" 
              value={recipient} 
              onChange={(e) => setRecipient(e.target.value)}
              className="mb-4 p-2 rounded text-black"
            />
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

      <div className="nft-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="nft-grid flex flex-wrap justify-center gap-4"
          style={{ height: 'min(calc(100vh - 200px), 500px)' }}
        >
          {sampleNFTData.map((nft) => (
            <div key={nft.id} className="nft-card w-24 h-24 cursor-pointer bg-gray-800 p-4 rounded-lg text-center">
              <img src={nft.image} alt={nft.name} className="object-cover w-full h-24 rounded-lg mb-2" />
              <h2 className="text-lg font-semibold">{nft.name}</h2>
              <p className="text-sm text-gray-400">{nft.description}</p>
              <p className="text-sm text-yellow-400">Price: {nft.price}</p>
              <p className="text-sm text-gray-500">Date: {nft.date}</p>
              <button 
                onClick={() => buyNFT(nft)} 
                className="mt-2 bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded"
              >
                Buy {nft.name}
              </button>
              <button 
                onClick={() => sendNFT(nft)} 
                className="mt-2 bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded"
              >
                Send {nft.name}
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default NFTs;
