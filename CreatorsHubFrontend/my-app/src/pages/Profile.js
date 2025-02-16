import React, { useState, useEffect } from 'react';
import './Profile.css';
import profileAvif from './images/profile_3.avif';
import profileJpeg from './images/profile_4.jpeg';
import Web3 from 'web3';
import { motion } from 'framer-motion';

const Profile = () => {
  // State for user data
  const [user, setUser] = useState({
    name: 'John Doe',
    bio: 'Content creator and blockchain enthusiast.',
    avatar: profileAvif,
    coverPhoto: profileJpeg,
    followers: 1200,
    following: 150,
    posts: 35,
    creations: [
      { id: 1, title: 'My First Music Track', type: 'music', thumbnail: 'path_to_music_thumbnail' },
      { id: 2, title: 'Sunset Photography', type: 'photo', thumbnail: 'path_to_photo_thumbnail' },
      { id: 3, title: 'Travel Vlog', type: 'video', thumbnail: 'path_to_video_thumbnail' },
    ],
    socialLinks: {
      twitter: 'https://twitter.com/username',
      instagram: 'https://instagram.com/username',
      linkedin: 'https://linkedin.com/in/username',
    },
    contact: {
      email: 'johndoe@example.com',
      phone: '+1234567890',
    },
  });

  // State for wallet connection
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

  // Handlers for file input changes
  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prevUser) => ({ ...prevUser, coverPhoto: imageUrl }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prevUser) => ({ ...prevUser, avatar: imageUrl }));
    }
  };

  return (
    <div className="profile-container">
      <div className="cover-photo" style={{ backgroundImage: `url(${user.coverPhoto})` }}>
        <input type="file" accept="image/*" onChange={handleCoverPhotoChange} className="upload-input" />
      </div>
      <div className="profile-info">
        <div className="avatar-wrapper">
          <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="upload-input" />
        </div>
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
        <button className="edit-profile-button">Edit Profile</button>
      </div>
      <div className="user-stats">
        <div>
          <strong>{user.followers}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{user.following}</strong>
          <span>Following</span>
        </div>
        <div>
          <strong>{user.posts}</strong>
          <span>Posts</span>
        </div>
      </div>
      <div className="my-creations">
        <h3>My Creations</h3>
        <div className="creations-gallery">
          {user.creations.map((creation) => (
            <div key={creation.id} className="creation-item">
              <img src={creation.thumbnail} alt={creation.title} />
              <p>{creation.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="social-links">
        <h3>Connect with me</h3>
        <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
      <div className="contact-info">
        <h3>Contact Information</h3>
        <p>Email: {user.contact.email}</p>
        <p>Phone: {user.contact.phone}</p>
      </div>
      <div className="wallet-connection">
        {account ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="mt-2 text-green-400">Connected: {account}</p>
            <p className="mt-2 text-blue-400">Balance: {balance} ETH</p>
          </motion.div>
        ) : (
          <button onClick={connectWallet} className="connect-wallet-button">
            Connect MetaMask
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
