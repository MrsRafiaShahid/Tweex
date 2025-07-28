import {
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router-dom";
import { BiRepost } from "react-icons/bi";

const PostComponent = ({
  post,
  postOwner,
  formattedDate,
  isMyPost,
  isDeleting,
  handleDeletePost,
  handlePostComment,
  isCommenting,
  comment,
  handleRepost,
  isReposting,
  handleLikePost,
  isLiking,
  authUser,
  setComment,
  formatPostDate,
  handleLikeComment,
  isCommentLiking,


}) => {
  const isLiked = post.likes.includes(authUser?._id);
  const isReposted =
    post.reposts.includes(authUser?._id) ||
    post.repostedBy?._id === authUser?._id;
// const postOwner = post.user || post.originalPost?.user;
  return (
    <div className="flex gap-2 items-start p-4 border-b border-base-300">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner?.username}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img
            src={postOwner?.profilePicture || "/avatar-placeholder.png"}
            alt={postOwner?.username}
          />
        </Link>
      </div>

      <div className="flex flex-col flex-1">
        {/* Header with user info */}
        <div className="flex gap-2 items-center">
          <Link
            to={`/profile/${postOwner?.username}`}
            className="font-bold text-base-content"
          >
            {postOwner?.fullName}
          </Link>

          <span className="flex gap-1 text-sm text-base-content opacity-70">
            <Link
              to={`/profile/${postOwner?.username}`}
              className="hover:underline"
            >
              @{postOwner?.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>

          {isMyPost && (
            <div className="flex justify-end flex-1">
              {!isDeleting ? (
                <FaTrash
                  className="cursor-pointer text-base-content hover:text-error"
                  onClick={handleDeletePost}
                />
              ) : (
                <LoadingSpinner size="sm" />
              )}
            </div>
          )}
        </div>

        {/* Post content */}
        <div className="flex flex-col gap-3 overflow-hidden mt-1">
          <span className="text-base-content">{post?.caption}</span>
          {post.image && (
            <img
              src={post?.image}
              className="h-80 object-contain rounded-lg border border-base-300"
              alt="Post content"
            />
          )}
        </div>

        {/* Interaction buttons */}
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            {/* Comments */}
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document.getElementById(`comments_modal${post._id}`).showModal()
              }
            >
              <FaRegComment className="w-4 h-4 text-base-content opacity-70 group-hover:text-primary" />
              <span className="text-sm text-base-content opacity-70 group-hover:text-primary">
                {post.comments?.length}
              </span>
            </div>

            {/* Repost */}
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleRepost}
            >
              {isReposting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <BiRepost
                  className={`w-6 h-6 ${
                    isReposted
                      ? "text-success"
                      : "text-base-content opacity-70 group-hover:text-success"
                  }`}
                />
              )}
              <span
                className={`text-sm ${
                  isReposted
                    ? "text-success"
                    : "text-base-content opacity-70 group-hover:text-success"
                }`}
              >
                {post?.reposts?.length}
              </span>
            </div>

            {/* Like */}
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FaRegHeart
                  className={`w-6 h-6 ${
                    isLiked
                      ? "text-pink-500 fill-pink-500"
                      : "text-base-content opacity-70 group-hover:text-pink-500"
                  }`}
                />
              )}
              <span
                className={`text-sm group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : "text-base-content opacity-70"
                }`}
              >
                {post.likes?.length}
              </span>
            </div>
          </div>

          <div className="flex w-1/3 justify-end gap-2 items-center">
            <FaRegBookmark className="w-4 h-4 text-base-content opacity-70 cursor-pointer hover:text-warning" />
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <dialog
        id={`comments_modal${post._id}`}
        className="modal border-none outline-none"
      >
        <div className="modal-box rounded-lg border border-base-300">
          <h3 className="font-bold text-lg mb-4 text-base-content">COMMENTS</h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-auto">
            {post.comments.length === 0 ? (
              <p className="text-sm text-base-content opacity-70">
                No comments yet 🤔 Be the first one 😉
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-2 items-start">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={
                          comment.user?.profilePicture ||
                          "/avatar-placeholder.png"
                        }
                        alt={comment.user?.username}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-base-content">
                        {comment.user?.fullName || "Unknown User"}
                      </span>
                      <span className="text-sm text-base-content opacity-70">
                        @{comment.user?.username || "unknown"}
                      </span>
                    </div>
                    <div className="text-sm text-base-content">
                      {comment?.comment}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className="text-xs flex items-center gap-1 text-base-content opacity-70 hover:text-red-500"
                        disabled={isCommentLiking}
                      >
                        {isCommentLiking ? (
                          <LoadingSpinner size="xs" />
                        ) : comment.likes?.includes(authUser?._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                        {comment.likes?.length || 0}
                      </button>
                    </div>
                    <span className="text-xs text-base-content opacity-50">
                      {formatPostDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            className="flex gap-2 items-center mt-4 border-t border-base-300 pt-2"
            onSubmit={handlePostComment}
          >
            <textarea
              className="textarea textarea-bordered w-full p-2 rounded-lg text-md resize-none"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="btn btn-primary rounded-full btn-sm px-4"
              disabled={isCommenting}
            >
              {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default PostComponent;
