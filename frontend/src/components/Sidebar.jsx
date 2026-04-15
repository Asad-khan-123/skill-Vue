import { 
  LayoutGridIcon, 
  UsersIcon, 
  CalendarCheckIcon, 
  FileTextIcon, 
  WalletIcon, 
  SettingsIcon, 
  Menu, 
  X, 
  RssIcon
} from "lucide-react";
import { useLocation, Link, Outlet } from "react-router-dom";
import { useState } from "react";
// Role-based Navigation logic
const role = localStorage.getItem("role") || "ADMIN"; 

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutGridIcon },
  { name: "Students", path: "/students", icon: UsersIcon },
  { name: "Attendance", path: "/attendance", icon: CalendarCheckIcon },
  { name: "Fees", path: "/fees", icon: WalletIcon },
  { name: "Exams", path: "/exams", icon: FileTextIcon },
  { name: "Results", path: "/results", icon: RssIcon },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [username] = useState("Abdul Samad");
  const pathname = location.pathname;


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      
      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden bg-[#1e2640] text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">UMA CLASSES</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1e2640] text-gray-300 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        
        {/* Sidebar Header/Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
             <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">U</div>
             <span className="text-white font-semibold text-lg">UMA CLASSES</span>
          </div>

          {/* User Profile Section (Like Image) */}
          <div className="bg-[#2a3454] p-3 rounded-lg mb-8 flex items-center space-x-3">
             <div className="w-10 h-10 bg-gray-500 rounded-md flex items-center justify-center text-white">
                <UsersIcon size={20} />
             </div>
             <div>
                <p className="text-white text-sm font-medium">{username}</p>
                <p className="text-xs text-gray-400 capitalize">{role.toLowerCase()}</p>
             </div>
          </div>

          {/* Navigation Links */}
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)} // Close sidebar on click (mobile)
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all ${
                  pathname === item.path
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-[#2a3454] hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default Sidebar;     