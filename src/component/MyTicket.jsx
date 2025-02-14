import { motion } from "framer-motion";
import { Link, useLocation} from "react-router-dom";


function MyTicket() {

    const { pathname } = useLocation();
  return (
    <main className="text-white p-4 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-500 p-8">
            {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-serif mb-2">My Tickets</h2>
                            <p className="text-slate-300">
                              
                            </p>
                        </div>
                        <Link to="/">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 bg-teal-500 text-white rounded-lg"
                            >
                                Book New Ticket
                                {pathname === "/"}
                            </motion.button>
                        </Link>
                   
                     </div>
                     {/* book ticket */}
                     <div>
                     <div className="text-center py-16 bg-[radial-gradient(ellipse_at_top_left,_#07373F_0%,_#0A0C11_140%)] border border-slate-500 rounded-3xl">
						<h3 className="text-xl mb-4">No tickets booked yet</h3>
						<Link to="/">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="px-6 py-2 bg-teal-500 text-white rounded-lg"
                               
							>
								Book Your First Ticket
                                
							</motion.button>
						</Link>
					</div>
                        
                     </div>
           
        </div>
       

        
    </main>
  )
}



export default MyTicket
