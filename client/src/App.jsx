import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from 'react-loader-spinner';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";
import Error from "./pages/Error";
import UserProfile from "./pages/UserProfile";
import UpdateProfile from "./pages/UpdateProfile";
import UsersList from "./pages/UsersList";
import ContactList from "./pages/ContactList";
import { AuthContext } from "./store/auth";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import UpdateProduct from "./pages/UpdateProduct";
import CartItem from "./pages/CartItem";
import SearchProduct from "./pages/SearchProduct";
import Checkout from "./pages/Checkout/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import MyOrders from "./pages/MyOrders";
import AllOrdersList from "./pages/AllOrdersList";
import PrivateRoute from "./components/PrivateRoute";



const App = () => {

  const { isLoggedIn, hasRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <RotatingLines
          visible={loading}
          height="45"
          width="45"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search-product" element={<SearchProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/service" element={<Service />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sucess/:id" element={<PaymentSuccess />} />
          <Route path="/cancel/:id" element={<PaymentCancel />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/cart-item" element={<CartItem />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute roles={['admin']} />}>
            <Route path="/view-all-user" element={<UsersList />} />
            <Route path="/view-all-contact" element={<ContactList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/all-orders" element={<AllOrdersList />} />
          </Route>

          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
