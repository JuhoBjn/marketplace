import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = () => {
  return (
    <ul className="navlinks">
      <li>
        <NavLink to="/authenticate">Authenticate</NavLink>
      </li>
      <li>
        <NavLink to="/">Listings</NavLink>
      </li>
      <li>
        <NavLink to="/mylistings">Own listings</NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
