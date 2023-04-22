import "./NavBar.css";

import NavLinks from "./NavLinks";

const NavBar = () => {
  return (
    <div className="navbar">
      <h1 id="title">Marketplace</h1>
      <div className="nav-links__container">
        <nav className="nav-links">
          <NavLinks />
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
