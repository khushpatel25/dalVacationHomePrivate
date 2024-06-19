import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <Toaster/>
      <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
