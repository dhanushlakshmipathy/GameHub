import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async(e)=>{
    e.preventDefault();
    setLoading(true); setError("");
    try{
      const res = await loginUser({ email, password });
      const token = res.data?.token;
      if(token){
        localStorage.setItem("token", token);
        nav("/");
        return;
      }
      setError("Invalid response");
    }catch(err){
      setError(err.response?.data?.message || "Login failed");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:420, margin:"0 auto"}}>
      <h2>Log in</h2>
      <form onSubmit={submit}>
        <div className="form-row">
          <label>Email</label>
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {error && <div className="subtitle" style={{color:"var(--danger)"}}>{error}</div>}
        <button className="btn mt-2" disabled={loading}>{loading ? "…" : "Log in"}</button>
      </form>
    </div>
  );
}
