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
import ContHost from "./components/ContHost";
// import AboutUser from "./components/Aboutuser";

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
      <Route path = "/conthost" element={<ContHost/>}/>
      </Routes>
    // <Home/>
    // <AboutUser/>
    // <detailEvent/>
  );
}

export default App;
