import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp2() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  // const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  if (!userId) navigate("/signup"); // redirect if no userId

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("bio", bio);
    // formData.append("phone", phone);
    formData.append("location", location);

    fetch("http://localhost:1010/profile/create", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile created successfully!");
        setUsername("");
        setBio("");
        setPhone("");
        setLocation("");
        setProfilePhoto(null);
        navigate("/home");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Photo */}
          <div className="space-y-2">
            <label className="block text-gray-600 font-medium">Profile Photo</label>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="profilePhoto"
              className="inline-block cursor-pointer bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Choose Profile Picture
            </label>
            {profilePhoto && <p className="text-sm text-gray-500 mt-2">Selected: {profilePhoto.name}</p>}
          </div>

          <input
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />
          <textarea
            placeholder="Short Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows="3"
            className="w-full border p-3 rounded-lg"
          />
          {/* <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          /> */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
