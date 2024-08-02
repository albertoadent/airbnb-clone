import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";

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
      {dropDownActive && (
        <ul className="profile-dropdown" ref={ulRef}>
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
      )}
    </>
  );
}

export default ProfileButton;
