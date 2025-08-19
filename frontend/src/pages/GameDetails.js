import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGameById, getReviewsByGame, getAverageRating, createReview } from "../services/api";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";

export default function GameDetails(){
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(()=>{
    (async()=>{
      try{
        const [g, r, a] = await Promise.all([
          getGameById(id),
          getReviewsByGame(id),
          getAverageRating(id),
        ]);
        setGame(g.data);
        setReviews(r.data || []);
        setAvg(parseFloat(a.data?.averageRating || 0));
      }catch(e){
        console.error(e);
      }finally{
        setLoading(false);
      }
    })();
  },[id]);

  const submit = async(e)=>{
    e.preventDefault();
    if(!token) return alert("Log in to review");
    if(!rating) return alert("Pick a rating");
    try{
      await createReview({ gameId: id, rating, comment });
      const [r, a] = await Promise.all([getReviewsByGame(id), getAverageRating(id)]);
      setReviews(r.data || []);
      setAvg(parseFloat(a.data?.averageRating || 0));
      setComment(""); setRating(0);
    }catch(err){
      alert(err.response?.data?.message || "Failed to post review");
    }
  };

  if(loading) return <div className="center" style={{minHeight:200}}>Loading…</div>;
  if(!game) return <p>Not found.</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="m-0">{game.title}</h2>
          <div className="subtitle mt-1">{game.genre} {game.platform ? `• ${game.platform}` : ""}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <StarRating value={avg} />
          <div className="subtitle">{isNaN(avg) ? "—" : `${avg}/5 avg`}</div>
        </div>
      </div>

      {game.description && <p style={{lineHeight:1.6}}>{game.description}</p>}

      <div className="hr" />

      <h3 className="m-0">Reviews</h3>
      <div className="mt-2" style={{display:"grid", gap:12}}>
        {reviews.length ? reviews.map(rv => <ReviewCard key={rv._id} review={rv} />) : <p className="subtitle">No reviews yet.</p>}
      </div>

      <div className="hr" />

      <h3 className="m-0">Add your review</h3>
      <form onSubmit={submit} className="mt-2">
        <div className="form-row">
          <label>Rating</label>
          <select className="select" value={rating} onChange={(e)=>setRating(Number(e.target.value))}>
            <option value={0}>Select…</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Comment</label>
          <textarea className="textarea" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="What did you think?" />
        </div>
        <button className="btn">Post review</button>
      </form>
    </div>
  );
}
