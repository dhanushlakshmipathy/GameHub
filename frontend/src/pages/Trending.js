import { useEffect, useState } from "react";
import { getTrending } from "../services/api";
import GameCard from "../components/GameCard";

export default function Trending(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        const res = await getTrending();
        setItems(res.data || []);
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  if(loading) return <div className="center" style={{minHeight:200}}>Loading…</div>;
  if(!items.length) return <p>No trending games right now.</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="m-0">Trending</h2>
        <span className="subtitle">{items.length} games</span>
      </div>
      <div className="grid cards">
        {items.map(g => <GameCard key={g._id} game={g} />)}
      </div>
    </div>
  );
}
