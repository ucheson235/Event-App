import React  from "react";
import { Link, useLocation } from "react-router-dom";
import thumb from "../assets/svg/thumb.png";
import ticz from "../assets/svg/ticz.png";

function Header({ formData = { name: "", email: "", ticket: { type: "" } } }) {
  console.log("Form Data in Header:", formData);
  const{ pathname } = useLocation();
  const getLinkPath = () => {
    if (formData?.name && formData?.email && formData?.ticket?.type) {
      return "/ready"; // Go to "ready" if form is filled
    }
    return "/my-ticket"; // Otherwise, go to "my-ticket"
  };

  const isMyTicketsActive = pathname === "/my-ticket" || pathname === "/ready";
  
  return (
    <nav className="md:w-[80rem] sticky w-full mx-auto flex justify-between items-center border mt-4 p-6 rounded-2xl border-slate-500 bg-transparent shadow-md">
      <Link to="/" className="flex  px-6 gap-4"> 
        <img src={thumb} alt="logo" width={30} height={20} />
        <img src={ticz} alt="logo" width={50} height={20} />
      </Link>
      <div className="hidden md:block space-x-7 text-gray-300">
      <Link
        to="/"
        className={`hover:text-white ${pathname === "/" ? "text-white font-bold" : ""}`}
      >
        Events
      </Link>

      <Link
      to={getLinkPath()}
      className={`hover:text-white ${isMyTicketsActive ? "text-white font-bold" : ""}`}
     >
      My Tickets
      </Link>

      <Link
        to="/"
        className={`hover:text-white ${pathname === "/about-us" ? "text-white font-bold" : ""}`}
      >
        About Project
      </Link>
    </div>
    <a
				href="/ready"
				className="group px-4 py-2 rounded-xl bg-white text-black flex items-center relative overflow-hidden"
			>
				MY TICKETS
				<span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
					→
				</span>
			</a>
    </nav>
    
  );
}

export default Header;