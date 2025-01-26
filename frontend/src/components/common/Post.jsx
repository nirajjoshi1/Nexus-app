import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";


const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const postOwner = post.user;

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  //delete post
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(
        ["posts"],
        (old) => old?.filter((p) => p._id !== post._id) ?? []
      );

      return { previousPosts };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
    },
  });

  //like/unlike post
  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      //   toast.success("Post liked");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //comment on post
  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
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

  const isMyPost = authUser._id === post.user._id;
  const isLiked = post.likes.includes(authUser._id);

  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost(undefined, {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["posts"] });
        const previousPosts = queryClient.getQueryData(["posts"]);

        queryClient.setQueryData(["posts"], (old) => {
          return old?.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== authUser._id)
                  : [...p.likes, authUser._id],
              };
            }
            return p;
          });
        });

        return { previousPosts };
      },
      onError: (err, _, context) => {
        queryClient.setQueryData(["posts"], context.previousPosts);
        toast.error(err.message);
      },
    });
  };

  return (
    <>
      <div className="flex gap-3 items-start p-4 border-b border-gray-700 hover:bg-black/20 transition-all duration-300">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-10 rounded-full overflow-hidden ring-2 ring-gray-700 hover:ring-gray-500 transition-all duration-300"
          >
            <img
              src={postOwner.profileImg || "/avatar-placeholder.png"}
              className="object-cover w-full h-full"
              alt={postOwner.username}
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link
              to={`/profile/${postOwner.username}`}
              className="font-bold hover:underline transition-all duration-300"
            >
              {postOwner.fullName}
            </Link>
            <span className="text-gray-500 flex gap-1 text-sm">
              <Link
                to={`/profile/${postOwner.username}`}
                className="hover:text-gray-300 transition-colors duration-300"
              >
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <>
                <button
                  className="ml-auto btn btn-ghost btn-xs btn-circle hover:bg-red-500/10 group transition-all duration-300"
                  onClick={handleDeletePost}
                >
                  {!isDeleting && (
                    <FaTrash className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
                  )}
                  {isDeleting && <LoadingSpinner size="sm" />}
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden mt-2">
            <span className="text-gray-100">{post.text}</span>
            {post.img && (
              <div className="relative group rounded-xl overflow-hidden bg-gray-900/50 max-h-[500px]">
                <img
                  src={post.img}
                  className="w-full h-full object-contain hover:scale-[1.02] transition-transform duration-300"
                  alt="Post image"
                />
              </div>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex gap-6 items-center">
              <button
                className="flex gap-2 items-center group transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("comments_modal" + post._id)
                    .showModal()
                }
              >
                <div className="btn btn-xs btn-circle bg-blue-500/10 border-none group-hover:bg-blue-500/20 transition-colors duration-300">
                  <FaRegComment className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                  {post.comments.length}
                </span>
              </button>

              <button className="flex gap-2 items-center group transition-all duration-300">
                <div className="btn btn-xs btn-circle bg-green-500/10 border-none group-hover:bg-green-500/20 transition-colors duration-300">
                  <BiRepost className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm text-gray-500 group-hover:text-green-500 transition-colors duration-300">
                  0
                </span>
              </button>

              <button
                className="flex gap-2 items-center group transition-all duration-300"
                onClick={handleLikePost}
                disabled={isLiking}
              >
                <div
                  className={`btn btn-xs btn-circle border-none transition-all duration-300 ${
                    isLiked
                      ? "bg-pink-500/20"
                      : "bg-slate-500/10 hover:bg-pink-500/20"
                  }`}
                >
                  <FaRegHeart
                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                      isLiked
                        ? "text-pink-500 scale-110"
                        : "text-slate-500 group-hover:text-pink-500 group-hover:scale-110"
                    }`}
                  />
                </div>
                <span
                  className={`text-sm transition-all duration-300 ${
                    isLiked
                      ? "text-pink-500"
                      : "text-slate-500 group-hover:text-pink-500"
                  }`}
                >
                  {post.likes.length}
                </span>
              </button>
            </div>
            <button className="btn btn-xs btn-circle bg-blue-500/10 hover:bg-blue-500/20 border-none transition-colors duration-300">
              <FaRegBookmark className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <dialog id={`comments_modal${post._id}`} className="modal">
        <div className="modal-box bg-gray-900 border border-gray-800">
          <h3 className="font-bold text-lg mb-4 text-gray-100">Comments</h3>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-auto custom-scrollbar">
            {post.comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No comments yet</p>
                <p className="text-sm">Be the first to share your thoughts!</p>
              </div>
            )}
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                className="flex gap-3 items-start group hover:bg-black/20 p-3 rounded-lg transition-all duration-300"
              >
                <div className="avatar">
                  <div className="w-8 rounded-full ring-2 ring-gray-700 group-hover:ring-gray-600 transition-all duration-300">
                    <img
                      src={comment.user.profileImg || "/avatar-placeholder.png"}
                      className="object-cover"
                      alt={comment.user.username}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-100 hover:underline cursor-pointer">
                      {comment.user.fullName}
                    </span>
                    <span className="text-gray-500 text-sm hover:text-gray-400 transition-colors duration-300 cursor-pointer">
                      @{comment.user.username}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form
            className="flex gap-3 items-end mt-4 border-t border-gray-800 pt-4"
            onSubmit={handlePostComment}
          >
            <div className="flex-1">
              <textarea
                className="w-full bg-gray-800/50 rounded-lg p-3 text-sm resize-none border border-gray-700 focus:border-gray-600 focus:outline-none placeholder:text-gray-600 min-h-[80px]"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              className="btn btn-sm px-6 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-full transition-all duration-300 hover:shadow-lg disabled:bg-blue-500/50"
              disabled={!comment.trim() || isCommenting}
            >
              {isCommenting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Post"
              )}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/60">
          <button className="cursor-default outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default Post;
