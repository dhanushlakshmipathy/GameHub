import { useState } from "react";
import { searchGames } from "../services/api";
import GameCard from "../components/GameCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await searchGames(query);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Search Games</h2>
      <input
        type="text"
        placeholder="Search by title or genre"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          results.map((game) => <GameCard key={game._id} game={game} />)
        )}
      </div>
    </div>
  );
}
