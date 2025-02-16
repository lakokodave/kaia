// src/pages/Subscriptions.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { motion } from 'framer-motion';
import './Subscriptions.css';
import commitment_asset from './images/commitment_asset.png';

const Subscriptions = () => {
  const [account, setAccount] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [web3, setWeb3] = useState(null);

  // Initialize Web3 on component mount
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      alert('MetaMask not detected');
    }
  }, []);

  // Connect to MetaMask wallet and fetch subscriptions
  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        fetchSubscriptions(accounts[0]);
      } catch (error) {
        console.error('Connection failed', error);
      }
    }
  };

  // Dummy function to simulate fetching subscriptions
  const fetchSubscriptions = async (account) => {
    // Replace this with real subscription fetching logic (e.g., from a smart contract)
    const dummySubscriptions = [
      { id: 1, creator: 'Creator One', expiry: '2024-12-31' },
      { id: 2, creator: 'Creator Two', expiry: '2025-01-15' },
    ];
    setSubscriptions(dummySubscriptions);
  };

  // Handle subscription form submission
  const handleSubscriptionSubmit = (e) => {
    e.preventDefault();
    // Add subscription logic here (e.g., send transaction to smart contract)
  };

  return (
    <div className="subscriptions-wrapper">
      {/* Our Commitment Section */}
      <section className="mission-section">
        <div className="subscription-container">
          {/* Left Textual Section */}
          <div className="subscription-text">
            <h1 className="subscription-heading">Our Commitment</h1>
            <p className="subscription-support">
              We are dedicated to empowering creators with state-of-the-art tools and support to bring their vision to life. Experience innovation, collaboration, and excellence at every step.
            </p>
            {!account && (
              <button className="connect-wallet-button" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
          {/* Right Illustrated Section */}
          <div className="subscription-illustration">
            <img
              src={commitment_asset}
              alt="Female creator working on a computer with creative tools"
            />
          </div>
        </div>
      </section>

      {/* Subscription List Section (visible only if wallet is connected) */}
      {account && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="subscriptions-container bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4">My Subscriptions</h1>
          {subscriptions.length > 0 ? (
            <ul>
              {subscriptions.map((sub) => (
                <li key={sub.id} className="subscription-item mb-2 p-2 bg-gray-700 rounded">
                  <p><strong>Creator:</strong> {sub.creator}</p>
                  <p><strong>Expires:</strong> {sub.expiry}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-400">No subscriptions found.</p>
          )}
        </motion.div>
      )}

      {/* Subscription Form Section (visible only if wallet is connected) */}
      {account && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="subscription-form-container bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md"
          style={{ marginBottom: '2rem' }}
        >
          <form onSubmit={handleSubscriptionSubmit}>
            {/* Add form fields here */}
            <button type="submit" className="submit-button">
              Subscribe
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Subscriptions;
