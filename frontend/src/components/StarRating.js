export default function StarRating({ value = 0, max = 5, size = 18 }){
  const stars = [];
  const rounded = Math.round(value);
  for(let i=1;i<=max;i++){
    const filled = i <= rounded;
    stars.push(<span key={i} className={filled ? "star" : "star dim"} style={{ width:size, height:size }} />);
  }
  return <div className="stars">{stars}</div>;
}
