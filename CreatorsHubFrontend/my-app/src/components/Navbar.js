// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import './Navbar.css';

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [networkName, setNetworkName] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.getChainId()
        .then((chainId) => {
          let network;
          switch (chainId) {
            case 1:
              network = 'Mainnet';
              break;
            case 3:
              network = 'Ropsten';
              break;
            case 4:
              network = 'Rinkeby';
              break;
            case 5:
              network = 'Goerli';
              break;
            case 42:
              network = 'Kovan';
              break;
            default:
              network = 'kaia';
          }
          setNetworkName(network);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);

        const balanceWei = await web3.eth.getBalance(connectedAccount);
        setBalance(web3.utils.fromWei(balanceWei, 'ether'));

        const chainId = await web3.eth.getChainId();
        let network;
        switch (chainId) {
          case 1:
            network = 'Mainnet';
            break;
          case 3:
            network = 'Ropsten';
            break;
          case 4:
            network = 'Rinkeby';
            break;
          case 5:
            network = 'Goerli';
            break;
          case 42:
            network = 'Kovan';
            break;
          default:
            network = 'kaia Kairos';
        }
        setNetworkName(network);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("MetaMask is not installed");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">CreatorsHub</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/upload-content">Upload</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>
        <li><Link to="/nfts">NFTs</Link></li>
      </ul>
      <div className="wallet-button-container">
        {account ? (
          <button className="wallet-button">
            {account.slice(0, 6)}...{account.slice(-4)} ({parseFloat(balance).toFixed(4)} KAIA) - {networkName}
          </button>
        ) : (
          <button onClick={connectWallet} className="wallet-button">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
