import { useQuery } from "@tanstack/react-query";

export default function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    // Fetch the current user data
    // This will be used to determine if the user is logged in

    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) return null; // If there's an error, return null
        // If the response is not ok or there's an error in data, throw an error
        if (!res.ok || data.error)
          throw new Error(data.error || "Something went wrong");
        console.log("authUser is here", data);
        return data;
      } catch (error) {
        console.error("Error fetching auth user:", error);
        return null; // Return null in case of an error
      }
    },
    retry: false, // Disable automatic retries
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
