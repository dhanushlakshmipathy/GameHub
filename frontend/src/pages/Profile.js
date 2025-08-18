import { useEffect, useState } from "react";
import { getUsers } from "../services/api";

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUsers(); // fetch all users
        const foundUser = res.data.find(u => u._id === userId); // find the current user
        setUser(foundUser);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      {/* Add more profile details here */}
    </div>
  );
}
