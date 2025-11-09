import React, { useState, useCallback } from 'react';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Loader from './components/Loader';
import Modal from './components/Modal';
import { useImageSearch } from './hooks/useImageSearch';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  const {
    images,
    loading,
    error,
    showLoadMore,
    handleSearchSubmit,
    handleLoadMore,
  } = useImageSearch();

  const openModal = useCallback((largeImageURL, alt) => {
    setModalImage(largeImageURL);
    setModalAlt(alt || '');
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalImage('');
    setModalAlt('');
  }, []);

  return (
    <div>
      {showModal && <Modal src={modalImage} alt={modalAlt} onClose={closeModal} />}
      <Searchbar onSubmit={handleSearchSubmit} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ImageGallery images={images} onImageClick={openModal} />
      {loading && <Loader />}
      {showLoadMore && <Button onClick={handleLoadMore} />}
    </div>
  );
}