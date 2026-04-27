import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const submitFormDataHandler = async (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
        if (!passwordRegex.test(formData.password)) {
            toast.error("Password must have uppercase, lowercase, number & special character (@$!%*?&)");
            return;
        }

        const toastId = toast.loading("Creating your account...");
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/signup`,
                formData
            );
            if (!response.data.success) throw new Error("Couldn't sign up.");
            toast.dismiss(toastId);
            navigate("/login");
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);  // always runs
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6"
            style={{ background: 'linear-gradient(135deg, #f0e7ff 0%, #fce7f3 40%, #e7f3ff 100%)' }}>

            <div className="w-full max-w-md rounded-2xl p-8 shadow-xl"
                style={{ background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(200,180,255,0.5)' }}>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">💬</div>
                    <h2 className="text-2xl font-bold"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Create your account
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#9b7ec8' }}>
                        Join the fun — it only takes a minute!
                    </p>
                </div>

                {/* Tags */}
                <div className="flex gap-2 justify-center mb-6 flex-wrap">
                    {[['✦ Free forever', '#f3e8ff', '#7c3aed'], ['✦ No spam', '#fce7f3', '#db2777'], ['✦ Instant access', '#e0f2fe', '#0369a1']].map(([t, bg, c]) => (
                        <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ background: bg, color: c }}>{t}</span>
                    ))}
                </div>

                <form onSubmit={submitFormDataHandler} className="flex flex-col gap-4">
                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>First name</label>
                            <input type="text" name="firstName" placeholder="Sakina" required
                                onChange={onChangeHandler}
                                className="px-3 py-2 rounded-xl text-sm outline-none"
                                style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>Last name</label>
                            <input type="text" name="lastName" placeholder="Shaikh" required
                                onChange={onChangeHandler}
                                className="px-3 py-2 rounded-xl text-sm outline-none"
                                style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>Email address</label>
                        <input type="email" name="email" placeholder="sakki@example.com" required
                            onChange={onChangeHandler}
                            className="px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>Password</label>
                            <input type="password" name="password" placeholder="Min 8 chars" required
                                onChange={onChangeHandler}
                                className="px-3 py-2 rounded-xl text-sm outline-none"
                                style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold" style={{ color: '#6d4fa8' }}>Confirm password</label>
                            <input type="password" name="confirmPassword" placeholder="Same as above" required
                                onChange={onChangeHandler}
                                className="px-3 py-2 rounded-xl text-sm outline-none"
                                style={{ border: '2px solid #e0d7ff', background: '#faf8ff', color: '#3a2d6e' }} />
                        </div>
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
                                Creating account...
                            </>
                        ) : "Create account ✨"}
                    </button>
                </form>

                <p className="text-center text-xs mt-4" style={{ color: '#b0a0d0' }}>
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold" style={{ color: '#7c3aed' }}>Sign in</a>
                </p>
            </div>
        </div>
    )
}

export default Signup