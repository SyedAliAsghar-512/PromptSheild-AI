import React, { useEffect, useState } from "react";
import "../App.css";
import { useGetMeQuery } from "../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../redux/api/authApi";
import toast from "react-hot-toast";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useGetMeQuery();
  const navigate = useNavigate();
  const [logout] = useLazyLogoutQuery();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const LogoutHandler = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      setTimeout(() => navigate(0), 800);
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!user && isLoading) return null;

  return (
    <>
      {user && (
        <header className="ps-top-nav">
          <div className="ps-top-nav-inner">
            {/* Brand */}
            <div className="ps-brand">
              <div className="ps-brand-icon">
                <img
                  src="/images/logo.png"
                  alt="PromptShield"
                  width={26}
                  height={26}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(34,211,238,0.8))",
                  }}
                />
              </div>
              <div className="ps-brand-title">
                <span className="ps-brand-title-main">PromptShield AI</span>
                <span className="ps-brand-title-sub">
                  Safety &amp; Policy Guard
                </span>
              </div>
            </div>

            {/* Center nav (docs/api/dashboard) */}
            <nav className="ps-nav-links">
              <Link to="/docs" className="ps-nav-link">
                Docs
              </Link>
              <Link to="/api" className="ps-nav-link">
                API
              </Link>
              <Link to="/dashboard" className="ps-nav-pill">
                Dashboard
              </Link>
            </nav>

            {/* Right: dark mode + user dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                className="ps-mode-toggle"
                type="button"
                onClick={() => setDarkMode((d) => !d)}
              >
                {darkMode ? "🌙" : "☀️"}
              </button>

              <div className="ps-dropdown">
                <button
                  type="button"
                  className="ps-user-pill"
                  onClick={() => setOpenMenu((o) => !o)}
                >
                  <div className="ps-user-avatar">
                    {user?.student_info?.name?.[0] ||
                      user?.name?.[0] ||
                      "U"}
                  </div>
                  <span>
                    {user?.student_info?.name || user?.name || "User"}
                  </span>
                </button>

                <div
                  className={
                    "ps-dropdown-menu" + (openMenu ? " open" : "")
                  }
                >
                  <div
                    className="ps-dropdown-item"
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </div>
                  <div
                    className="ps-dropdown-item ps-dropdown-item-danger"
                    onClick={() => {
                      setOpenMenu(false);
                      LogoutHandler();
                    }}
                  >
                    Logout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;