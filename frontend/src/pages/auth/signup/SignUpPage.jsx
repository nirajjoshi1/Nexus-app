import { Link } from "react-router-dom";
import { useState } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				// Debug response
				console.log("Response status:", res.status);
				console.log("Response headers:", Object.fromEntries(res.headers.entries()));
				
				// Try to get the raw text first
				const rawText = await res.text();
				console.log("Raw response:", rawText);

				// Then parse it as JSON if possible
				let data;
				try {
					data = JSON.parse(rawText);
				} catch (parseError) {
					console.error("JSON Parse Error:", parseError);
					throw new Error(`Failed to parse response: ${rawText.slice(0, 100)}`);
				}

				if (!res.ok) {
					throw new Error(data.error || `Failed to create account (${res.status})`);
				}

				return data;
			} catch (error) {
				console.error("Signup Error:", error);
				throw error instanceof Error ? error : new Error("Network error occurred");
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
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
						<h1 className='text-4xl font-bold mb-2'>Join Nexus Today</h1>
						<p className='text-gray-400'>Your Social Universe Awaits</p>
					</div>
					<form className='flex gap-5 flex-col backdrop-blur-sm bg-black/10 p-8 rounded-2xl shadow-xl' onSubmit={handleSubmit}>
						<label className='input input-bordered flex items-center gap-2 bg-stone-900/50 border-gray-700 hover:border-gray-600 transition-colors rounded-lg focus-within:border-gray-500'>
							<MdOutlineMail className='text-gray-400 group-hover:text-white transition-colors' />
							<input
								type='email'
								className='grow bg-transparent placeholder:text-gray-500 focus:outline-none'
								placeholder='Email'
								name='email'
								onChange={handleInputChange}
								value={formData.email}
							/>
						</label>

						<div className='flex gap-4 flex-col sm:flex-row'>
							<label className='input input-bordered flex items-center gap-2 bg-stone-900/50 border-gray-700 hover:border-gray-600 transition-colors rounded-lg focus-within:border-gray-500 flex-1'>
								<FaUser className='text-gray-400 group-hover:text-white transition-colors' />
								<input
									type='text'
									className='grow bg-transparent placeholder:text-gray-500 focus:outline-none'
									placeholder='Username'
									name='username'
									onChange={handleInputChange}
									value={formData.username}
								/>
							</label>

							<label className='input input-bordered flex items-center gap-2 bg-stone-900/50 border-gray-700 hover:border-gray-600 transition-colors rounded-lg focus-within:border-gray-500 flex-1'>
								<MdDriveFileRenameOutline className='text-gray-400 group-hover:text-white transition-colors' />
								<input
									type='text'
									className='grow bg-transparent placeholder:text-gray-500 focus:outline-none'
									placeholder='Full Name'
									name='fullName'
									onChange={handleInputChange}
									value={formData.fullName}
								/>
							</label>
						</div>

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

						<button 
							className='btn rounded-lg bg-white hover:bg-gray-200 text-black font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed' 
							disabled={isPending}
						>
							{isPending ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								'Create Account'
							)}
						</button>

						{isError && (
							<div className='bg-red-500/10 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2'>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{error?.message || 'Something went wrong'}
							</div>
						)}
					</form>

					<div className='flex flex-col gap-4 mt-6 text-center'>
						<div className='text-gray-400'>
							Already have an account?{' '}
							<Link to='/login' className='text-white hover:text-gray-300 transition-colors font-medium'>
								Log in
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
