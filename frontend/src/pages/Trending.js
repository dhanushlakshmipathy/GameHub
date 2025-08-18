import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { getTrendingByAvgRating, getTrendingByReviewCount } from "../services/api";

export default function Trending() {
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await getTrending();
        setTrendingGames(res.data);
      } catch (err) {
        console.error("Error fetching trending games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <p>Loading trending games...</p>;
  if (trendingGames.length === 0) return <p>No trending games available.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trending Games</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {trendingGames.map((game) => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  );
}
