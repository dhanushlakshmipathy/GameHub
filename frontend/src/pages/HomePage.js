import { useEffect, useState } from "react";
import { getAllGames } from "../services/api";
import GameCard from "../components/GameCard";

export default function HomePage(){
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        const res = await getAllGames();
        setGames(res.data || []);
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  if(loading) return <div className="center" style={{minHeight:200}}>Loading games…</div>;
  if(!games.length) return <p>No games yet.</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="m-0">All Games</h2>
        <span className="subtitle">{games.length} titles</span>
      </div>
      <div className="grid cards">
        {games.map(g => <GameCard key={g._id} game={g} />)}
      </div>
    </div>
  );
}
