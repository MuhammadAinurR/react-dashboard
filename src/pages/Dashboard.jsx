import { useAuth } from "../context/AuthContext";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";

export default function Dashboard() {
  const authFetch = useAuthenticatedFetch();
  const { user } = useAuth();
  return (
    <div>
      <p>This is dashboard</p>
      <p>Welcome {user.username}</p>
    </div>
  );
}
