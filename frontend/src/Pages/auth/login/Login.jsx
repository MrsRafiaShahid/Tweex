import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../Component/svg/logo.jsx";
import { MdOutlineMail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch('/api/auth/login', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Invalid response: ${text.substring(0, 100)}`);
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success("Login successfully");
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row h-screen px-4 sm:px-10">
    {/* Logo container with pure CSS responsiveness */}
      <div className="flex justify-center lg:justify-start lg:items-center py-6 lg:py-0 lg:flex-1">
        <div className="relative w-32 h-32 lg:w-2/3 lg:max-w-md">
          <XSvg className="w-full h-full" />
          <div className="absolute top-25 lg:top-35 left-0 right-0 mt-2 lg:mt-0 lg:transform lg:-translate-y-1/2 text-center">
            <span className="text-14 font-serif font-bold text-violet-500">TWEEX</span>
            <span className="text-[10px] font-mono text-blue-300 block">Say it. Like it. Tweex it</span>
          </div>
        </div>
      </div>
      
      {/* Form container */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form 
          className="w-full max-w-md mx-auto flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-extrabold text-white text-center">{"Let's"} go.</h1>
          
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              required
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdLock />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>
          
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? "Loading..." : "Login"}
          </button>
          
          {isError && error && (
            <p className="text-red-500 text-center">{error.message}</p>
          )}
        </form>
        
        <div className="w-full max-w-md mt-4">
          <p className="text-white text-lg text-center">{"Don't"} have an account?</p>
          <Link to="/signup" className="block mt-2">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;