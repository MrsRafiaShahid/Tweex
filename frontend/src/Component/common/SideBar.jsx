import XSvg from "../svg/logo.jsx";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuthUser from "../../hooks/useAuthUser.js";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
      } catch (error) {
        throw new Error(error.message || "An error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logout successfully");
      // window.location.href = "/login";
    },
    onError: () => {
      toast.error("Failed to Logout");
    },
  });
  const {data: authUser}=useAuthUser()
 const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    }
    return 'light';
  });

  // Apply theme to document and store in localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        {/* Dark/Light Mode Toggle - Top of sidebar */}
        <div className="flex md:flex-row flex-col justify-between items-center p-2 md:p-4">

        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-20 h-20 rounded-full fill-current text-gray-900 text-base-content hover:bg-base-200 fill-current" />
        </Link>
        {/* Toggle Button - Visible on all screens */}
             {/* Theme toggle button */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-circle btn-ghost"
            aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === 'light' ? (
              <FaMoon className="w-5 h-5 text-base-content" />
            ) : (
              <FaSun className="w-5 h-5 text-base-content" />
            )}
          </button>
        </div>
        <ul className="flex flex-col gap-3 mt-4">
         <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-base-200 transition-all duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer rounded-full"
            >
              <MdHomeFilled className="w-8 h-8 text-base-content" />
              <span className="text-lg hidden md:block text-base-content">Home</span>
            </Link>
          </li>
         <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-base-200 transition-all duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer rounded-full"
            >
              <IoNotifications className="w-6 h-6 text-base-content" />
              <span className="text-lg hidden md:block text-base-content">Notifications</span>
            </Link>
          </li>

           <li className="flex justify-center md:justify-start">
            <Link
              to={
                authUser && authUser?.username
                  ? `/profile/${authUser?.username}`
                  : "#"
              }
              className="flex gap-3 items-center hover:bg-base-200 transition-all duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer rounded-full"
            >
              <FaUser className="w-6 h-6 text-base-content" />
              <span className="text-lg hidden md:block text-base-content">Profile</span>
            </Link>
          </li>
        </ul>
        {authUser && authUser.username && (
          <Link
            to={`/profile/${authUser?.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-base-200 py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profilePicture || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="font-bold text-sm w-20 truncate text-base-content">
                  {authUser?.fullName}
                </p>
                <p className="text-sm text-base-content opacity-70">
                  @{authUser?.username}
                </p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer text-base-content hover:text-error"
                onClick={(e) => {
                  e.preventDefault();
                  logout();  
                }}
                />
      </div>
      </Link>
        )}
        </div>
    </div>
  );
};
export default Sidebar;
