import { useContext } from "react";

import NavLinks from "./NavLinks";
import { AuthContext } from "../../utils/AuthContext";

import "./NavBar.css";

const NavBar = () => {
  const authContext = useContext(AuthContext);

  return (
    <div className="navbar">
      <h1 id="title">Marketplace</h1>
      <div className="nav-links__container">
        <nav className="nav-links">
          <NavLinks />
        </nav>
      </div>
      {!!authContext.token && (
      <div className="navbar__username">
        <h3>{`${authContext.firstname} ${authContext.lastname}`}</h3>
      </div>
      )}
    </div>
  );
};

export default NavBar;
