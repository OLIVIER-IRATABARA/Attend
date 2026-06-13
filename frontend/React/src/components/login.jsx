import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill both email and password");
      return;
    }

    fetch(`${API_URL}/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Invalid credentials");
        login(data.userId, data.role, data.name);
        navigate("/home");
      })
      .catch((err) => alert(err.message || "Wrong email or password"));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-start bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white p-16 space-y-6">
        <h2 className="text-5xl font-bold leading-tight">
          Welcome Back to Attend Rwanda
        </h2>
        <p className="text-lg max-w-md">
          Sign in to explore events, host gatherings, or confirm events across Rwanda.
        </p>
        <ul className="space-y-3 text-white/90 list-disc list-inside text-lg">
          <li>Hosts create events for the community</li>
          <li>Bookers discover and buy tickets</li>
          <li>Confirmers validate events before they go live</li>
        </ul>
      </div>

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
            Don't have an account?{" "}
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
