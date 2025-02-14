import { Link, useNavigate } from "react-router-dom";
import React, { useRef} from "react";
import { downloadTicket } from "../utils/downloadTicket";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import Subtract from "../assets/svg/Subtract.png";






function Ready() {
  const printRef = useRef();
  const ticketRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  
 

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get from localStorage
        const saved = localStorage.getItem("eventData");
        if (saved) setFormData(JSON.parse(saved));

        // Get from IndexedDB
        const db = await new Promise((resolve, reject) => {
          const request = indexedDB.open("myDatabase", 1);
          request.onsuccess = () => resolve(request.result);
          request.onerror = reject;
        });

        const tx = db.transaction("registration", "readonly");
        const store = tx.objectStore("registration");
        const data = await new Promise((resolve, reject) => {
          const request = store.get(1);
          request.onsuccess = () => resolve(request.result);
          request.onerror = reject;
        });

        if (data) {
          setFormData(prev => ({
            ...data,
            ticket: data.ticket || { type: "Unknown" },
          }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  



  const handlePrint = useReactToPrint({
    content: () => ticketRef.current, 
    documentTitle: formData?.name 
      ? `Techember_Fest_Ticket_${formData.name.replace(/\s+/g, "_")}` 
      : "Techember_Fest_Ticket",
    pageStyle: `
      @page { 
        size: A4 portrait;
        margin: 10mm;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          background: #041e23 !important;
          color: white !important;
        }
        .print-only { display: block !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  const handleDownload = async () => {
    if (!ticketRef.current) {
      toast.error("Ticket content not loaded!");
      return;
    }

    try {
      await toast.promise(
        downloadTicket(ticketRef.current, formData?.name || "techember-ticket"),
        {
          pending: "Generating ticket...",
          success: "Ticket downloaded successfully!",
          error: "Failed to download ticket"
        }
      );
    } catch (error) {
      console.error("Download error:", error);
    }
  };


  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-red-500">Error loading ticket data</p>
      </div>
    );
  }



  return (
    <div  className=" flex items-center justify-center min-h-screen p-6">
      <div className="bg-[#041e23] rounded-[40px] border border-[#0e464f] w-full max-w-screen-lg min-h-[600px] px-6 py-4 sm:px-10">
        {/* Header */}
        <div className="flex justify-between items-center w-full py-4 sm:py-6">
          <h1 className="text-white text-xl sm:text-3xl">Ready</h1>
          <h3 className="text-white text-sm sm:text-lg">Step 3/3</h3>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#0e464f] rounded-[5px] w-full h-[4px] sm:h-[6px] overflow-hidden relative">
          <div className="bg-[#24a0b5] rounded-[5px] w-[100%] h-full absolute left-0 top-0"></div>
        </div>

        {/* Content */}
        <div className="text-center text-white mt-10">
          <h2 className="text-2xl font-semibold">Your Ticket is Booked!</h2>
          <p className="mt-3 text-lg">
            Check your email for a copy or you can download
          </p>
        </div>

        {/* Hidden Ticket Preview for PDF Export */}
        
        <div
        ref={ticketRef} 
         className=" flex flex-col justify-center items-center min-h-[800px] w-[400px] mx-auto m-6 "
         style={{
          backgroundImage: ` url(${Subtract}) `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          
        }} 
        >
           
                      
        <div 
         className=" ">
         {/* Background Image */}
         
         <div
        
         
           className= "ticket-container text-white bg-transparent rounded-[40px] border-2 border-[#0e464f] w-full max-w-[350px] min-h-[200px] m-3 text-center bg-[radial-gradient(closest-side,rgba(36,160,181,0.2)_0%,rgba(36,160,181,0)_100%),linear-gradient(to_left,rgba(10,12,17,0.1),rgba(10,12,17,0.1))]"
           
         >
         
           <h1 className="mt-2 text-2xl sm:text-sm font-bold text-center">Techember Fest ’25</h1>
           <p className="text-center sm:text-sm">📍 04 Rumens Road, Ikoyi, Lagos</p>
           <p className="text-center">📅 March 15, 2025 | 🕖 7:00 PM</p>

           <div className="flex items-center justify-center mt-6 w-[200px] h-[200px] mx-auto border-4 border-[#24a0b5] rounded-[40]">
           {formData.images && (
             <img
               src={formData.images}
               alt="Uploaded Avatar"
               className="w-32 h-32 rounded-xl border-4 border-cyan-400/50 object-cover"
             />
           )}
           </div>

           <div className="m-4 text-left">
             <div className="bg-[#0e464f] p-2 rounded-xl shadow-lg w-full sm:w-80">
               <div className="flex justify-between items-center">
                 <div className="mb-3">
                   
                     <h2  className="text-xs text-gray-300">Enter your name:</h2>
                  
                   <p className="text-xs font-semibold p-2 rounded-md w-[140px] bg-[#0e464f] truncate">{formData.name}</p>
                 </div>

                 <hr className="h-20 border-2 border-[#245e68]" />

                 <div className="mb-3">
                   
                      <h2  className="text-xs text-gray-300 p-1">Enter your email:</h2>
                   
                   <p className="text-xs font-semibold p-2 rounded-md w-[120px]  bg-[#0e464f] truncate">{formData.email}</p>
                 </div>
               </div>

               <hr className="border-[#245e68]" />

               <div className="flex justify-between items-center">
                 <div className="mb-3">
                   
                    <h2 className="text-xs text-gray-300"> Ticket Type:</h2>
                   
                   <p className="text-xs font-semibold p-2 rounded-md w-full bg-[#0e464f]">{formData.ticket?.type || ""}</p>
                 </div>
                 <hr className="h-20 border-2 border-[#245e68]" />
                 <div className="mb-3">
                 
                    <h2  className="text-xs text-gray-300 p-3"> Ticket for:</h2>
                   
                   <p  className="text-xs font-semibold p-2 rounded-md w-full bg-[#0e464f]">{formData.quantity}</p>
                 </div>
               </div>
               <hr className="border-[#245e68]" />
               <div className="mt-4">
                 <h2 className="text-xs text-gray-300"> Special request?</h2>
                
            
                 <p className="text-sm text-gray-400 p-2 rounded-md w-full bg-[#0e464f]">{formData.specialRequest || "None"}</p>
                 
               </div>
             </div>
           </div>
         </div>
       </div>
     
           {/* QR Code */}
           <div className="flex justify-center pt-4">
           <QRCode 
           value={JSON.stringify({

             name: formData.name,
             type: formData.ticket?.type,
             email: formData.email,
             
           })}
             className="w-32 h-32 p-2 mt-7 bg-white rounded-lg"
           />
         </div>

   
      </div>

              

        {/* Buttons */}
        <div className="w-full flex flex-col sm:flex-row justify-between mt-6 gap-4">
          <Link to="/ticket" className="w-full sm:w-1/2">
            <button className="border border-[#0e464f] text-[#24a0b5] py-3 rounded-md w-full hover:bg-[#0e464f] hover:text-white">
              Book Another Ticket
            </button>
          </Link>

          <button
           
          onClick={() => {
            handleDownload()
            
            
          }}
            className=" download-button bg-[#24a0b5] text-white py-3 rounded-md w-full sm:w-1/2 mt-4 sm:mt-0"
          >
            Download Ticket
            
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ready;