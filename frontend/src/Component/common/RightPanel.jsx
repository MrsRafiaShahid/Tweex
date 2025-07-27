import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner"

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user/suggested");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();
  
  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;
  
  return (
    <div className="hidden lg:block my-4 mx-2">
      {/* Changed to theme-aware classes */}
      <div className="bg-base-200 p-4 rounded-box sticky top-2">
        <p className="font-bold text-base-content">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 hover:bg-base-300 rounded-box p-2 transition-colors duration-200"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img 
                        src={user.profilePicture || "/avatar-placeholder.png"} 
                        alt={`${user.username}'s profile`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28 text-base-content">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-base-content opacity-70">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-sm rounded-full text-base-100"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm"/> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;