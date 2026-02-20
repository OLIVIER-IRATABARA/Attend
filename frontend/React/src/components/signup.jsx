import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      alert("You must fill all required fields");
      return;
    }

    const data = { name, email, phone, password };

    fetch("http://localhost:1010/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("userId", data.userId); // store userId for profile
        alert("Account created! Complete your profile now.");
        navigate("/sign2"); // go to profile completion
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT Sliding Images */}
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign Up
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
