import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill both email and password");
      return;
    }

    fetch("http://localhost:1010/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("userId", data.userId); // store for profile fetch
        navigate("/home");
      })
      .catch(() => alert("Wrong email or password"));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT Sliding Images */}
      <div className="hidden lg:flex flex-col justify-center items-start bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white p-16 space-y-6">
        <h2 className="text-5xl font-bold leading-tight">
          Welcome Back to Attend Rwanda
        </h2>
        <p className="text-lg max-w-md">
          Sign in to explore exciting online events and community experiences. 
          Connect, attend, and never miss out on your favorite concerts, workshops, tech meetups, and festivals.
        </p>

        <ul className="space-y-3 text-white/90 list-disc list-inside text-lg">
          <li>Access events instantly</li>
          <li>Manage tickets and bookings</li>
          <li>Join workshops and meetups online</li>
          <li>Stay updated with trending experiences</li>
        </ul>

        <div className="mt-6  px-4 py-2 rounded-lg font-medium">
         Fast, easy, and secure — your event journey starts here!
        </div>
      </div>
      {/* RIGHT Login Form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
