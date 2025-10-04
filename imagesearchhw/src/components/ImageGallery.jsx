

import ImageGalleryItem from './ImageGalleryItem';

export default function ImageGallery({ images, onImageClick }) {
  return (
    <ul className="gallery">
      {images.map(img => (
        <ImageGalleryItem key={img.id} img={img} onClick={onImageClick} />
      ))}
    </ul>
  );
}
