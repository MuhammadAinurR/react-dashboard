import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const publicFetch = async (url, options = {}) => {
  return fetch(`${import.meta.env.VITE_API_URL}${url}`, options);
};

const privateFetch = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const authFetch = async (url, options = {}) => {
    console.log("token", token);
    try {
      const response = await publicFetch(`${url}`, {
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

export { publicFetch, privateFetch };
