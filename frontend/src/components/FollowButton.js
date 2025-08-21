import { useEffect, useState } from "react";
import { followUser, unfollowUser, getMe } from "../services/api";

export default function FollowButton({ userId }){
  const [following, setFollowing] = useState(new Set());
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token) return;
    (async()=>{
      try{
        const me = await getMe();
        const ids = (me.data?.following || []).map(u => u._id || u);
        setFollowing(new Set(ids));
      }catch(e){}
    })();
  }, [token]);

  if(!token || !userId) return null;

  const isFollowing = following.has(userId);

  const toggle = async ()=>{
    try{
      if(isFollowing){
        await unfollowUser(userId);
        const next = new Set(following); next.delete(userId); setFollowing(next);
      }else{
        await followUser(userId);
        const next = new Set(following); next.add(userId); setFollowing(next);
      }
    }catch(e){
      console.error(e);
    }
  };

  return (
    <button className={"btn " + (isFollowing ? "secondary" : "")} onClick={toggle}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
