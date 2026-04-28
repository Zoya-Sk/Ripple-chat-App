import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeToken } from '../../redux/slices/Auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setUserDetails } from '../../redux/slices/User';
import axios from 'axios';

const Sidebar = ({ setChatUserId, chatUserId }) => {  // ✅ chatUserId prop add kiya
    const { userData } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.auth);
    const { allOnlineUsers, socket } = useSelector((state) => state.socketIo);  // ✅ socket bhi lo
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [originalAllUsers, setOriginalAllUsers] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});   // { userId: count }
    const [typingUsers, setTypingUsers] = useState({});     // { userId: true/false }

    const logoutHandler = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (!confirm) return;
        dispatch(removeToken());
        dispatch(setUserDetails(null));
        toast.success("Logged out successfully.");
        navigate("/login");
    }

    const getAllUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/get-all-users`,
                { headers: { Authorization: "Bearer " + token } }
            );
            if (!response.data.success) throw new Error("Couldn't fetch users");
            setAllUsers(response.data.allUsers);
            setOriginalAllUsers(response.data.allUsers);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { getAllUsers(); }, []);

    // Socket — unread badge + typing in sidebar
    useEffect(() => {
        if (!socket) return;

        // Incoming message — agar woh chat open nahi hai toh badge badho
        const handleNewMessage = (data) => {
            if (data?.senderId?.toString() !== chatUserId?.toString()) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [data.senderId]: (prev[data.senderId] || 0) + 1
                }));
            }
        };

        const handleTypingStart = ({ senderId }) => {
            setTypingUsers(prev => ({ ...prev, [senderId]: true }));
        };

        const handleTypingStop = ({ senderId }) => {
            setTypingUsers(prev => ({ ...prev, [senderId]: false }));
        };

        socket.on("new-message", handleNewMessage);
        socket.on("typing", handleTypingStart);
        socket.on("stop-typing", handleTypingStop);

        return () => {
            socket.off("new-message", handleNewMessage);
            socket.off("typing", handleTypingStart);
            socket.off("stop-typing", handleTypingStop);
        };
    }, [socket, chatUserId]);

    // Jab chat open ho — us user ka badge clear karo
    useEffect(() => {
        if (chatUserId) {
            setUnreadCounts(prev => ({ ...prev, [chatUserId]: 0 }));
        }
    }, [chatUserId]);

    const searchHandler = (e) => {
        const value = e.target.value.toLowerCase();
        if (!value) { setAllUsers(originalAllUsers); return; }
        setAllUsers(originalAllUsers.filter((user) =>
            `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(value)
        ));
    }

    return (
        <div className="h-full flex flex-col"
            style={{ background: 'rgba(255,255,255,0.92)', borderRight: '1.5px solid rgba(200,180,255,0.4)' }}>

            <div className="flex-1 flex flex-col p-5 overflow-hidden">

                <h2 className="text-xl font-bold mb-4"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    💬 Ripple
                </h2>

                <input
                    type="text"
                    placeholder="Search people..."
                    onChange={searchHandler}
                    className="w-full px-4 py-2 rounded-xl text-sm outline-none"
                    style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }}
                />

                <div className="flex-1 overflow-y-auto mt-4 flex flex-col gap-1 pr-1">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-14 rounded-xl animate-pulse"
                                style={{ background: 'linear-gradient(90deg,#f3e8ff,#fce7f3,#f3e8ff)' }} />
                        ))
                    ) : allUsers.length < 1 ? (
                        <div className="text-center py-10 text-sm" style={{ color: '#b0a0d0' }}>
                            No users found 👀
                        </div>
                    ) : (
                        allUsers.map((user) => {
                            const unread = unreadCounts[user._id] || 0;
                            const isTypingNow = typingUsers[user._id];
                            const isOnline = allOnlineUsers.includes(user._id);

                            return (
                                <div key={user._id}
                                    onClick={() => setChatUserId(user._id)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all"
                                    onMouseEnter={e => e.currentTarget.style.background = '#f3e8ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Avatar + online dot */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={user.profilePicture}
                                            alt={user?.firstName}
                                            className="w-10 h-10 rounded-full object-cover"
                                            style={{ border: '2px solid #e0d7ff' }}
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                                            style={{ background: isOnline ? '#10b981' : '#9ca3af' }} />
                                    </div>

                                    {/* Name + typing/online status */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate" style={{ color: '#3a2d6e' }}>
                                            {user?.firstName} {user?.lastName}
                                        </p>

                                        {/* Typing indicator ya online/offline */}
                                        {isTypingNow ? (
                                            <div className="flex items-center gap-1">
                                                <p className="text-xs" style={{ color: '#7c3aed' }}>typing</p>
                                                <div className="flex gap-0.5 items-center">
                                                    {[0, 1, 2].map(i => (
                                                        <span key={i}
                                                            className="w-1 h-1 rounded-full inline-block"
                                                            style={{
                                                                background: '#7c3aed',
                                                                animation: 'bounce 1s infinite',
                                                                animationDelay: `${i * 0.2}s`
                                                            }} />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs" style={{ color: '#9b7ec8' }}>
                                                {isOnline ? 'Online' : 'Offline'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unread badge */}
                                    {unread > 0 && (
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white"
                                            style={{
                                                background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                minWidth: unread > 9 ? '24px' : '20px'
                                            }}>
                                            {unread > 99 ? '99+' : unread}
                                        </span>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Bottom — profile + logout */}
            <div className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: '1.5px solid rgba(200,180,255,0.35)', background: 'rgba(243,232,255,0.3)' }}>
                <img
                    src={userData?.profilePicture}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    style={{ border: '2px solid #c4b5fd' }}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#3a2d6e' }}>
                        {userData?.firstName} {userData?.lastName}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#9b7ec8' }}>{userData?.email}</p>
                </div>
                <button onClick={logoutHandler}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: 'none', cursor: 'pointer' }}>
                    Sign out
                </button>
            </div>
        </div>
    )
}

export default Sidebar