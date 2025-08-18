import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameById, getReviewsByGame, createReview } from "../services/api";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameRes = await getGameById(id);
        const reviewRes = await getReviewsByGame(id);
        setGame(gameRes.data);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error("Error fetching game details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login to submit a review");

    try {
      const res = await createReview(token, { gameId: id, rating, comment });
      setReviews([res.data, ...reviews]);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  if (loading) return <p>Loading game details...</p>;
  if (!game) return <p>Game not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{game.title}</h2>
      <p>{game.genre} | {game.platform}</p>
      <StarRating rating={game.averageRating || 0} />
      <p>{reviews.length} reviews</p>
      <p>{game.description}</p>

      <hr />

      <h3>Reviews</h3>
      {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}

      {token && (
        <form onSubmit={handleReviewSubmit} style={{ marginTop: "20px" }}>
          <h4>Submit your review:</h4>
          <label>Rating: </label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
          <br />
          <label>Comment: </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <br />
          <button type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
}
