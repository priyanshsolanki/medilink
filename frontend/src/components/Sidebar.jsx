import React, { useState} from "react";
import { NavLink } from "react-router-dom";
import {
  LogOut,
  Home,
  User2,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ name }) => {
  const { logout, authUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [userFirstName, setUserFirstName] = useState(authUser?.payload.name);

  return (
    <>
       {/* Mobile Top Bar */}
       <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="flex items-center justify-between p-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Medilink Title */}
          <h1 className="text-xl font-bold text-gray-800">Medilink</h1>

          {/* Placeholder for alignment */}
          <div className="w-8"></div>
        </div>
      </div>


      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg min-h-screen p-6 flex flex-col justify-between fixed lg:static transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <div>
          {authUser && userFirstName && (
            <div className="flex items-center space-x-3 p-3 rounded-lg mb-6">
              {/* <User size={24} className="text-blue-600" /> */}
              <img
                  src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?w=1480"
                  alt="User"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              <span className="text-gray-700 font-semibold">{userFirstName}</span>
            </div>
          )}
          <nav className="space-y-4">
            {[
              { name: "Home", icon: <Home size={20} />, path: "/dashboard" },
              { name: "Profile", icon: <User2 size={20} />, path: "/profile" }
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile when a link is clicked
                className={({ isActive }) =>
                  `flex items-center space-x-3 text-gray-700 p-3 rounded-lg w-full text-left transition ${
                    isActive ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div>
          <NavLink
            to="/logout"
            onClick={() => logout()}
            className="flex items-center space-x-3 text-red-600 hover:bg-red-50 p-3 rounded-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </>
  );
};

export default Sidebar;