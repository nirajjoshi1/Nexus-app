const PostSkeleton = () => {
	return (
		<div className='flex gap-3 items-start p-4 border-b border-gray-800 bg-black/20'>
			<div className='skeleton w-10 h-10 rounded-full shrink-0 ring-2 ring-gray-800'></div>
			<div className='flex flex-col gap-4 flex-1'>
				<div className='flex items-center gap-2'>
					<div className='skeleton h-4 w-24 rounded-full'></div>
					<div className='skeleton h-3 w-32 rounded-full'></div>
				</div>
				
				<div className='space-y-2'>
					<div className='skeleton h-4 w-3/4 rounded-full'></div>
					<div className='skeleton h-4 w-1/2 rounded-full'></div>
				</div>
				
				<div className='skeleton h-64 w-full rounded-xl'></div>
				
				<div className='flex justify-between items-center pt-2'>
					<div className='flex gap-6'>
						<div className='skeleton w-14 h-6 rounded-full'></div>
						<div className='skeleton w-14 h-6 rounded-full'></div>
						<div className='skeleton w-14 h-6 rounded-full'></div>
					</div>
					<div className='skeleton w-6 h-6 rounded-full'></div>
				</div>
			</div>
		</div>
	);
};

export default PostSkeleton;