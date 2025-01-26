import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'follow',
            user: {
                id: '1',
                fullName: 'John Doe',
                username: 'johndoe',
                profileImg: '/avatars/boy1.png'
            },
            isRead: false,
            createdAt: '2024-01-25T04:24:00.000Z'
        },
        {
            id: 2,
            type: 'like',
            user: {
                id: '2',
                fullName: 'Jane Smith',
                username: 'janesmith',
                profileImg: '/avatars/girl1.png'
            },
            postId: '123',
            isRead: true,
            createdAt: '2024-01-24T14:30:00.000Z'
        }
    ]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return 'now';
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        toast.success('All notifications marked as read');
    };

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'follow':
                return 'followed you';
            case 'like':
                return 'liked your post';
            default:
                return 'interacted with you';
        }
    };

    return (
        <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
            <div className='flex justify-between items-center px-4 py-2 border-b border-gray-700/50'>
                <div className='flex gap-10 items-center'>
                    <Link to='/'>
                        <FaArrowLeft className='w-4 h-4' />
                    </Link>
                    <h1 className='font-bold text-lg'>Notifications</h1>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className='text-sm text-blue-500 hover:text-blue-600 transition-colors'
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className='flex flex-col'>
                {notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4 mt-20 px-4 text-center'>
                        <IoNotificationsOffOutline className='w-16 h-16 text-gray-500' />
                        <div className='flex flex-col gap-1'>
                            <h2 className='font-bold text-xl'>No notifications yet</h2>
                            <p className='text-gray-500'>
                                When someone interacts with you or your posts, you'll see it here
                            </p>
                        </div>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 hover:bg-gray-900/30 transition-colors cursor-pointer ${
                                !notification.isRead ? 'bg-gray-900/20' : ''
                            }`}
                        >
                            <Link to={`/profile/${notification.user.username}`} className='avatar'>
                                <div className='w-10 rounded-full ring-2 ring-gray-700 hover:ring-gray-500 transition-all duration-300'>
                                    <img
                                        src={notification.user.profileImg || '/avatar-placeholder.png'}
                                        alt={notification.user.fullName}
                                        className='object-cover'
                                    />
                                </div>
                            </Link>
                            <div className='flex flex-col flex-1 gap-1'>
                                <div className='flex justify-between items-start gap-2'>
                                    <div className='flex flex-col'>
                                        <Link
                                            to={`/profile/${notification.user.username}`}
                                            className='font-semibold hover:underline'
                                        >
                                            {notification.user.fullName}
                                        </Link>
                                        <p className='text-sm text-gray-400'>
                                            {getNotificationText(notification)}
                                        </p>
                                    </div>
                                    <span className='text-xs text-gray-500'>
                                        {formatTime(notification.createdAt)}
                                    </span>
                                </div>
                                {!notification.isRead && (
                                    <div className='w-2 h-2 rounded-full bg-blue-500 absolute top-1/2 -left-1 transform -translate-y-1/2'></div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
