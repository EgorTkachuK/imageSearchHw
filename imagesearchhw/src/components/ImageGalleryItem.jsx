
import React , {memo} from 'react';

 const ImageGalleryItem = memo( function ImageGalleryItem({ img, onClick }) {
  return (
    <li className="gallery-item" onClick={() => onClick(img.largeImageURL, img.tags)}>
      <img src={img.webformatURL} alt={img.tags} />
    </li>
  );
})

export default ImageGalleryItem