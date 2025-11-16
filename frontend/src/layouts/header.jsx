import React, {useEffect, useState} from "react";
import Search from "./Search";
import "../../App.css"
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../../redux/api/authApi";
import DarkModeToggle from "../layouts/DarkModeToggle"
import toast from "react-hot-toast"
import { setIsAuthenticated } from "../../redux/features/userSlice";
import Sidebar from "./SideBar";

const Header = () => {

  const {user} = useSelector((state) => state.auth)
  const [color, setColor] = useState("")
  const {isLoading } = useGetMeQuery()
  const [textColor, setTextColor] = useState("")
  const [itemColor, setItemColor] = useState("")
  const savedMode = localStorage.getItem('darkMode') === 'true';
  const navigate = useNavigate()

    const [logout] = useLazyLogoutQuery()

    const LogoutHandler =() => {
      logout();
      handleClick()
      }
  
      const handleClick = () => {
          setTimeout(() => {
              navigate(0)
          }, 1000); 
      };

      const refresh = () => {
        navigate("/dashboard")
      }
    
      useEffect(() => {
        if(savedMode) {
           setColor("#0e1011")
           setTextColor("white")
           setItemColor("black")
        }
          else {
             setColor("#0d2448")
             setTextColor("black")
             setItemColor("white")
          }
         
      })
    
      // Simulate a redirection (for example, after a login)
      const handleRedirect = () => {
        setTimeout(() => {
          toast.success("Redirecting")
       }, 3000); 
      };

    return (
      <>     
         { user ? (
<>
<nav className="navbar row" style={{ backgroundColor: "#055993"}}>
<div className="col-12 col-md-6 col-sm-6">
        <div className="navbar-brand">
        <img className="logoimgg" src="/images/logo.png" width="60px" height="60px" alt="Nust"/>
            <div style={{marginLeft: "auto", float: "right", marginTop: "3px"}}>
            <div className="ms-4 dropdown" >
          <button
            className="drop-btn dropdown-toggle text-white "
            type="button"
            id="dropDownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{margin: "5px"}}
          >
            <span className="username">{user?.student_info?.name}</span>
          </button>
          
          <div className="dropdown-menu w-100 fade-in-bottom" aria-labelledby="dropDownMenuButton" style={{ backgroundColor: "white", height: "100%"}}>

            <Link  className="dropdown-item text-danger" id="drop" onClick={LogoutHandler} to=""> Logout</Link>
          </div>
        </div>
            </div>
            <p className="name">NUST Student Portal</p>
      </div>
      </div>
        </nav>
        </>
): (
  !isLoading && (
    <div></div>
  )
)}



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

    <script src="https://kit.fontawesome.com/9edb65c86a.js"></script>

</>
    )
}

export default Header