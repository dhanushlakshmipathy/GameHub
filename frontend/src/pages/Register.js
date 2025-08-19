import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register(){
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async(e)=>{
    e.preventDefault();
    setLoading(true); setError("");
    try{
      await registerUser({ username, email, password });
      nav("/login");
    }catch(err){
      setError(err.response?.data?.message || "Registration failed");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:460, margin:"0 auto"}}>
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Username</label>
          <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {error && <div className="subtitle" style={{color:"var(--danger)"}}>{error}</div>}
        <button className="btn mt-2" disabled={loading}>{loading ? "…" : "Sign up"}</button>
      </form>
    </div>
  );
}
