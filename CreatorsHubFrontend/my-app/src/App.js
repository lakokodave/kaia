// src/App.js

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UploadContent from './components/UploadContent';
import Subscriptions from './pages/Subscriptions';
import NFTs from './pages/NFTs';
import ConnectWallet from './pages/ConnectWallet';
import './App.css';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload-content" element={<UploadContent />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
// rw3327016@gmail.com
