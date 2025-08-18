import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check if user is logged in
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${query}`);
      setQuery("");
    }
  };

  return (
    <nav style={{
      padding: "10px 20px",
      borderBottom: "1px solid #ccc",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div>
        <Link to="/" style={{ marginRight: 15 }}>Home</Link>
        <Link to="/trending" style={{ marginRight: 15 }}>Trending</Link>
        <Link to="/search" style={{ marginRight: 15 }}>Search</Link>
      </div>

      <form onSubmit={handleSearch} style={{ display: "inline-block" }}>
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: 5 }}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {token ? (
          <>
            <Link to="/profile" style={{ marginRight: 10 }}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
