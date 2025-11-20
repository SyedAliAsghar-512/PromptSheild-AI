import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../redux/api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../App.css";

const Register = () => {
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password } = user;

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
    if (error) {
      toast.error(error?.data?.message || "Registration failed.");
    }
    if (isSuccess) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    }
  }, [error, isAuthenticated, isSuccess, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    register({ name, email, password });
  };

  const onChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <>
      <MetaData title="Register - PromptShield AI" />
      <div className="ps-min-h-screen">
        <div className="ps-auth-wrapper">
          <div className="ps-auth-card">
            <div className="ps-register-icon">
              <FaUser size={22} color="#ecfdf5" />
            </div>
            <h2
              className="ps-auth-heading"
              style={{
                color: "#0ea5e9",
                textShadow: "0 0 6px rgba(56,189,248,0.8)",
              }}
            >
              Shield Account Registration
            </h2>
            <p className="ps-auth-sub">
              Create an account to manage safety rules and monitor your prompt
              activity.
            </p>

            <form onSubmit={submitHandler}>
              {/* Name */}
              <div style={{ marginBottom: 12, color: "#e5e7eb" }}>
                <div className="ps-field-label">
                  <FaUser
                    size={12}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Name
                </div>
                <input
                  type="text"
                  id="name_field"
                  name="name"
                  className="ps-input"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 12, color: "#e5e7eb" }}>
                <div className="ps-field-label">
                  <FaEnvelope
                    size={12}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Email
                </div>
                <input
                  type="email"
                  id="email_field"
                  name="email"
                  className="ps-input"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 8, color: "#e5e7eb" }}>
                <div className="ps-field-label">
                  <FaLock
                    size={12}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Password
                </div>
                <div className="ps-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password_field"
                    name="password"
                    className="ps-input"
                    value={password}
                    onChange={onChange}
                    required
                  />
                  <span
                    className="ps-input-eye"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <small
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontSize: 11,
                    color: "#9ca3af",
                  }}
                >
                  Use at least 8 characters, ideally with numbers &amp;
                  symbols.
                </small>
              </div>

              <button
                id="register_button"
                type="submit"
                className="ps-auth-btn"
                disabled={isLoading}
              >
                {isLoading ? "Creating Shield Account..." : "Register"}
              </button>

              <div className="ps-auth-footer-text">
                Already have an account?{" "}
                <Link to="/login" className="ps-auth-link">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;