import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


const saveToIndexedDB = (data) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FormDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("formData")) {
        db.createObjectStore("formData", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("formData", "readwrite");
      const store = tx.objectStore("formData");
      store.get(1).onsuccess = (e) => {
        const existing = e.target.result || { id: 1 };
        store.put({ ...existing, ...data });
        resolve();
      };
      tx.onerror = (e) => {
        reject(e.target.error);
      };
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
  
	  

function Details() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialRequest: "",
    images: "",
  });

  const { name, email, specialRequest, images } = formData;
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const request = indexedDB.open("FormDB", 1);
  
    // Create object store during setup/upgrade
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("formData")) {
        db.createObjectStore("formData", { keyPath: "id" });
      }
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
      
      // Check if store exists before proceeding
      if (!db.objectStoreNames.contains("formData")) {
        console.log("Object store not found");
        return;
      }
  
      const transaction = db.transaction("formData", "readonly");
      const store = transaction.objectStore("formData");
      const getRequest = store.get(1);
  
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          setFormData(getRequest.result.data);
        }
      };
    };
  
    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
    saveToIndexedDB(formData);
  }, [formData]);

  useEffect(() => {
    setIsFormValid(name.trim() !== "" && email.trim() !== "" && specialRequest.trim() !== "" && images !== "");
  }, [name, email, specialRequest, images]);

  const handleFileUpload = (file) => {
	if (!file) return;
  
	const reader = new FileReader();
	reader.onloadend = () => {
	  setFormData((prevState) => ({
		...prevState,
		images: reader.result, 
	  }));
	};
	reader.readAsDataURL(file);
  };

  function onChange(e) {
	if (e.target.files) {
	  handleFileUpload(e.target.files[0]);
	} else {
	  setFormData((prevState) => ({
		...prevState,
		[e.target.id]: e.target.value,
	  }));
	}
  }

 

  function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const existing = JSON.parse(localStorage.getItem("eventData")) || {};
    const mergedData = { 
      ...existing,
      ...formData
    };

     // Update formData in the parent component here too
  setFormData(mergedData);
    
    localStorage.setItem("eventData", JSON.stringify(mergedData));
    
    saveToIndexedDB(mergedData)
      .then(() => {
        toast.success("Listing created successfully!");
        navigate("/ready");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="bg-[#041e23] rounded-[40px] border border-[#0e464f] w-full max-w-screen-md min-h-[850px] px-6 py-4 sm:px-10">
        <div className="flex justify-between items-center w-full py-4 sm:py-6">
          <h1 className="text-white text-xl sm:text-3xl">Attendee Details</h1>
          <h3 className="text-white text-sm sm:text-lg">Step 2/3</h3>
        </div>

        <div className="bg-[#0e464f] rounded-[5px] w-full h-[4px] sm:h-[6px] overflow-hidden relative">
          <div className="bg-[#24a0b5] rounded-[5px] w-[65%] h-full absolute left-0 top-0"></div>
        </div>

        <form className="mt-10" onSubmit={onSubmit}>
          <div className="bg-[#08252B] rounded-[40px] border border-[#0e464f] w-full max-w-[700px] min-h-[650px] mx-auto flex flex-col items-center space-y-6 p-6 sm:p-8">
            <div className="w-full max-w-[600px] min-h-[300px] p-6 text-center bg-gradient-to-l from-[#02252b] to-[#02252b]">
              <h2 className="text-white text-left mb-6">Upload Profile Photo</h2>
              <div className="flex items-center justify-center min-h-[200px] bg-[#041e23] px-4">
                <label className="w-full max-w-[250px] h-[250px] flex flex-col items-center justify-center border-4 rounded-[24px] border-[#24a0b5] bg-[#023942] cursor-pointer mb-4 p-5">
                  <input
                    type="file"
                    className="hidden"
                    id="images"
                    onChange={onChange}
                  />
				  
                  <span className="text-white text-sm sm:text-base text-center">
                    Drag & drop or click to upload
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div>
                <label className="block text-white">Enter your name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={onChange}
                  className="w-full bg-transparent border border-[#0e464f] rounded-md p-3 text-white outline-none focus:border-[#24a0b5]"
                />
              </div>

              <div>
                <label className="block text-white">Enter your email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#24a0b5]" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={onChange}
                    className="w-full bg-transparent border border-[#0e464f] rounded-md p-3 pl-10 text-white outline-none focus:border-[#24a0b5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white">Special request?</label>
                <textarea
                  id="specialRequest"
                  value={specialRequest}
                  onChange={onChange}
                  placeholder="Enter details here..."
                  className="w-full bg-transparent border border-[#0e464f] rounded-md p-3 text-white outline-none focus:border-[#24a0b5] min-h-[100px]"
                />
              </div>
            </div>

            <div className="w-full flex gap-4 mt-6">
              <Link to="/ticket" className="w-1/2">
                <button className="border border-[#0e464f] text-[#24a0b5] py-3 rounded-md w-full hover:bg-[#0e464f] hover:text-white">
                  Back
                </button>
              </Link>
                {/* In Details.js - Fix the button children */}
                <button 
                type="submit"
                disabled={!isFormValid || loading}
                className={`py-3 rounded-md w-full ${
                  isFormValid && !loading 
                    ? "bg-[#24a0b5] text-white" 
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing..." && navigate("/ready") : "Get My Free Ticket"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Details;
