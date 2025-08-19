import StarRating from "./StarRating";

export default function ReviewCard({ review }){
  return (
    <div className="card" style={{padding:"10px 12px"}}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div className="badge">{review.user?.username || "Anon"}</div>
          <StarRating value={review.rating} />
        </div>
        <div className="subtitle">{new Date(review.createdAt).toLocaleDateString()}</div>
      </div>
      {review.comment && <p className="mt-2" style={{whiteSpace:"pre-wrap"}}>{review.comment}</p>}
    </div>
  );
}
