import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton.jsx";
import { FaHome } from "react-icons/fa";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav">
      <li className="navButton">
        <NavLink to="/">
          <FaHome />
        </NavLink>
      </li>
      <li className="profileButton">
        <ProfileButton user={sessionUser} />
      </li>
    </ul>
  );
}

export default Navigation;
