import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const ROLES = [
  { value: "booker", label: "Book events — browse and buy tickets" },
  { value: "host", label: "Host events — create and manage events" },
  { value: "confirmer", label: "Confirm events — review and approve events" }
];

export default function Signin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("booker");
  const [isSubmitting, setisSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      alert("You must fill all required fields");
      return;
    }

    setisSubmitting(true); // Moved inside validation check

    const data = { name, email, phone, password, role };

    fetch(`${API_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body.message || "Signup failed");
        localStorage.setItem("userId", body.userId);
        localStorage.setItem("role", body.role);
        setisSubmitting(false);
        navigate("/sign2");
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong. Please try again.");
        setisSubmitting(false);
      });
  };

  // DESIGNED LOADING SCREEN WITH SPINNER ICON
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center text-white p-4">
        <div className="flex flex-col items-center space-y-4 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-white/20">
          
          {/* Animated SVG Spinner Icon */}
          <svg 
            className="animate-spin h-12 w-12 text-white" 
            xmlns="http://w3.org" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>

          <div>
            <h3 className="text-xl font-bold tracking-wide">Creating Account</h3>
            <p className="text-indigo-200 text-sm mt-1">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT: Gradient & Motivational Content */}
      <div className="hidden lg:flex flex-col justify-center items-start bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white p-16 space-y-6 w-full">
        <h2 className="text-5xl font-bold leading-tight">
          Join Attend Rwanda
        </h2>
        <p className="text-lg max-w-md">
          Discover and participate in amazing online events—from concerts and workshops to tech meetups and festivals. 
          Connect with others, book instantly, and make every experience unforgettable. Sign up now and start your journey!
        </p>

        <ul className="space-y-3 text-white/90 list-disc list-inside text-lg">
          <li>Explore events anytime, anywhere</li>
          <li>Seamless booking and ticket management</li>
          <li>Host or join community gatherings easily</li>
          <li>Stay updated with trending online experiences</li>
        </ul>

        <div className="mt-6 bg-white/20 px-4 py-2 rounded-lg font-medium">
          💡 Fast, easy, and fun—your event journey starts here!
        </div>
      </div>

      {/* RIGHT Sign Up Form */}
      <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">What will you do on Attend?</label>
                <div className="space-y-2">
                  {ROLES.map((r) => (
                    <label key={r.value} className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer ${role === r.value ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={role === r.value}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              SignUp
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
