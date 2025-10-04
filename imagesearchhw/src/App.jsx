
import React, { Component } from 'react';
import axios from 'axios';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Loader from './components/Loader';
import Modal from './components/Modal';

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 12;
const PIXABAY_KEY = '52493410-eb762003eccb1a9fab509868c';


export default class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    loading: false,
    error: null,
    showModal: false,
    modalImage: '',
    totalHits: 0,
  };

  componentDidMount() {
    
    const initialQuery = 'new york'; 
    if (initialQuery) {
      this.setState({ query: initialQuery, page: 1 }, this.fetchImages);
    }
  }

  fetchImages = async () => {
    const { query, page, images } = this.state;
    if (!query.trim()) return;

    this.setState({ loading: true, error: null });

    try {
 
      console.log('Pixabay key:', PIXABAY_KEY);
      const response = await axios.get(BASE_URL, {
        params: {
          q: query,
          page,
          key: PIXABAY_KEY,
          image_type: 'photo',
          orientation: 'horizontal',
          per_page: PER_PAGE,
        },
      });

const hits = response.data.hits.map(({ id, webformatURL, largeImageURL, tags }) => ({
  id,
  webformatURL,
  largeImageURL,
  tags,
}));

      this.setState({
        images: page === 1 ? hits : [...images, ...hits],
        totalHits: response.data.totalHits || 0,
        loading: false,
      });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  handleSearchSubmit = (newQuery) => {
    if (!newQuery.trim()) return;
    if (newQuery === this.state.query) return;
    this.setState({ query: newQuery, page: 1, images: [] }, this.fetchImages);
  };

  handleLoadMore = () => {
    this.setState(
      prev => ({ page: prev.page + 1 }),
      this.fetchImages
    );
  };

openModal = (largeImageURL, alt) => {
  this.setState({ showModal: true, modalImage: largeImageURL, modalAlt: alt });
};

closeModal = () => {
  this.setState({ showModal: false, modalImage: '', modalAlt: '' });
};


  render() {
    const { images, loading, error, showModal, modalImage, modalAlt, totalHits } = this.state;
    const showLoadMore = images.length > 0 && images.length < totalHits && !loading;
    return (
      <div>
        {showModal && <Modal src={modalImage} alt={modalAlt} onClose={this.closeModal} />}
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ImageGallery images={images} onImageClick={this.openModal} />
        {loading && <Loader />}
        {showLoadMore && <Button onClick={this.handleLoadMore} />}
        {showModal && <Modal src={modalImage} onClose={this.closeModal} />}
      </div>
    );
  }
}
