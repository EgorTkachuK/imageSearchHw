// Hook 
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Button from './components/Button';
import Loader from './components/Loader';
import Modal from './components/Modal';

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 12;
const PIXABAY_KEY = '52493410-eb762003eccb1a9fab509868c';

export default function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalAlt, setModalAlt] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    const initialQuery = 'new york';
    if (initialQuery) {
      setQuery(initialQuery);
      setPage(1);
      setImages([]);
    }
  }, []);

  const fetchImages = useCallback(
    async (currentQuery = query, currentPage = page) => {
      if (!currentQuery.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(BASE_URL, {
          params: {
            q: currentQuery,
            page: currentPage,
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

        setImages(prev => (currentPage === 1 ? hits : [...prev, ...hits]));
        setTotalHits(response.data.totalHits || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    },
    [query, page]
  );

  useEffect(() => {
    if (!query) return;
    fetchImages(query, page);
  }, [query, page]);

  const handleSearchSubmit = useCallback(
    newQuery => {
      if (!newQuery.trim()) return;
      if (newQuery === query) return;
      setQuery(newQuery);
      setPage(1);
      setImages([]);
    },
    [query]
  );

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

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

 
  const showLoadMore = useMemo(
    () => images.length > 0 && images.length < totalHits && !loading,
    [images.length, totalHits, loading]
  );

  const galleryProps = useMemo(
    () => ({
      images,
      onImageClick: openModal,
    }),
    [images, openModal]
  );

  return (
    <div>
      {showModal && <Modal src={modalImage} alt={modalAlt} onClose={closeModal} />}
      <Searchbar onSubmit={handleSearchSubmit} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ImageGallery {...galleryProps} />
      {loading && <Loader />}
      {showLoadMore && <Button onClick={handleLoadMore} />}
    </div>
  );
}



// CLASS
// import React, { Component } from 'react';
// import axios from 'axios';
// import Searchbar from './components/Searchbar';
// import ImageGallery from './components/ImageGallery';
// import Button from './components/Button';
// import Loader from './components/Loader';
// import Modal from './components/Modal';

// const BASE_URL = 'https://pixabay.com/api/';
// const PER_PAGE = 12;
// const PIXABAY_KEY = '52493410-eb762003eccb1a9fab509868c';


// export default class App extends Component {
//   state = {
//     query: '',
//     images: [],
//     page: 1,
//     loading: false,
//     error: null,
//     showModal: false,
//     modalImage: '',
//     totalHits: 0,
//   };

//   componentDidMount() {
    
//     const initialQuery = 'new york'; 
//     if (initialQuery) {
//       this.setState({ query: initialQuery, page: 1 }, this.fetchImages);
//     }
//   }

//   fetchImages = async () => {
//     const { query, page, images } = this.state;
//     if (!query.trim()) return;

//     this.setState({ loading: true, error: null });

//     try {
 
//       console.log('Pixabay key:', PIXABAY_KEY);
//       const response = await axios.get(BASE_URL, {
//         params: {
//           q: query,
//           page,
//           key: PIXABAY_KEY,
//           image_type: 'photo',
//           orientation: 'horizontal',
//           per_page: PER_PAGE,
//         },
//       });

// const hits = response.data.hits.map(({ id, webformatURL, largeImageURL, tags }) => ({
//   id,
//   webformatURL,
//   largeImageURL,
//   tags,
// }));

//       this.setState({
//         images: page === 1 ? hits : [...images, ...hits],
//         totalHits: response.data.totalHits || 0,
//         loading: false,
//       });
//     } catch (err) {
//       this.setState({ error: err.message, loading: false });
//     }
//   };

//   handleSearchSubmit = (newQuery) => {
//     if (!newQuery.trim()) return;
//     if (newQuery === this.state.query) return;
//     this.setState({ query: newQuery, page: 1, images: [] }, this.fetchImages);
//   };

//   handleLoadMore = () => {
//     this.setState(
//       prev => ({ page: prev.page + 1 }),
//       this.fetchImages
//     );
//   };

// openModal = (largeImageURL, alt) => {
//   this.setState({ showModal: true, modalImage: largeImageURL, modalAlt: alt });
// };

// closeModal = () => {
//   this.setState({ showModal: false, modalImage: '', modalAlt: '' });
// };


//   render() {
//     const { images, loading, error, showModal, modalImage, modalAlt, totalHits } = this.state;
//     const showLoadMore = images.length > 0 && images.length < totalHits && !loading;
//     return (
//       <div>
//         {showModal && <Modal src={modalImage} alt={modalAlt} onClose={this.closeModal} />}
//         <Searchbar onSubmit={this.handleSearchSubmit} />
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <ImageGallery images={images} onImageClick={this.openModal} />
//         {loading && <Loader />}
//         {showLoadMore && <Button onClick={this.handleLoadMore} />}
//       
//       </div>
//     );
//   }
// }
