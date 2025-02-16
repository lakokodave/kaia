// src/components/UploadContent.js
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './UploadContent.css';
import imagess from './image/profile_2.jpeg';

const UploadContent = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [successfullyUploaded, setSuccessfullyUploaded] = useState(false);

  const onFilesAdded = (files) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const uploadFiles = async () => {
    setUploading(true);
    const promises = selectedFiles.map((file) => sendRequest(file));
    try {
      await Promise.all(promises);
      setSuccessfullyUploaded(true);
    } catch (e) {
      setSuccessfullyUploaded(false);
    } finally {
      setUploading(false);
    }
  };

  const sendRequest = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('/your-upload-endpoint', formData, {
        onUploadProgress: (event) => {
          const copy = { ...uploadProgress };
          copy[file.name] = {
            state: 'pending',
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          setUploadProgress(copy);
        },
      })
        .then((response) => {
          const copy = { ...uploadProgress };
          copy[file.name] = { state: 'done', percentage: 100 };
          setUploadProgress(copy);
          resolve(response);
        })
        .catch((error) => {
          const copy = { ...uploadProgress };
          copy[file.name] = { state: 'error', percentage: 0 };
          setUploadProgress(copy);
          reject(error);
        });
    });
  };

  const renderProgress = (file) => {
    const progress = uploadProgress[file.name];
    if (uploading || successfullyUploaded) {
      return (
        <div className="progress-wrapper">
          <progress value={progress ? progress.percentage : 0} max="100" />
          <span className="progress-label">
            {progress ? `${progress.percentage}%` : '0%'}
          </span>
        </div>
      );
    }
  };

  // Determine an icon based on file type
  const getFileIcon = (file) => {
    if (file.type.startsWith('image')) return '🖼️';
    if (file.type.startsWith('audio')) return '🎵';
    if (file.type.startsWith('video')) return '🎬';
    return '📁';
  };

  return (
    <div className="upload-content-wrapper">
      {/* Illustration Section */}
      <section className="illustration-section">
        <div className="illustration-container">
          <img
            src={imagess}
            alt="Person using a laptop with various icons and graphics"
            className="illustration-image"
          />
        </div>
      </section>

      {/* Upload Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="upload-form-container"
      >
        <h1 className="upload-heading">Share Your Creation</h1>
        <p className="upload-instructions">
          You can upload images, audio, or videos to showcase your creative work.
        </p>
        <div
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFilesAdded(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            accept="image/*,audio/*,video/*"
            multiple
            onChange={(e) => onFilesAdded(e.target.files)}
          />
          <span>Drag & Drop files here or click to select files</span>
        </div>
        <div className="files">
          {selectedFiles.map((file) => (
            <div key={file.name} className="file">
              <span className="file-icon">{getFileIcon(file)}</span>
              <span className="file-name">{file.name}</span>
              {renderProgress(file)}
            </div>
          ))}
        </div>
        <button
          className="upload-button"
          disabled={selectedFiles.length === 0 || uploading}
          onClick={uploadFiles}
        >
          Upload
        </button>
      </motion.div>
    </div>
  );
};

export default UploadContent;
