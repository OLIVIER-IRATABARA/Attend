import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutUser from './AboutUser'; // Don't forget to import it!

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [showProfileCard, setShowProfileCard] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:1010/display/${userId}`, { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) navigate('/login');
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  useEffect(() => {
    axios.get('http://localhost:1010/events/explore', { withCredentials: true })
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:1010/logout', { method: 'POST', credentials: 'include' })
      .then(() => {
        localStorage.removeItem('userId');
        navigate('/');
      })
      .catch((err) => console.error(err));
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-indigo-600 text-xl font-bold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-[#8f94fb] to-[#4e54c8] text-gray-900 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex justify-end w-full p-4 relative">
        <div className="flex items-center gap-3 bg-white/20 p-2 rounded-full px-4 backdrop-blur-md">
          
          {/* PROFILE TOGGLE AREA */}
          <div 
            className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition" 
            onClick={() => setShowProfileCard(!showProfileCard)}
          >
            {profile?.profilePhoto && (
              <img 
                src={`http://localhost:1010/uploads/${profile.profilePhoto}`} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white" 
                alt="profile" 
              />
            )}
            <h3 className="font-bold text-white">{profile?.username || 'Guest'}</h3>
          </div>

          </div>

        {/* PROFILE CARD POPUP */}
        {showProfileCard && <AboutUser profile={profile} />}
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6 p-6">
        {/* Sidebar */}
        <aside className="bg-white/90 rounded-xl p-4 shadow-xl h-fit">
          <div className="font-extrabold tracking-wide mb-3 text-indigo-700">ATTEND</div>
          <nav className="flex flex-col gap-1">
            {['Home', 'Host', 'book', 'About Us', 'Help'].map((item) => (
              <div 
                key={item}
                className="p-2.5 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                onClick={() => navigate(item === 'Home' ? '/home' : `/${item.toLowerCase().replace(' ', '')}`)}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="bg-white/95 rounded-2xl p-6 shadow-xl min-h-[70vh]">
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={`http://localhost:1010/uploads/${event.photo}`} 
                    alt={event.eventname} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Live
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">{event.eventname}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {event.description || `Experience the best of ${event.eventname} in Rwanda.`}
                  </p>
                  <button 
                    className="w-full py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                    onClick={() => navigate(`/detailEvent/${event._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>

      <footer className="text-center text-gray-200 p-5">
        &copy; 2026 Attend Rwanda. All rights reserved.
      </footer>
    </div>
  );
}
