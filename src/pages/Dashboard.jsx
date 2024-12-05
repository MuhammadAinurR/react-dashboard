import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <p>This is dashboard</p>
      <p>Welcome {user.username}</p>
    </div>
  );
}
