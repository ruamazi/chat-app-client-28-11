import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { useThemeStore } from "./store/useThemeStore";

function App() {
 const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
 const { theme } = useThemeStore();

 useEffect(() => {
  checkAuth();
 }, [checkAuth]);

 if (isCheckingAuth && !authUser)
  return (
   <div className="flex items-center justify-center h-screen">
    <Loader className="size-10 animate-spin" />
   </div>
  );

 return (
  <div data-theme={theme} className=" h-full">
   <Navbar />
   <Routes>
    <Route path="/" element={authUser ? <Home /> : <Navigate to="/signin" />} />
    <Route
     path="/signup"
     element={!authUser ? <SignUp /> : <Navigate to="/" />}
    />
    <Route
     path="/signin"
     element={!authUser ? <SignIn /> : <Navigate to="/" />}
    />
    <Route path="/settings" element={<Settings />} />
    <Route
     path="/profile"
     element={authUser ? <Profile /> : <Navigate to="/signin" />}
    />
    <Route
     path="/*"
     element={
      <h1 className=" min-h-screen flex items-center justify-center ">
       Page not found
      </h1>
     }
    />
   </Routes>
   <Toaster />
  </div>
 );
}

export default App;
