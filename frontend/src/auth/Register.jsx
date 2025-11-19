import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layouts/MetaData";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Using icons for better visual design

const Register = () => {
    const [register, { isLoading, error, isSuccess }] = useRegisterMutation();
    // Simplified password toggle, starting hidden
    const [showPassword, setShowPassword] = useState(false); 

    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = user;

    // --- Styling Variables based on PromptShield AI Theme ---
    const primaryBackgroundColor = "#0a0c10"; // Very dark background
    const formBackgroundColor = "#181a20"; // Darker background for the form container
    const accentColor = "#00d4ff"; // Bright cyan/blue for highlights
    const accentColorDark = "#0099cc"; // Darker shade for hover/focus
    const textColor = "#e0e6f0"; // Light text color

    // --- Effects for Redux/Routing ---
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }

        if (error) {
            // Using toast.error for error handling
            toast.error(error?.data?.message || "Registration failed.");
        }

        if (isSuccess) {
            toast.success("Registration successful! Please login.");
            navigate("/login");
        }
    }, [error, isAuthenticated, isSuccess, navigate]);

    // --- Handlers ---
    const submitHandler = (e) => {
        e.preventDefault();

        const signUpData = {
            name,
            email,
            password,
        };

        register(signUpData);
    };

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Toggles password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    // --- Component JSX ---
    return (
        <>
            <MetaData title="Register - PromptShield AI Style" />
            
            {/* Main Wrapper for Dark Theme */}
            <div 
                className="d-flex justify-content-center align-items-center"
                style={{ 
                    minHeight: '90vh', // Ensure it covers the height of the viewport
                    backgroundColor: primaryBackgroundColor,
                    padding: "20px"
                }}
            >
                {/* Form Container with Darker Background and Neon Borders */}
                <div 
                    className="col-12 col-sm-8 col-md-6 col-lg-4 p-4 shadow-lg rounded"
                    style={{
                        backgroundColor: formBackgroundColor,
                        border: `1px solid ${accentColorDark}`, // Subtle border
                        boxShadow: `0 0 15px rgba(0, 212, 255, 0.4)` // Neon glow effect
                    }}
                >
                    <form onSubmit={submitHandler}>
                        <h2 className="text-center mb-4" style={{ color: accentColor, textShadow: `0 0 5px ${accentColor}` }}>
                            Shield Account Registration
                        </h2>

                        {/* Name Field */}
                        <div className="mb-3" style={{ color: textColor }}>
                            <label htmlFor="name_field" className="form-label d-flex align-items-center">
                                <FaUser className="me-2" style={{ color: accentColor }} /> Name
                            </label>
                            <input
                                type="text"
                                id="name_field"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={onChange}
                                style={getInputStyle(formBackgroundColor, accentColor, textColor)}
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="mb-3" style={{ color: textColor }}>
                            <label htmlFor="email_field" className="form-label d-flex align-items-center">
                                <FaEnvelope className="me-2" style={{ color: accentColor }} /> Email
                            </label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={onChange}
                                style={getInputStyle(formBackgroundColor, accentColor, textColor)}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="mb-3" style={{ color: textColor }}>
                            <label htmlFor="password_field" className="form-label d-flex align-items-center">
                                <FaLock className="me-2" style={{ color: accentColor }} /> Password
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password_field"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    style={{
                                        ...getInputStyle(formBackgroundColor, accentColor, textColor),
                                        borderRight: 'none', // Remove border to merge with button
                                    }}
                                    required
                                />
                                {/* Password Visibility Toggle Button */}
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        backgroundColor: accentColorDark,
                                        color: textColor,
                                        border: `1px solid ${accentColorDark}`,
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <small className="form-text mt-1 d-block" style={{ color: '#888' }}>
                                Your password must be secure.
                            </small>
                        </div>

                        {/* Register Button */}
                        <button 
                            id="register_button" 
                            type="submit" 
                            className="btn w-100 py-2 mt-4" 
                            disabled={isLoading}
                            style={{
                                backgroundColor: accentColor,
                                color: primaryBackgroundColor, // Dark text on bright button
                                fontWeight: 'bold',
                                border: 'none',
                                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                boxShadow: `0 0 10px ${accentColor}`, // Neon glow for the button
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = accentColorDark}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = accentColor}
                        >
                            {isLoading ? "Creating Shield Account..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

// Helper function for input styling
const getInputStyle = (bg, accent, text) => ({
    backgroundColor: bg,
    color: text,
    borderColor: accent,
    boxShadow: `0 0 5px rgba(0, 212, 255, 0.2)`,
    // Targeting focus state
    ':focus': {
        backgroundColor: bg,
        color: text,
        borderColor: accent,
        boxShadow: `0 0 8px ${accent}`,
    }
});

export default Register;