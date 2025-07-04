import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/home/Home.jsx";
import Signup from "../Pages/auth/signup/Signup.jsx";
import Login from "../Pages/auth/login/Login.jsx";
import Sidebar from "./common/SideBar.jsx";
import RightPanel from "./common/RightPanel.jsx";
import Notification from "../Pages/notification/Notification.jsx";
import Profile from "../Pages/Profile/Profile.jsx";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./common/LoadingSpinner.jsx";

const Routing = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("api/auth/me");
        const data = await res.json();
        if (!res.ok || data.error)
          throw new Error(data.error || "Something went wrong");
        console.log("autheUser is here", data);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    retry: false,
  });
  if (isLoading) {
    <div className="h-screen flex justify-center itemse-center">
      <LoadingSpinner size="lg" />
    </div>;
  }
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
        {/* Common component, bc its not supported with Routes  */}
        {authUser && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <Notification /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
        {authUser && <RightPanel />}
        <Toaster />
      </div>
    </>
  );
};

export default Routing;
