import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar(){
  const nav = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState("");
  const token = localStorage.getItem("token");

  useEffect(()=>{
    const p = new URLSearchParams(loc.search);
    setQ(p.get("query") || "");
  }, [loc.search]);

  const submit = (e)=>{
    e.preventDefault();
    const query = q.trim();
    if(!query) return;
    nav(`/search?query=${encodeURIComponent(query)}`);
  };

  const logout = ()=>{
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-logo" />
          <span>GameHub</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/trending">Trending</Link>
          {token && <Link to="/profile">Profile</Link>}
        </div>

        <div className="nav-spacer" />

        <form className="nav-search" onSubmit={submit}>
          <input
            placeholder="Search games…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button className="btn" type="submit">Search</button>
        </form>

        <div style={{marginLeft: 10, display:"flex", gap:8}}>
          {token ? (
            <button className="btn secondary" onClick={logout}>Logout</button>
          ) : (
            <>
              <Link className="btn secondary" to="/login">Log in</Link>
              <Link className="btn" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
