import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar"; // Sesuaikan path jika perlu
import Monitoring from "./assets/pages/Monitoring.jsx"; // Buat halaman ini jika belum ada
// import Profile from "./assets/pages/Profile"; // Dan seterusnya
// import BookingHistory from "./assets/pages/BookingHistory";
// import About from "./assets/pages/About";
// import Feedback from "./assets/pages/Feedback";
// import Login from "./assets/pages/Login";
// import SignUp from "./assets/pages/SignUp";
// import Contact from "./assets/pages/Contact";
import HomePage from "./assets/pages/homePage";
import Operator from "./assets/pages/Operator.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/operator" element={ <Operator />} />
        <Route path='*' element={<HomePage />} />
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
