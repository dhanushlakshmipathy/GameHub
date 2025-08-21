import { useEffect, useState } from "react";
import { getFeed } from "../services/api";
import StarRating from "../components/StarRating";
import { Link } from "react-router-dom";

export default function Feed(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        const res = await getFeed();
        setItems(res.data || []);
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    })();
  }, []);

  if(loading) return <p>Loading feed…</p>;
  if(!items.length) return <p>Your feed is empty. Follow people to see their reviews.</p>;

  return (
    <div>
      <div className="page-header">
        <h2 className="m-0">Friends Feed</h2>
        <span className="subtitle">{items.length} recent reviews</span>
      </div>
      <div className="stack" style={{display:"grid", gap:12}}>
        {items.map((r)=> (
          <div key={r._id} className="card" style={{padding:"10px 12px"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <span className="badge">{r.user?.username || "Anon"}</span>
                <span className="subtitle">reviewed</span>
                <Link to={`/game/${r.game?._id || ""}`} className="badge">{r.game?.title || "Game"}</Link>
              </div>
              <div className="subtitle">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-1" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <StarRating value={r.rating} />
              <div className="subtitle">{r.rating}/5</div>
            </div>
            {r.comment && <p className="mt-2" style={{whiteSpace:"pre-wrap"}}>{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
