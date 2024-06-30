import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [authData, setAuthData] = useState({});
  const [cartItemCounts, setCartItemCounts] = useState(0);

  const hasRole = (role) => isLoggedIn && authData.role === role;

  const setTokenInLs = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken("");
    setAuthData({});
    localStorage.removeItem("token");
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login-user`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const completeRes = await response.json();
        setAuthData(completeRes.data);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const addToCart = async (cartData) => {
    try {
      await fetch(`${API_BASE_URL}/add-to-cart`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });
      cartCount();
    } catch (error) {
      console.error("Error in Add to cart Function", error);
    }
  };

  const cartCount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-cart-items`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const completeRes = await response.json();
      setCartItemCounts(completeRes.data);
    } catch (error) {
      console.error("Error in Add to cart Function", error);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`${API_BASE_URL}/clear-cart`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error on clearCart function", error);
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserDetails();
      cartCount();
    }
  }, [token]);

  const contextValue = {
    token,
    isLoggedIn,
    setTokenInLs,
    logout,
    fetchUserDetails,
    authData,
    hasRole,
    loginUser,
    addToCart,
    cartItemCounts,
    API_BASE_URL,
    cartCount,
    clearCart
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
