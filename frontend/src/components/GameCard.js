import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function GameCard({ game }){
  const avg = parseFloat(game.averageRating ?? 0);
  return (
    <div className="card">
      <div className="card-body">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
          <h3 className="m-0" style={{fontSize:"1.05rem"}}>
            <Link to={`/game/${game._id}`} style={{color:"#fff"}}>{game.title}</Link>
          </h3>
          <span className="badge">{game.genre || "Game"}</span>
        </div>
        {game.platform && <div className="subtitle mt-1">{game.platform}</div>}
        <div className="mt-2" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <StarRating value={avg} />
          <div className="subtitle">{isNaN(avg) ? "—" : `${avg}/5`}</div>
        </div>
      </div>
    </div>
  );
}
