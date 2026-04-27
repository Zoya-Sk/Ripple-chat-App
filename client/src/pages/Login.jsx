import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../redux/slices/Auth';
import { setUserDetails } from '../redux/slices/user';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const submitFormDataHandler = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Signing you in...");
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/login`,
                formData
            );
            if (!response.data.success) throw new Error("Couldn't login.");

            // store token & user from backend response
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.userDetails));

            dispatch(setToken(response.data.token));
            dispatch(setUserDetails(response.data.userDetails));
            toast.dismiss(toastId);
            toast.success(response.data.message);
            navigate("/home");
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6"
            style={{ background: 'linear-gradient(135deg, #f0e7ff 0%, #fce7f3 40%, #e7f3ff 100%)' }}>

            <div className="w-full max-w-sm rounded-2xl p-8 shadow-xl"
                style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,180,255,0.5)' }}>

                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">👋</div>
                    <h2 className="text-2xl font-bold"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Welcome back!
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#9b7ec8' }}>Good to see you again 🎉</p>
                </div>

                <form onSubmit={submitFormDataHandler} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>Email address</label>
                        <input type="email" name="email" placeholder="riya@example.com" required
                            onChange={onChangeHandler}
                            className="px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>Password</label>
                            <a href="/forgot-password" className="text-xs font-semibold" style={{ color: '#7c3aed' }}>
                                Forgot password?
                            </a>
                        </div>
                        <input type="password" name="password" placeholder="Your password" required
                            onChange={onChangeHandler}
                            className="px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 mt-1"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Signing in...
                            </>
                        ) : "Sign in ✨"}
                    </button>
                </form>

                <p className="text-center text-xs mt-4" style={{ color: '#b0a0d0' }}>
                    Don't have an account?{' '}
                    <a href="/signup" className="font-semibold" style={{ color: '#7c3aed' }}>Sign up</a>
                </p>
            </div>
        </div>
    )
}

export default Login