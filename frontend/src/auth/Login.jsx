import React, {useEffect, useState} from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layouts/MetaData"
import { useGetMeQuery } from "../../redux/api/userApi";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setshowPassword] = useState(true);

    const navigate = useNavigate()

    const [login, {isLoading, error}] = useLoginMutation()
    const {isAuthenticated, user} = useSelector((state) => state.auth)
    const {data} = useGetMeQuery()
    //console.log(user);

    const [color, setColor] = useState("")
    const [textColor, setTextColor] = useState("")
    const savedMode = localStorage.getItem('darkMode') === 'true';
    const token = localStorage.getItem('token');

    const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowSlowMessage(true);
      }, 30000); // 60 seconds
    } else {
      clearTimeout(timeoutId);
      setShowSlowMessage(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
    useEffect(() => {
      if(savedMode) {
         setColor("grey")
         setTextColor("white")
      }
        else {
           setColor("grey")
           setTextColor("black")
        }
      
    })


    useEffect(() => {
      if (isAuthenticated){
        navigate(`/dashboard`)
        }

        if(error) {
          toast.error(error?.data?.message, {
            style: {
              marginTop: "env(safe-area-inset-top)", // Adjust for safe area
            },
          });
        } 

    }, [error, isAuthenticated])

    const submitHandler = (e) => {
        e.preventDefault()
        
        const loginData = {
            username,
            password,
        }
        login(loginData)
    }
 
    return (
        <>
        <nav className="navbar row" style={{ backgroundColor: "#055993"}}>
<div className="col-12 col-md-6">
        <div className="navbar-brand" >
        <img className="logoimgg" src="/images/logo.png" width="60px" height="60px" alt="Nust"/>
            <div style={{textAlign: "center"}}>
            <h5 className="name" style={{marginRight: "10%", fontSize: "16px"}}>NUST Student Portal</h5>
            </div>
            </div>
            </div>
            </nav>
        <MetaData title="Login - Qalam" />
        <div className="container fade-in-left" style={{ padding: "25px"}}>
        <div className=" row wrapper">

      <div className="card rounded col-10 col-lg-5" style={{ boxShadow: "0 2px 5px rgba(0.2, 0.2, 0.2, 0.5)", backgroundColor: "transparent", border: "0.1px solid white"}}>
        <form
          style={{ backgroundColor: "white", color: "grey"}}
          onSubmit={submitHandler}
        >
          <img className="loginn" src="/images/loginn.png"></img>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">Login ID</label>
            <input type="text"
              id="username_field"
              className="form-control"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            
          />
            </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            
          />
       
          </div>

          {!isLoading ? (
              <div className="center-container">
              <button id="login_button" type="submit" className="login_btn">
                Login
              </button>
              </div>
            ) : (
              <div className="ms-2">
                <div className="animation-container">
                  <div className="ball ball-1"></div>
                  <div className="ball ball-2"></div>
                </div>
                {showSlowMessage && (
            <div className="mt-2 text-danger">Please wait, Your internet is slow...</div>
          )}
              </div>
              
            )}

        </form>
      </div>
      <Link to = "/about-developer" style={{textAlign: "center"}}><button className="developer_btn">About Developer</button></Link>
    </div>
    </div>

    </>
    )
}

export default Login