import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  let [credential, setCredential] = useState("");
  let [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data) {
          setErrors(data);
        }
      });
  };

  return (
    <>
      <div className="login">
        <h1>Log In</h1>
        {errors.message && (
          <p style={{ color: "red" }}>The provided credentials were invalid.</p>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label className="credential">
            {/* Username or Email */}
            <input
              type="text"
              placeholder="Username or Email"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label className="password">
            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button
            className="login-button"
            type="submit"
            disabled={credential.length < 4 || password.length < 6}
          >
            Log In
          </button>
          <button
            className="demo"
            onClick={(e) => {
              credential = "Demo-lition";
              password = "password";
              handleSubmit(e);
            }}
          >
            Demo User
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
