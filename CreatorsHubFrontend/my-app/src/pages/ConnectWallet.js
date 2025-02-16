// src/pages/ConnectWallet.js

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { motion } from 'framer-motion';
import './ConnectWallet.css'; // Custom styles for this component

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(balanceWei, 'ether'));
      } catch (error) {
        console.error('Connection failed', error);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <div className="connect-wallet-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="connect-wallet-card"
      >
        <h1 className="title">Connect Your Wallet</h1>
        {account ? (
          <div>
            <p className="account-info">Connected: {account}</p>
            <p className="balance-info">Balance: {balance} ETH</p>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="connect-button"
          >
            Connect MetaMask
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectWallet;
