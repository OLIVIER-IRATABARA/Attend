import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
<<<<<<< HEAD
import BookingTicket from "./components/BookingTicket";
=======
import ContHost from "./components/ContHost";
// import AboutUser from "./components/Aboutuser";
>>>>>>> ae098521196ad48a66a1e61cf3342265edf2a5be

function App() {
  return (
    
      <Routes>
        <Route path="/signup" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/host" element={<Host/>}/>
        {/* <Route path="/about" element={<AboutUs/>}/> */}
        <Route path="/help" element={<Help/>}/>
        <Route path="/book" element={<Book/>}/>
      <Route path="/sign2" element={<SignUp2/>}/>
      <Route path="/" element={<Public/>}/>
      <Route path="/detailEvent/:id" element={<EventDetail/>}/>
<<<<<<< HEAD
      <Route path="/BookingTicket" element={<BookingTicket/>}/>
=======
      <Route path = "/conthost" element={<ContHost/>}/>
>>>>>>> ae098521196ad48a66a1e61cf3342265edf2a5be
      </Routes>
    // <Home/>
    // <AboutUser/>
    // <detailEvent/>
    //<BookingTicket/>
  );
}

export default App;
