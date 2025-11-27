import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/apiClient.js';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'rider', // or 'admin'/'ops' if you allow during signup
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    function onChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErr('');
        try {
            const { data } = await api.post('/auth/register', form);

            // If your backend returns token+user on register, set auth:
            if (data?.token && data?.user) {
                dispatch(setAuth({ token: data.token, user: data.user }));
                navigate('/'); // or '/admin' based on role
                return;
            }

            // If your backend only confirms creation, push to login:
            navigate('/login');
        } catch (e) {
            setErr(e?.response?.data?.error || 'register_failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-neutral-950/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-[0_10px_35px_-10px_rgba(0,0,0,0.7)] p-6">

                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Create account
                </h1>

                <p className="text-sm text-neutral-400 mt-1">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Log in
                    </Link>
                </p>

                {err && (
                    <div className="mt-4 text-sm text-red-400 bg-red-950/30 border border-red-900 p-2 rounded-lg">
                        {err}
                    </div>
                )}

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">
                            Name
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            className="
            w-full rounded-xl border border-neutral-700 
            bg-neutral-900/70 text-white 
            placeholder:text-neutral-400
            px-3 py-2 outline-none 
            focus:ring-2 focus:ring-indigo-500 
            transition
          "
                            placeholder="Your name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            className="
            w-full rounded-xl border border-neutral-700 
            bg-neutral-900/70 text-white 
            placeholder:text-neutral-400
            px-3 py-2 outline-none 
            focus:ring-2 focus:ring-indigo-500 
            transition
          "
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            className="
            w-full rounded-xl border border-neutral-700 
            bg-neutral-900/70 text-white 
            placeholder:text-neutral-400
            px-3 py-2 outline-none 
            focus:ring-2 focus:ring-indigo-500 
            transition
          "
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-300">
                            Role
                        </label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={onChange}
                            className="
            w-full rounded-xl border border-neutral-700 
            bg-neutral-900/70 text-white
            px-3 py-2 outline-none 
            focus:ring-2 focus:ring-indigo-500 
            transition mx-1 cursor-pointer
          "
                        >
                            <option className="bg-neutral-900" value="rider">Rider</option>
                            <option className="bg-neutral-900" value="ops">Ops</option>
                            <option className="bg-neutral-900" value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
          w-full rounded-xl 
          bg-indigo-600 text-white 
          py-2.5 font-medium 
          hover:bg-indigo-700 
          transition 
          disabled:opacity-60
          shadow-sm hover:shadow-md cursor-pointer
        "
                    >
                        {loading ? "Creating…" : "Create account"}
                    </button>
                </form>
            </div>
        </div>

    );
}
