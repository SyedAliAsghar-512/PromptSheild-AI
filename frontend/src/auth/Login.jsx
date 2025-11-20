import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import toast from "react-hot-toast";
import { useGetMeQuery } from "../../redux/api/userApi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data } = useGetMeQuery();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");

    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }

    login({ username, password });
  };

  return (
    <>
      <MetaData title="Login - Prompt Shield AI" />

      <div
        className={`login-container ${darkMode ? "dark" : "light"}`}
        style={{
          minHeight: "100vh",
          transition: "0.4s",
        }}
      >
        {/* Header */}
        <nav
          style={{
            backgroundColor: darkMode ? "#0d1b2a" : "#055993",
            padding: "14px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <div className="d-flex align-items-center">
            <img src="/images/logo.png" width="55" height="55" alt="Logo" />
            <h4 style={{ marginLeft: "10px", marginTop: "6px" }}>
              Prompt Shield AI
            </h4>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </nav>

        {/* Login Card */}
        <div className="d-flex justify-content-center align-items-center">
          <div
            className="login-box"
            style={{
              background: darkMode ? "#1b263b" : "white",
              color: darkMode ? "white" : "#333",
              width: "380px",
              marginTop: "50px",
              borderRadius: "18px",
              padding: "30px",
              boxShadow: darkMode
                ? "0px 4px 25px rgba(0,0,0,0.4)"
                : "0px 4px 25px rgba(0,0,0,0.15)",
              animation: "fadeIn 0.6s ease",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "25px" }}>
              Login
            </h3>

            <form onSubmit={submitHandler}>
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Login ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  style={{
                    background: darkMode ? "#0d1b2a" : "#f5f5f5",
                    color: darkMode ? "white" : "black",
                  }}
                />
              </div>

              {/* Password + Eye Icon */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: darkMode ? "#0d1b2a" : "#f5f5f5",
                    color: darkMode ? "white" : "black",
                  }}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "42px",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn w-100"
                style={{
                  background: "#055993",
                  color: "white",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Developer Link */}
            <div className="text-center mt-3">
              <Link to="/about-developer">
                <button
                  className="btn"
                  style={{
                    background: darkMode ? "#283044" : "#e6e6e6",
                    color: darkMode ? "white" : "black",
                    width: "100%",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                >
                  About Developer
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fade animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default Login;
