import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

export default function Host() {
  const [eventname, setEventname] = useState("");
  const [eventdescription, setEventdescription] = useState("");
  const [event_date, setEventDate] = useState("");
  const [event_time, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventname", eventname);
    formData.append("eventdescription", eventdescription);
    formData.append("event_date", event_date);
    formData.append("event_time", event_time);
    formData.append("location", location);
    formData.append("photo", photo);

    fetch(`${API_URL}/events/create`, {
      method: "POST",
      body: formData,
      credentials: "include"
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Failed to create event");
        alert(data.message);
        setEventname("");
        setEventdescription("");
        setEventDate("");
        setEventTime("");
        setLocation("");
        setPhoto(null);
        navigate("/conthost", { state: { eventId: data.eventId } });
      })
      .catch((err) => alert(err.message || "Could not create event"));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <button onClick={() => navigate(-1)} className="mb-6 self-start text-indigo-600 font-bold">← Back</button>
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Host an Event</h2>
        <p className="text-gray-500 mb-6 text-sm">Events in Rwanda are reviewed by a confirmer before bookers can see them.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={eventname}
            onChange={(e) => setEventname(e.target.value)}
            placeholder="Event name"
            required
            className="w-full border p-2 rounded"
          />

          <textarea
            value={eventdescription}
            onChange={(e) => setEventdescription(e.target.value)}
            placeholder="Event description"
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            value={event_date}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="time"
            value={event_time}
            onChange={(e) => setEventTime(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Kigali Convention Centre)"
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
            className="w-full"
          />

          <button className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700">
            Submit for Review
          </button>
        </form>
      </div>
    </div>
  );
}
