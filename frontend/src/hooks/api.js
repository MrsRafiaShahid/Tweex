const Base_URL = import.meta.env.VITE_API_BASE_URL || "/api";


export const fetchData = async (endpoint, options = {}) => {
  const response = await fetch(`${Base_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Include cookies in the request
    headers: {
      "Content-Type": "application/json",
        ...options.headers,
    },
  });

  if (!response.ok) {
    const error =await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}