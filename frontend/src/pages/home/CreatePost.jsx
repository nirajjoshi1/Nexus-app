import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [isZoomed, setIsZoomed] = useState(false);
	const imgRef = useRef(null);


	const {data:authUser} = useQuery({queryKey:["authUser"]});
	const queryClient = useQueryClient();

	const {mutate:createPost,isPending,isError,error} = useMutation({
		mutationFn:async ({text,img})=>{
			try {
				const res = await fetch("/api/posts/create",{
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({text,img}),
				});

				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error||"Something Went Wrong")
				};
				return data;
			} catch (error) {
				throw new Error(error);
			};
			
		},

		onSuccess:()=>{
			setText("");
			setImg(null);
			toast.success("Post created successfully");

			queryClient.invalidateQueries({queryKey:["posts"]})
		},
		onError:(error)=>{
			toast.error(error.message);
		}

	})


	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text,img})
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		} else if (file) {
			toast.error("Please select an image file");
		}
	};

	const toggleZoom = () => {
		setIsZoomed(!isZoomed);
	};


	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300'>
			<div className='avatar'>
				<div className='w-10 rounded-full ring-2 ring-gray-700 hover:ring-gray-500 transition-all duration-300'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} className="object-cover" />
				</div>
			</div>
			<form className='flex flex-col gap-3 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-2 text-lg resize-none bg-transparent border-none focus:outline-none placeholder:text-gray-500 min-h-[100px] transition-all duration-300'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-full mx-auto'>
						<button
							type="button"
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
							className='absolute -top-2 -right-2 z-10 btn btn-sm btn-circle bg-red-500 hover:bg-red-600 border-none shadow-lg transform hover:scale-110 transition-all duration-300'
						>
							<IoCloseSharp className='w-4 h-4 text-white' />
						</button>
						<div 
							className={`rounded-xl overflow-hidden bg-gray-900/50 ${
								isZoomed ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/90' : 'aspect-[16/9]'
							}`}
							onClick={toggleZoom}
						>
							<img 
								src={img} 
								className={`${
									isZoomed 
										? 'max-w-[90vw] max-h-[90vh] object-cover cursor-zoom-out'
										: 'w-full h-full object-cover hover:scale-[1.02] cursor-zoom-in'
								} transition-transform duration-300`}
								alt="Post preview"
							/>
						</div>
					</div>
				)}

				<div className='flex justify-between items-center border-t py-3 border-t-gray-700/50'>
					<div className='flex gap-3 items-center'>
						<button
							type="button"
							className='btn btn-sm btn-circle bg-blue-500/10 hover:bg-blue-500/20 border-none transition-colors duration-300'
							onClick={() => imgRef.current.click()}
						>
							<CiImageOn className='w-5 h-5 text-blue-500' />
						</button>
						
					</div>
					<input 
						type='file' 
						hidden 
						ref={imgRef} 
						onChange={handleImgChange}
						accept="image/*"
					/>
					<button 
						className='btn btn-sm px-6 bg-blue-500 hover:bg-blue-600 text-white border-none rounded-full transition-all duration-300 hover:shadow-lg disabled:bg-blue-500/50'
						disabled={!text.trim() && !img}
					>
						{isPending ? (
							"Posting..."
						) : (
							'Post'
						)}
					</button>
				</div>
				{/* {isError && (
					<div className='bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2 mt-2'>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
						
					</div>
				)} */}
			</form>
		</div>
	);
};

export default CreatePost;