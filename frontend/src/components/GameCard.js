import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function GameCard({ game }) {
  return (
    <div style={{
      border: "1px solid gray",
      margin: "10px",
      padding: "10px",
      borderRadius: "5px",
      width: "250px"
    }}>
      <h3>{game.title}</h3>
      <p>{game.genre} | {game.platform}</p>
      <StarRating rating={game.averageRating || 0} />
      <p>{game.reviewCount || 0} reviews</p>
      <Link to={`/game/${game._id}`}>View Details</Link>
    </div>
  );
}
