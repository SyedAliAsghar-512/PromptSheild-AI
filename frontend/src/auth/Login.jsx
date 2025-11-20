import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../redux/api/authApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useGetMeQuery } from "../redux/api/userApi";
import "../App.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useGetMeQuery(); // keep user fresh

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
    if (error) toast.error(error?.data?.message || "Login failed");
  }, [error, isAuthenticated, navigate]);

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
      <MetaData title="Login - PromptShield AI" />
      <div className="ps-min-h-screen">
        {/* Top bar */}
        <header className="ps-top-nav">
          <div className="ps-top-nav-inner">
            <div className="ps-brand">
              <div className="ps-brand-icon">
                <img
                  src="/images/logo.png"
                  width={26}
                  height={26}
                  alt="Logo"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(34,211,238,0.8))",
                  }}
                />
              </div>
              <div className="ps-brand-title">
                <span className="ps-brand-title-main">PromptShield AI</span>
                <span className="ps-brand-title-sub">
                  Login to your safety console
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Center card */}
        <div className="ps-auth-wrapper">
          <div className="ps-auth-card">
            <h3 className="ps-auth-heading">Welcome back</h3>
            <p className="ps-auth-sub">
              Enter your credentials to access the PromptShield dashboard.
            </p>

            <form onSubmit={submitHandler}>
              <div style={{ marginBottom: 12 }}>
                <div className="ps-field-label">Login ID</div>
                <input
                  type="text"
                  className="ps-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: 6 }}>
                <div className="ps-field-label">Password</div>
                <div className="ps-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="ps-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="ps-input-eye"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="ps-auth-btn"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="ps-auth-footer-text">
              New here?{" "}
              <Link to="/register" className="ps-auth-link">
                Create a Shield account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;