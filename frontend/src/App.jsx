import { Routes, Route, Navigate } from "react-router-dom";

import Listings from "./pages/listings/Listings";
import OwnListings from "./pages/own-listings/OwnListings";
import Authentication from "./pages/authentication/Authentication";
import NavBar from "./components/navigation/NavBar";

import "./App.css";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Listings />} />
        <Route path="/mylistings" element={<OwnListings />} />
        <Route path="/authenticate" element={<Authentication />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
