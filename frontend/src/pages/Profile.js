export default function Profile(){
  const token = localStorage.getItem("token");
  if(!token){
    return <p>You are not logged in.</p>;
  }
  return (
    <div>
      <h2>Your profile</h2>
      <p className="subtitle">Authenticated via JWT stored in localStorage.</p>
    </div>
  );
}
