import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../store/auth";
import { IoCartOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import "./Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout, hasRole, authData, cartItemCounts } = useContext(AuthContext);

  return (
    <header className="sticky-header">
      <div className="container">
        <div className="logo-brand">
          <NavLink to="/">Bharat Tech</NavLink>
        </div>
        <nav>
          <ul className="nav-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/service">Service</NavLink></li>
            <li><NavLink to="/search-product"><CiSearch /></NavLink></li>

            {isLoggedIn ? (
              <>
                <li>
                  <NavLink className="cart" to="/cart-item">
                    <IoCartOutline />
                    {cartItemCounts > 0 && <span className="total-cart-items">{cartItemCounts}</span>}
                  </NavLink>
                </li>
                <li className="nav-img">
                  {authData.avatar ? (
                    <NavLink to="/user-profile">
                      <img src={authData.avatar} alt="User Avatar" />
                    </NavLink>
                  ) : (
                    <span>Profile</span>
                  )}
                  <div className="dropdown">
                    <ul>
                      <li><NavLink to="/user-profile">Profile</NavLink></li>
                      {hasRole('admin') && (
                        <>
                          <li><NavLink to="/view-all-user">Users</NavLink></li>
                          <li><NavLink to="/view-all-contact">Contacts</NavLink></li>
                          <li><NavLink to="/add-product">Add Product</NavLink></li>
                          <li><NavLink to="/product-list">Product List</NavLink></li>
                          <li><NavLink to="/all-orders">All Orders List</NavLink></li>
                        </>
                      )}
                      <li><NavLink to="/my-orders">My Orders</NavLink></li>
                      <li><Link to="/" onClick={logout}>Logout</Link></li>
                    </ul>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/register">Register</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
