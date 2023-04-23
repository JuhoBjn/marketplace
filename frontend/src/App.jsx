import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Listings from "./pages/listings/Listings";
import OwnListings from "./pages/own-listings/OwnListings";
import Authentication from "./pages/authentication/Authentication";
import NavBar from "./components/navigation/NavBar";
import { signup, login } from "./utils/UsersAPI";

import { AuthContext } from "./utils/AuthContext";

import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    token: "",
  });

  /**
   * Function to sign up a new user.
   * @param {*} firstname - User's first name.
   * @param {*} lastname  - User's last name.
   * @param {*} email     - User's email address.
   * @param {*} phone     - Users's phone number.
   * @param {*} password  - User's password.
   */
  const signupUser = async (firstname, lastname, email, phone, password) => {
    try {
      const response = await signup(
        firstname,
        lastname,
        email,
        phone,
        password
      );
      setLoggedInUser({ ...response });
      localStorage.setItem("loggedInUser", JSON.stringify(response));
    } catch (err) {
      return err;
    }
  };

  /**
   * Function to log in a user.
   * @param {*} email     - User's email address.
   * @param {*} password  - User's password.
   */
  const loginUser = async (email, password) => {
    try {
      const response = await login(email, password);
      setLoggedInUser({ ...response });
      localStorage.setItem("loggedInUser", JSON.stringify(response));
    } catch (err) {
      throw err;
    }
  };

  /**
   * Function to log out the currently logged in user.
   */
  const logoutUser = () => {
    setLoggedInUser({
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      token: "",
    });
    localStorage.removeItem("loggedInUser");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser && storedUser.token) {
      setLoggedInUser({ ...storedUser });
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        id: loggedInUser.id,
        firstname: loggedInUser.firstname,
        lastname: loggedInUser.lastname,
        email: loggedInUser.email,
        token: loggedInUser.token,
        signup: signupUser,
        login: loginUser,
        logout: logoutUser,
      }}
    >
      <NavBar />
      <Routes>
        <Route path='/' element={<Listings />} />
        <Route path='/mylistings' element={<OwnListings />} />
        <Route path='/authenticate' element={<Authentication />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
