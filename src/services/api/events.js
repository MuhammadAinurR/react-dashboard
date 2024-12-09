export const eventsApi = (fetch) => {
  const BASE_URL = "/events";

  const handleResponse = async (res) => {
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    return res.status !== 204 ? res.json() : null;
  };

  return {
    getEvents: async (page = 1, search = "") => {
      const params = new URLSearchParams({ page: page, limit: 10 });
      if (search) params.append("search", search);
      const res = await fetch(`${BASE_URL}?${params}`);
      return handleResponse(res);
    },

    deleteEvent: async (eventId) => {
      const res = await fetch(`${BASE_URL}/${eventId}`, {
        method: "DELETE",
      });
      return handleResponse(res);
    },

    updateEvent: async (eventId, data) => {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      };

      const res = await fetch(`${BASE_URL}/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (res.status === 503) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Service temporarily unavailable");
      }
    },

    createEvent: async (data) => {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      };

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (res.status === 503) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Service temporarily unavailable");
      }
    },
  };
};
