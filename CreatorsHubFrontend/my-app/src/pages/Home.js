// src/pages/Home.js
import React, { useState, useEffect } from "react";
import "./Home.css";
import about_us_hero from './images/about_us_hero.png';
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image3.jpg';
import image4 from './images/image4.jpg';



const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [mediaFiles, setMediaFiles] = useState([]);

  // Load saved posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title.trim() === "" || newPost.content.trim() === "") return;

    // Convert each file to a temporary URL and store its type
    const mediaData = mediaFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    const post = {
      id: Date.now(),
      ...newPost,
      media: mediaData,
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setNewPost({ title: "", content: "", author: "" });
    setMediaFiles([]); // Clear media input after submission
  };

  return (
    <div className="home-wrapper">
      {/* Navigation Menu (if needed, uncomment or add here) */}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">Welcome to CreatorsHub</h1>
          <p className="hero-tagline">
            Discover and share creative content with the world.
          </p>
        </div>
        <div className="hero-illustration">
          <img
            src={about_us_hero}
            alt="Female creator working on a computer"
          />
        </div>
      </section>

      {/* Content Feed */}
      <section className="content-feed">
        <div className="post-form-container">
          <h2 className="form-title">Share Your Creation</h2>
          <form onSubmit={handleSubmit} className="post-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newPost.title}
              onChange={handleChange}
              className="post-input"
            />
            <textarea
              name="content"
              placeholder="Share your creation..."
              value={newPost.content}
              onChange={handleChange}
              className="post-textarea"
            />
            <input
              type="text"
              name="author"
              placeholder="Your Name (optional)"
              value={newPost.author}
              onChange={handleChange}
              className="post-input"
            />
            <input
              type="file"
              accept="image/*,audio/*,video/*"
              multiple
              onChange={handleFileChange}
              className="post-file-input"
            />
            <button type="submit" className="post-submit-button">
              Post
            </button>
          </form>
        </div>
        <div className="posts-feed">
          {posts.length === 0 ? (
            <p className="no-posts">
              No posts yet. Be the first to share your creation!
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <p className="post-author">By: {post.author || "Anonymous"}</p>
                {post.media &&
                  post.media.map((media, idx) => (
                    <div key={idx} className="media-preview">
                      {media.type.startsWith("image") && (
                        <img src={media.url} alt="uploaded content" />
                      )}
                      {media.type.startsWith("audio") && (
                        <audio controls src={media.url} />
                      )}
                      {media.type.startsWith("video") && (
                        <video controls width="250" src={media.url} />
                      )}
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Most Viewed Content Section */}
      <section className="most-viewed-section">
        <h2 className="section-title">Most Viewed Content</h2>
        <div className="most-viewed-grid">
          <div className="grid-item">
            <img src={image3} alt="Content 3" />
          </div>
          <div className="grid-item">
            <img src={image2} alt="Content 2" />
          </div>
          <div className="grid-item">
            <img src={image1} alt="Content 1" />
          </div>
          <div className="grid-item">
            <img src={image4} alt="Content 4" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
