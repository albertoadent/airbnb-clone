import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [dropDownActive, setDropdown] = useState(false);
  const ulRef = useRef();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

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
      <button onClick={toggleDropdown}>
        <FaUserCircle />
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
          <li>{user.username}</li>
          <li>
            {user.firstName} {user.lastName}
          </li>
          <li>{user.email}</li>
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
