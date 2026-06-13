import { Routes, Route } from "react-router-dom";
import Signin from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import Host from "./components/Host";
import AboutUs from "./components/AboutUs";
import Help from "./components/Help";
import Book from "./components/Book";
import SignUp2 from "./components/SignUp2";
import Public from "./components/Public";
import EventDetail from "./components/detailEvent";
import BookingTicket from "./components/BookingTicket";
import ContHost from "./components/ContHost";
import Confirmer from "./components/Confirmer";
import MyBookings from "./components/MyBookings";
import MyEvents from "./components/MyEvents";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Public />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign2" element={<SignUp2 />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/help" element={<Help />} />
      <Route path="/book" element={<Book />} />
      <Route path="/detailEvent/:id" element={<EventDetail />} />

      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/host" element={<ProtectedRoute roles={["host"]}><Host /></ProtectedRoute>} />
      <Route path="/conthost" element={<ProtectedRoute roles={["host"]}><ContHost /></ProtectedRoute>} />
      <Route path="/my-events" element={<ProtectedRoute roles={["host"]}><MyEvents /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute roles={["booker"]}><MyBookings /></ProtectedRoute>} />
      <Route path="/confirm" element={<ProtectedRoute roles={["confirmer"]}><Confirmer /></ProtectedRoute>} />
      <Route path="/BookingTicket/:id" element={<ProtectedRoute roles={["booker"]}><BookingTicket /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
