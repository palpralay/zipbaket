import React from "react";
import Navbar from "./component/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./component/Footer";
import Login from "./component/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import AllProduct from "./pages/AllProduct";
import ProductCategories from "./pages/ProductCategories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import Myorders from "./pages/Myorders";
import SellerLogin from "./component/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";

const App = () => {
  const location = useLocation();
  const isSellerpath = location.pathname.includes("seller");

  const { showUserLogin, isSeller, sellerLoading } = useContext(AppContext);

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      <Toaster />

      {isSellerpath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <div
        className={`${isSellerpath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/category/:category" element={<ProductCategories />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<Myorders />} />

          {/* Seller Routes - Nested properly */}
          <Route
            path="/seller/*"
            element={
              sellerLoading ? null : isSeller ? (
                <SellerLayout />
              ) : (
                <SellerLogin />
              )
            }
          >
            {/* These are nested routes that render in <Outlet /> */}
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>

        {!isSellerpath && <Footer />}
      </div>
    </div>
  );
};

export default App;
