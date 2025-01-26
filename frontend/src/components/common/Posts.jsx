import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username]);


	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 pb-4">
				{[...Array(4)].map((_, idx) => (
					<PostSkeleton key={idx} />
				))}
			</div>
		);
	}

	return (
		<div className={`flex flex-col ${isRefetching ? 'opacity-60' : 'opacity-100'} transition-opacity duration-200`}>
			{posts?.map((post) => (
				<Post key={post._id} post={post} />
			))}
			{posts?.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					<p className="text-lg mb-2">No posts yet</p>
					<p className="text-sm">Start following people or create your first post!</p>
				</div>
			)}
		</div>
	);
};
export default Posts;