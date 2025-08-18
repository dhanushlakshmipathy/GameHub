import { useEffect, useState } from "react";
import API from "../api";
import GameCard from "../components/GameCard";

export default function Home() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    API.get("/games")
      .then((res) => setGames(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Games</h1>
      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
