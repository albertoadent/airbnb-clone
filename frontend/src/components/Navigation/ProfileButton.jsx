import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";
import { Link, useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [dropDownActive, setDropdown] = useState(false);
  const ulRef = useRef();
  const nav = useNavigate();

  function logout(e) {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(nav("/"));
  }

  const toggleDropdown = (e) => {
    e.stopPropagation();
    return setDropdown((prevState) => !prevState);
  };

  useEffect(() => {
    if (!dropDownActive) return;

    const closeMenu = (e) => {
      const isInComponent = ulRef && !ulRef.current?.contains(e.target);
      if (isInComponent) {
        setDropdown(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [dropDownActive]);

  return (
    <>
      <button style={{ whiteSpace: "pre-wrap" }} onClick={toggleDropdown}>
        <FaBars /> <FaUserCircle />
      </button>
      {user ? (
        <ul
          className={`profile-dropdown ${dropDownActive ? "active" : ""}`}
          ref={ulRef}
          style={{
            background:
              "linear-gradient(to bottom, rgba(240, 248, 255, 0.486), rgb(118, 141, 190))",
            zIndex: "1",
          }}
        >
          <li>Hello {user.firstName}</li>
          <li>{user.email}</li>
          <li>
            <Link to="/my-spots">Manage Spots</Link>
          </li>
          <li>
            <button className="navButton" onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      ) : (
        <ul
          className={`profile-dropdown ${dropDownActive ? "active" : ""}`}
          ref={ulRef}
          style={{
            background:
              "linear-gradient(to bottom, rgba(240, 248, 255, 0.486), rgb(118, 141, 190))",
            zIndex: "1",
          }}
        >
          <li className="navButton">
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li className="navButton">
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
