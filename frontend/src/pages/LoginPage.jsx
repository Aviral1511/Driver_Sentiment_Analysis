// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setAuth } from '../redux/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((s) => s.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(loginUser({ email, password }));
        if (res.meta.requestStatus === 'fulfilled') {
            navigate('/'); // or /admin
        }
    };

    // optional demo login (kept for convenience)
    const demoLogin = () => {
        dispatch(setAuth({ token: 'demo-token', user: { email: 'demo@x.com', role: 'admin' } }));
        navigate('/admin');
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-neutral-800/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-neutral-800">

                <h2 className="text-2xl font-semibold mb-1 text-white">
                    Welcome back
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    Sign in to manage Driver Sentiment.
                </p>

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">
                            Email
                        </label>
                        <input
                            className=" w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2 outline-none text-gray-100 placeholder:text-gray-500focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-200">
                            Password
                        </label>
                        <input
                            className="w-full rounded-xl border border-neutral-700 bg-neutral-800/70 px-3 py-2 outline-none text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error */}
                    {status === "failed" && (
                        <div className="text-sm text-red-400 bg-red-900/30 border border-red-600/40 rounded-xl px-3 py-2">
                            {error || "Login failed"}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full inline-flex items-center justify-center rounded-xl  bg-indigo-600 text-white h-11 font-medium hover:bg-indigo-700 transition disabled:opacity-60 shadow-md hover:shadow-lg hover:cursor-pointer"
                    >
                        {status === "loading" ? <Loader label="Signing in..." /> : "Sign In"}
                    </button>
                </form>

            </div>
        </div>

    );
}
