import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ticket from "./component/Ticket";
import Details from "./component/Details";
import Ready from "./component/Ready";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./component/header";
import MyTicket from "./component/MyTicket";
import React, { useState } from "react"; 


function App() {
  // Define formData state to store user input
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ticket: {
      type: "",
    },
    quantity: 1,
    specialRequest: "",
    images: "",
  });
  
  return (
    <div className="min-h-screen p-6 sm:p-10 overflow-hidden bg-[radial-gradient(closest-side,rgba(36,160,181,0.2)_0%,rgba(36,160,181,0)_100%),linear-gradient(to_left,#02191d,#02191d)]">
      <Router>
      <Header formData={formData} />
      <Routes>
      <Route path="" element={<Ticket setFormData={setFormData} />} />
      <Route path="/details" element={<Details formData={formData} setFormData={setFormData} />} />
      <Route path="/ready" element={<Ready formData={formData} />}/>
      <Route path="/my-ticket" element={<MyTicket />} />
    </Routes>
      </Router>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    </div>
  );
}

export default App;
