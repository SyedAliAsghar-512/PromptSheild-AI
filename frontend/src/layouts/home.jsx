import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../layouts/loader.jsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMeQuery } from "../redux/api/userApi.js";
import "../App.css";

const Home = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const { isLoading, error, isError } = useGetMeQuery();

  useEffect(() => {
    if (isError) toast.error(error?.data?.message);
  }, [isError, error]);

  if (loading || isLoading) return <Loader />;

  return (
    <div className="ps-min-h-screen">
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
      {/* Main hero */}
      <main className="ps-container ps-hero">
        <div className="ps-hero-grid">
          {/* LEFT: text */}
          <div>
            <div className="ps-chip">
              <span className="ps-chip-dot" />
              Realtime Prompt Safety Engine
            </div>

            <h1 className="ps-hero-title">
              <span>PromptShield </span>
              <span className="ps-gradient-text">AI</span>
            </h1>

            <p className="ps-hero-sub">
              Instantly check your prompt for safety and policy alignment
              before it ever reaches an LLM. Detect jailbreaks, toxicity and
              policy violations with explainable reasoning.
            </p>

            <div className="ps-hero-actions">
              <Link to={user ? "/dashboard" : "/login"}>
                <button className="ps-btn-primary">
                  {user ? "Go to Dashboard" : "Get Started"}
                </button>
              </Link>

              <Link to="/docs" className="ps-link-muted">
                View API Docs →
              </Link>
            </div>

            <div className="ps-hero-meta">
              <div className="ps-hero-meta-item">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "999px",
                    backgroundColor: "#4ade80",
                  }}
                />
                <span>Production-ready</span>
              </div>
              <div className="ps-hero-meta-item">
                Fine-grained safety labels
              </div>
              <div className="ps-hero-meta-item">One-line integration</div>
            </div>
          </div>

          {/* RIGHT: prompt box */}
          <div>
            <div className="ps-hero-prompt-card">
              <div className="ps-hero-prompt-top">
                <span>Enter a prompt to test it</span>
                <span style={{ color: "#9ca3af" }}>Preview</span>
              </div>
              <div className="ps-hero-prompt-body">
                <textarea
                  className="ps-textarea"
                  disabled
                  placeholder="Write your prompt here..."
                />
                <button
                  className="ps-auth-btn"
                  style={{ marginTop: 10 }}
                  disabled
                >
                  Check Prompt
                </button>
                <p
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    textAlign: "center",
                    color: "#9ca3af",
                  }}
                >
                  Live classification &amp; reasons will show here once
                  connected to the API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* HOW IT WORKS */}
      <section className="ps-section">
        <div className="ps-container">
          <h2 className="ps-section-title">How it works</h2>
          <div className="ps-cards-row">
            <div className="ps-card">
              <h3 className="ps-card-title">Preprocessing</h3>
              <p className="ps-card-text">
                Normalize and sanitize your input for robust analysis.
              </p>
            </div>
            <div className="ps-card">
              <h3 className="ps-card-title">Dual Detection</h3>
              <p className="ps-card-text">
                Blend rule-based and model scoring to detect risks.
              </p>
            </div>
            <div className="ps-card">
              <h3 className="ps-card-title">Safety Decision</h3>
              <p className="ps-card-text">
                Classify as SAFE or UNSAFE with transparent reasons.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;