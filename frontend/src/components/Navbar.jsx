import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token, user } = useSelector((s) => s.auth || {});

    const logout = () => { dispatch(clearAuth()); navigate('/'); }

    // ✅ Base link styling
    const baseLink =
        "px-3 py-2 rounded-md text-[15px] font-medium transition-colors";

    // ✅ Idle (not active)
    const idle =
        "text-gray-700 hover:text-blue-600 hover:bg-neutral-100 " +
        "dark:text-gray-700 dark:hover:text-blue-600 dark:hover:bg-gray-300";

    // ✅ Active link (blue highlight)
    const active =
        "text-blue-600 font-semibold bg-blue-50 " +
        "dark:text-blue-600 dark:bg-blue-900/20";

    const navClass = ({ isActive }) => `${baseLink} ${isActive ? active : idle}`;

    const isAdmin = Boolean(token) && user?.role === "admin";

    return (
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm dark:bg-neutral-0 dark:border-neutral-0">
            <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">

                {/* LEFT NAV */}
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-3 text-base font-semibold">
                        <NavLink to="/" end className={navClass}>
                            Home
                        </NavLink>

                        <NavLink to="/feedback" className={navClass}>
                            Feedback
                        </NavLink>

                        {isAdmin && (
                            <NavLink to="/admin" className={navClass}>
                                Admin
                            </NavLink>
                        )}
                        {/* {isAdmin && (
                            <NavLink
                                to="/admin/worker"
                                className={navClass}
                            >
                                Worker
                            </NavLink>
                        )} */}

                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 text-base font-semibold">

                    {!token ? (
                        <>
                            {/* LOGIN */}
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-neutral-100 dark:text-neutral-700 dark:hover:bg-neutral-200 dark:hover:text-blue-600 transition"
                            >
                                Log in
                            </Link>

                            {/* SIGNUP */}
                            <Link
                                to="/register"
                                className="px-4 py-2 rounded-lg bg-blue-500 text-gray-100 hover:text-white hover:bg-blue-700 transition shadow-sm hover:shadow"
                            >
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* USER AVATAR */}
                            <div className="relative h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shadow-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6 text-neutral-600 dark:text-neutral-200"
                                    fill="currentColor"
                                >
                                    <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z" />
                                </svg>
                                <span className="absolute right-0 bottom-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-900" />
                            </div>

                            {/* LOGOUT */}
                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-lg text-gray-700 hover:bg-neutral-100 dark:text-gray-700 dark:hover:bg-neutral-200 hover:cursor-pointer hover:text-blue-600 transition"
                                title={`Logout ${user?.email ?? ""}`}
                            >
                                Logout
                            </button>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
}
