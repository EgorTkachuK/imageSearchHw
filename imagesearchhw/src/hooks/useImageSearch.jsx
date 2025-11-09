import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 12;
const PIXABAY_KEY = '52493410-eb762003eccb1a9fab509868c';

export const useImageSearch = (initialQuery = 'new york') => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalHits, setTotalHits] = useState(0);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [query, page]
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setPage(1);
      setImages([]);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!query) return;
    fetchImages(query, page);
  }, [query, page, fetchImages]);

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

  const showLoadMore = useMemo(
    () => images.length > 0 && images.length < totalHits && !loading,
    [images.length, totalHits, loading]
  );

  return {
    images,
    loading,
    error,
    showLoadMore,
    handleSearchSubmit,
    handleLoadMore,
  };
};