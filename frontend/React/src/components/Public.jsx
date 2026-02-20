import { useNavigate } from "react-router-dom";

export default function Public() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-500 to-purple-600 text-white pt-16 px-4">

      {/* Header */}
      <h1 className="text-5xl font-bold mb-4 text-center">
        Welcome to Attend Rwanda
      </h1>
      <p className="text-center max-w-2xl mb-8 text-lg">
        Your gateway to discovering and joining exciting events across Rwanda and beyond. 
        Explore concerts, workshops, tech meetups, festivals, and much more — all online and at your fingertips. 
        Join our growing community and never miss an event again!
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex gap-6 mb-12">
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Login
        </button>
      </div>

      {/* Online Events Preview */}
      <h2 className="text-3xl font-bold mb-6">Upcoming Online Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
          <img src="/events2.jpg" alt="Live Concert" className="w-full h-48 object-cover" />
          <div className="p-4 font-semibold text-center">Live Concert</div>
        </div>
        <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
          <img src="/event1.jpg" alt="Tech Meetup" className="w-full h-48 object-cover" />
          <div className="p-4 font-semibold text-center">Tech Meetup</div>
        </div>
        <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
          <img src="/concert3.jpg" alt="Workshop" className="w-full h-48 object-cover" />
          <div className="p-4 font-semibold text-center">Workshop</div>
        </div>
        <div className=" text-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
          <img src="/concert2.jpg" alt="Festival" className="w-full h-48 object-cover" />
          <div className="p-4 font-semibold text-center">Festival</div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-gray-200 mt-12 max-w-2xl">
        Attend Rwanda brings all your favorite events in one place. Whether you want to host or explore, 
        our platform makes it seamless and fun. Sign up today and start your event journey!
      </p>
    </div>
  );
}
