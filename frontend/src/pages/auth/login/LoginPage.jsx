import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient=useQueryClient();
	const {mutate:loginMutation,isPending,isError,error}=useMutation({
		mutationFn:async ({username,password} )=>{
			try {
				const res = await fetch("/api/auth/login",{
					method:"POST",
					headers:{
						"Content-Type":"application/json",
					},
					body:JSON.stringify({username,password})
				});

				const data= await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something went wrong!");
				};



			} catch (error) {
				throw new Error(error);
			};
		},
		onSuccess:()=>{
			toast.success("Login successful");
			queryClient.invalidateQueries({queryKey:["authUser"]})
		}
	})
	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center justify-center bg-gradient-to-br from-stone-900/50 to-transparent'>
				<img 
					src="/logo.svg" 
					alt="Nexus Logo" 
					className='lg:w-2/3 transform hover:scale-105 transition-transform duration-500 dark:invert' 
				/>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center px-6 bg-gradient-to-br from-transparent to-stone-900/30'>
				<div className='w-full max-w-md space-y-8'>
					<div className='text-center'>
						<h1 className='text-4xl font-bold mb-2'>Welcome to Nexus</h1>
						<p className='text-gray-400'>Connect, Share, Inspire</p>
					</div>

					<form className='flex gap-5 flex-col backdrop-blur-sm bg-black/10 p-8 rounded-2xl shadow-xl' onSubmit={handleSubmit}>
						<label className='input input-bordered flex items-center gap-2 bg-stone-900/50 border-gray-700 hover:border-gray-600 transition-colors rounded-lg focus-within:border-gray-500'>
							<MdOutlineMail className='text-gray-400 group-hover:text-white transition-colors' />
							<input
								type='text'
								className='grow bg-transparent placeholder:text-gray-500 focus:outline-none'
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>

						<label className='input input-bordered flex items-center gap-2 bg-stone-900/50 border-gray-700 hover:border-gray-600 transition-colors rounded-lg focus-within:border-gray-500'>
							<MdPassword className='text-gray-400 group-hover:text-white transition-colors' />
							<input
								type='password'
								className='grow bg-transparent placeholder:text-gray-500 focus:outline-none'
								placeholder='Password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</label>

						<button className='btn rounded-lg bg-white hover:bg-gray-200 text-black font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'>
							{isPending?"Loading...":"Login"}
						</button>

						{isError && (
							<div className='bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2'>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{error.message}
							</div>
						)}
					</form>

					<div className='flex flex-col gap-4 mt-6 text-center'>
						<div className='text-gray-400'>
							{"Don't"} have an account?{' '}
							<Link to='/signup' className='text-white hover:text-gray-300 transition-colors font-medium'>
								Sign up
							</Link>
						</div>
						<Link to='/signup' className='block'>
							<button className='btn rounded-lg w-full border-white/20 hover:border-white/40 bg-transparent hover:bg-white/5 text-white transition-all duration-300'>
								Create new account
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;