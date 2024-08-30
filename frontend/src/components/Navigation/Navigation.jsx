import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton.jsx";
import starIcon from "/star.ico";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav">
      <NavLink to="/">
        <img src={starIcon} alt="" />
      </NavLink>
      <div style={{ display: "flex" }}>
        {sessionUser && (
          <li className="navButton" style={{ fontSize: "small" }}>
            <NavLink to="/create-spot">Create a New Spot</NavLink>
          </li>
        )}
        <li className="profileButton">
          <ProfileButton user={sessionUser} />
        </li>
      </div>
    </ul>
  );
}

export default Navigation;
