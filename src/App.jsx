import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import RoomDetails from "./pages/RoomDetails";

function App() {

  return (
    <>
      <Toaster />
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/rooms/:roomId" element={<RoomDetails/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
