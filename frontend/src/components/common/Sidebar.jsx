import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {

	const queryClient=useQueryClient();


	const {mutate:logout,isError,error}=useMutation({
		mutationFn:async ()=>{
			try {
				const res = await fetch("/api/auth/logout",{
					method:"POST"
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
			toast.success("Logout successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	}); 

		const {data:authUser} = useQuery({queryKey:['authUser']})

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start p-4 group'>
					<img 
						src="/logo.svg" 
						alt="Nexus Logo" 
						className='w-16 h-16 md:w-20 md:h-20 transition-all duration-300 transform group-hover:scale-110 dark:invert' 
					/>
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900/90 hover:shadow-lg transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer group hover:translate-x-1'
						>
							<MdHomeFilled className='w-8 h-8 transition-transform duration-300 group-hover:scale-110' />
							<span className='text-lg hidden md:block font-medium group-hover:text-white transition-colors'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900/90 hover:shadow-lg transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer group hover:translate-x-1'
						>
							<IoNotifications className='w-6 h-6 transition-transform duration-300 group-hover:scale-110' />
							<span className='text-lg hidden md:block font-medium group-hover:text-white transition-colors'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900/90 hover:shadow-lg transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer group hover:translate-x-1'
						>
							<FaUser className='w-6 h-6 transition-transform duration-300 group-hover:scale-110' />
							<span className='text-lg hidden md:block font-medium group-hover:text-white transition-colors'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-stone-900/90 py-2 px-4 rounded-full group relative overflow-hidden'
					>
						<div className='avatar hidden md:inline-flex transition-transform duration-300 group-hover:scale-110'>
							<div className='w-8 rounded-full ring-2 ring-transparent group-hover:ring-white/20'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between items-center flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate group-hover:text-white/90'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm group-hover:text-slate-400'>@{authUser?.username}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:text-white' onClick={(e)=>{
								e.preventDefault();
								logout();
							}}/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;