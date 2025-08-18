import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { getAllGames } from "../services/api";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await getGames();
        setGames(res.data);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <p>Loading games...</p>;
  if (games.length === 0) return <p>No games found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Games</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {games.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
