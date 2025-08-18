import { useEffect, useState } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";

export default function GamesPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await getAllGames();
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };
    fetchGames();
  }, []);

  return (
    <div>
      <h1>All Games</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
