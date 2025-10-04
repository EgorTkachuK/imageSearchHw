export default function ImageGalleryItem({ img, onClick }) {
  return (
    <li className="gallery-item" onClick={() => onClick(img.largeImageURL, img.tags)}>
      <img src={img.webformatURL} alt={img.tags} />
    </li>
  );
}