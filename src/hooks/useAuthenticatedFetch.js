import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuthenticatedFetch = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const authFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        logout();
        navigate("/login");
        return;
      }

      return response;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  return authFetch;
};
