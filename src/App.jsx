import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Ticket from "./component/Ticket";
import Details from "./component/Details";
import Ready from "./component/Ready";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./component/Header";
import MyTicket from "./component/MyTicket";
import { FormDataProvider } from "./state/FormDataContext.jsx";

function App() {
  return (
    
    <FormDataProvider>
      <div className="min-h-screen p-6 sm:p-10 overflow-hidden bg-[radial-gradient(closest-side,rgba(36,160,181,0.2)_0%,rgba(36,160,181,0)_100%),linear-gradient(to_left,#02191d,#02191d)]">
        <Router basename="/Event-App">
          <Header />
          <Routes>
            <Route path="/" element={<Ticket />} />
            <Route path="/details" element={<Details />} />
            <Route path="ready" element={<Ready />} />
            <Route path="/my-ticket" element={<MyTicket />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </div>
      </FormDataProvider>
  );
}

export default App;