import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Ticket() {
  const [formData, setFormData] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  // Change the storage key to match what Ready expects
  const storeInLocalStorage = (data) => {
    localStorage.setItem("eventData", JSON.stringify(data));
  };

  const storeInIndexedDB = (data) => {
    const request = window.indexedDB.open("EventDB", 1);
  

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("registration")) {
        db.createObjectStore("registration", { keyPath: "id" });
      }
    };

    request.onsuccess = function () {
      const db = request.result;
      const transaction = db.transaction("registration", "readwrite");
      const store = transaction.objectStore("registration");
      // Merge new ticket data with existing
      const getRequest = store.get(1);
      getRequest.onsuccess = () => {
        const existing = getRequest.result || { id: 1 };
        store.put({ ...existing, ...data });
      };
    };
  };

  const onSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    console.log(`Ticket selected ${ticket.price}`);
    
    
    
  };

  const onQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleCancelClick = () => {
    window.location.reload(); // Refresh the page
  };

  const handleNextClick = () => {
    if (!selectedTicket) {
      toast.error("Please select a Ticket");
      return; // Prevent navigation if no ticket is selected
    }

    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return; // Prevent navigation if the quantity is invalid
    }

    // Create FormData object  i update here
    const newFormData = {
    ticket: selectedTicket,
    quantity: quantity,
  };

  // Update formData in the parent component here too
   setFormData((prevData) => ({
    ...prevData,
    ...newFormData,
  }));

    // Store in localStorage here too
    storeInLocalStorage(newFormData);

    // Store in IndexedDB here too
    storeInIndexedDB(newFormData); 

    // Proceed to the next page with ticket and quantity data
    navigate("/Details", { 
      state: { 
        ticketData: newFormData, // Pass the complete ticket data
      } 
    });
  };

  useEffect(() => {
    if (selectedTicket) {
      const formData = { ticket: selectedTicket, quantity };
      storeInIndexedDB(formData);
    }
  }, [selectedTicket, quantity]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
      <div className="bg-[#041e23] rounded-[40px] border border-[#0e464f] w-full max-w-[800px] min-h-[850px] px-6 py-4 sm:px-10">
        <div className="flex justify-between items-center w-full py-4 sm:py-6">
          <h1 className="text-white text-xl sm:text-3xl">Ticket Selection</h1>
          <h3 className="text-white text-sm sm:text-lg">Step 1/3</h3>
        </div>

        <div className="bg-[#0e464f] rounded-[5px] w-full h-[4px] sm:h-[6px] overflow-hidden relative">
          <div className="bg-[#24a0b5] rounded-[5px] w-[232px] sm:w-[300px] h-full absolute left-0 top-0"></div>
        </div>

        <div className="bg-[#08252B] rounded-[40px] border border-[#0e464f] w-full max-w-[700px] min-h-[650px] mt-10 flex flex-col items-center gap-6 p-6 sm:p-8 mx-auto">
          <div className="bg-[#041e23] rounded-[40px] border border-[#0e464f] w-full max-w-[600px] min-h-[300px] p-6 text-center bg-[radial-gradient(closest-side,rgba(36,160,181,0.2)_0%,rgba(36,160,181,0)_100%),linear-gradient(to_left,rgba(10,12,17,0.1),rgba(10,12,17,0.1))]">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl">Techember Fest ”25</h1>
            <p className="text-white text-sm sm:text-base lg:text-lg mt-2">
              Join us for an unforgettable experience at Techember Fest ”25! Secure your spot now.
            </p>
            <p className="text-white text-sm sm:text-base mt-2">
              📍 04 Rumens road, Ikoyi, Lagos | 📅 March 15, 2025 | 7:00 PM
            </p>
          </div>

          <div className="bg-[#0e464f] rounded-[5px] w-full h-[4px] sm:h-[6px] overflow-hidden relative"></div>

          <form>
          <div className="border border-cyan-900/50 rounded-2xl xl:rounded-3xl p-4 xl:p-6 bg-gradient-to-br from-cyan-900/10 to-cyan-900/5 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 lg:gap-5 w-full">
            {[
              { price: "FREE", type: "Regular Access", quantity: "20/52" },
              { price: "$150", type: "VIP Access", quantity: "20/52" },
              { price: "$200", type: "VVIP Access", quantity: "20/52" },
            ].map((ticket, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectTicket(ticket)}
                className="group relative flex flex-col items-center justify-center 
                p-3 md:p-4 lg:p-5 rounded-xl transition-all duration-300
                bg-cyan-900/20 hover:bg-cyan-400/20 border-2 border-cyan-900/30
                hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10
                focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
                min-h-[120px] xs:min-h-[140px] sm:min-h-[160px]"
              >
                {/* Price */}
                <div className="text-white group-hover:text-cyan-300 transition-colors
                  text-xl xs:text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold 
                  mb-1 md:mb-2 tracking-tighter">
                  {ticket.price}
                </div>
        
                {/* Ticket Type */}
                <div className="text-xs xs:text-sm sm:text-base md:text-sm lg:text-base 
                  font-semibold text-cyan-100 group-hover:text-white uppercase 
                  tracking-wide mb-1 md:mb-2">
                  {ticket.type}
                </div>
        
                {/* Quantity */}
                <div className="absolute bottom-2 right-2 xs:bottom-3 xs:right-3
                  text-xs xs:text-sm text-cyan-500 group-hover:text-cyan-400 
                  font-medium italic">
                  {ticket.quantity} 
                </div>
        
                {/* Hover Effect Elements */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-cyan-600/5 rounded-xl" />
                  <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-xl" />
                </div>
              </button>
            ))}
          </div>
        </div>

            <div className="w-full flex flex-col gap-4">
              <label className="text-white text-sm font-medium mt-6">Number of Tickets</label>
              <select
                className="w-full p-3 bg-[#041e23] border border-[#0e464f] rounded-md text-white"
                value={quantity}
                onChange={onQuantityChange}
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="button"
                onClick={handleCancelClick}
                className="border border-[#0e464f] text-[#24a0b5] py-3 rounded-md w-full sm:w-1/2 hover:bg-[#0e464f] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextClick}
                className="bg-[#24a0b5] text-white py-3 rounded-md w-full sm:w-1/2"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
