import StarRating from "./StarRating";

export default function ReviewCard({ review }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      margin: "10px 0",
      borderRadius: "5px"
    }}>
      <strong>{review.user.username}</strong> 
      <StarRating rating={review.rating} />
      <p>{review.comment}</p>
      <small>{new Date(review.createdAt).toLocaleString()}</small>
    </div>
  );
}
