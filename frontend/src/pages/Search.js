import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchGames } from "../services/api";
import GameCard from "../components/GameCard";

function useQuery(){
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function Search(){
  const params = useQuery();
  const initial = params.get("query") || "";
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setQ(initial);
    if(initial) doSearch(initial);
    // eslint-disable-next-line
  }, [initial]);

  async function doSearch(query){
    setLoading(true);
    try{
      const res = await searchGames(query);
      setResults(res.data || []);
    }catch(e){
      console.error(e);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="m-0">Search</h2>
      </div>

      <div className="form-inline">
        <input className="input" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Title or genre…" />
        <button className="btn" onClick={()=>q.trim() && doSearch(q.trim())}>Search</button>
      </div>

      <div className="hr" />

      {loading && <div className="center" style={{minHeight:120}}>Searching…</div>}
      {!loading && results.length === 0 && <p>Type a query to find games.</p>}
      <div className="grid cards mt-2">
        {results.map(g => <GameCard key={g._id} game={g} />)}
      </div>
    </div>
  );
}
