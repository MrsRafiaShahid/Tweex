import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import LoadingSpinner from "./LoadingSpinner";
import useAuthUser from "../../hooks/useAuthUser";
import PostComponent from "./PostComponent";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const { data: authUser, isLoading: authLoading } = useAuthUser();
  const postOwner = post.user;

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
const { mutate: repost, isPending: isReposting } = useMutation({
  mutationFn: async () => {
    const res = await fetch(`/api/posts/repostPost/${post._id}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    return data;
  },
  onSuccess: (repostData) => {
  queryClient.setQueryData(["posts"], (oldData) => {
    // If it's a new repost
    if (!repostData.unrepostId) {
      return [repostData, ...oldData.map(post => {
        // Update the original post's reposts count
        if (post._id === repostData.originalPost?._id) {
          return {
            ...post,
            reposts: [...post.reposts, authUser._id]
          };
        }
        return post;
      })];
    }
    // If it's an unrepost
    return oldData.filter(post => post._id !== repostData.unrepostId);
  });
  toast.success(repostData.message || "Reposted successfully!");
},
  onError: (error) => {
    toast.error(error.message);
  },
});
  const { mutate: likeComment, isPending: isCommentLiking } = useMutation({
    mutationFn: async (commentId) => {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to like comment");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["posts"], (oldData) => {
      return oldData.map((p) => {
        if (p._id === post._id) {
          const updatedComments = p.comments.map((c) => {
            if (c._id === data.updatedComment._id) {
              // Preserve existing user data while updating likes
              return {
                ...c,
                likes: data.updatedComment.likes
              };
            }
            return c;
          });
          return { ...p, comments: updatedComments };
        }
        return p;
      });
    });
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
  const isMyPost = authUser?._id === post?.user?._id;
  // Add at the top of your component
  if (authLoading) return <LoadingSpinner size="md" />;
  if (!authUser) return <div>Error loading user data</div>;
  if (!post) return <p className="text-center my-4">Post not found</p>;

  const formattedDate = formatPostDate(post?.createdAt);

  const handleLikeComment = (commentId) => {
    likeComment(commentId);
  };
  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };
  const handleRepost = () => {
    if (isReposting) return;
    repost();
  };
    const isRepost = !!post.originalPost;
  const reposter = post.user;

  return (
    <>
    {isRepost && (
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-1">
          <BiRepost className="w-4 h-4 text-green-500" />
          <span>Reposted by</span>
          <Link
            to={`/profile/${reposter?.username}`}
            className="font-semibold text-green-300 hover:text-sky-400"
          >
            @{reposter?.username}
          </Link>
        </div>
      )}

{post?.originalPost ? (
  <div className="border border-gray-600 rounded-lg p-0 md:p-4 mb-4 mt-2">
    {/* Use post.user for reposter info, not originalPost.user */}
    <div className="flex items-center gap-2 mb-2">
      <img
        src={post.user?.profilePicture || "/avatar-placeholder.png"}
        className="w-8 h-8 rounded-full"
        alt="Reposter"
      />
      <div>
        <span className="font-bold">{post.user?.fullName}</span>
        <span className="text-sm text-gray-500 ml-2">
          @{post.user?.username}
        </span>
      </div>
    </div>
    
    {/* Original post content */}
    <div className="ml-10 border-l-2 pl-4 border-gray-700">
      <div className="flex items-center gap-2">
        <img
          src={
            post.originalPost.user?.profilePicture || 
            "/avatar-placeholder.png"
          }
          className="w-6 h-6 rounded-full"
          alt="Original Post Owner"
        />
        <div>
          <span className="font-bold text-sm">
            {post.originalPost.user?.fullName}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            @{post.originalPost.user?.username}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm">{post.originalPost?.caption}</p>
      {post?.originalPost.image && (
        <img
          src={post.originalPost?.image}
          className="mt-2 max-w-full h-48 object-contain rounded-lg"
          alt="Original Post Image"
        />
      )}
      <span className="text-xs text-gray-500 block mt-1">
        {formatPostDate(post.originalPost?.createdAt)}
      </span>
    </div>
    
    {/* Repost info */}
    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
      <BiRepost className="text-green-500" />
      <span>Reposted by</span>
      <Link
        to={`/profile/${post.user?.username}`}
        className="font-semibold text-green-300 hover:text-sky-400"
      >
        @{post.user?.username}
      </Link>
    </div>
  </div>
) : (
         <PostComponent
        post={post}
        postOwner={postOwner}
        formattedDate={formattedDate}
        isMyPost={isMyPost}
        isDeleting={isDeleting}
        isLiking={isLiking}
        isCommenting={isCommenting}
        isReposting={isReposting}
        handleDeletePost={handleDeletePost}
        handlePostComment={handlePostComment}
        handleLikePost={handleLikePost}
        handleRepost={handleRepost}
        comment={comment}
        setComment={setComment}
        authUser={authUser}
        formatPostDate={formatPostDate}
        handleLikeComment={handleLikeComment}
        isCommentLiking={isCommentLiking}
      />
      )}
    </>
  );
};

export default Post;
