


export default function Button({ onClick }) {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <button onClick={onClick} className="load-more">Load more</button>
    </div>
  );
}
