import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { setIsSeller, axios, navigate } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        setIsSeller(false);
        navigate("/");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  return (
    <div className="min-h-screen no-scrollbar bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <Link to="/">
            <img
              src={assets.zlogo}
              alt="Logo"
              className="cursor-pointer h-10 md:h-12 w-auto"
            />
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-5 text-gray-600">
          <p className="text-sm md:text-base">Hi! Admin</p>
          <button
            onClick={logout}
            className="border border-gray-300 rounded-full text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex relative h-[calc(100vh-65px)]">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
                        fixed md:relative left-0 
                        h-screen md:h-full
                        w-64 
                        border-r border-gray-300 
                        pt-4 bg-white
                        flex flex-col 
                        transition-transform duration-300 z-50 md:z-10
                        overflow-hidden
                        ${
                          isSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                        }
                    `}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col mt-8 md:mt-0">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/seller"}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? `flex items-center py-3.5 px-4 gap-3 border-r-4 bg-primary/10 border-primary text-primary font-medium`
                    : `flex items-center py-3.5 px-4 gap-3 hover:bg-gray-100 text-gray-700 transition`
                }
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6" />
                <p className="text-sm md:text-base">{item.name}</p>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="bg-primary/5 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Seller Dashboard</p>
              <p className="text-sm font-medium text-primary mt-1">
                @MadebyPralay
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
