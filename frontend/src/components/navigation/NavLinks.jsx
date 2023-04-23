import { useContext } from "react";
import { NavLink } from "react-router-dom";

import Button from "../button/Button";
import { AuthContext } from "../../utils/AuthContext";

import "./NavLinks.css";

const NavLinks = () => {
  const authContext = useContext(AuthContext);

  return (
    <ul className='navlinks'>
      {authContext.token ? (
        <Button type="action" onClick={authContext.logout}>Log out</Button>
      ) : (
        <li>
          <NavLink to='/authenticate'>Authenticate</NavLink>
        </li>
      )}
      <li>
        <NavLink to='/'>Listings</NavLink>
      </li>
      {!!authContext.token && (
        <li>
          <NavLink to='/mylistings'>Own listings</NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
