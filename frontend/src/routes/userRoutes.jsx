import React from "react"
import { Route } from "react-router-dom"
import Register from "../auth/Register.jsx";
import Login from '../auth/Login.jsx';
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import Home from "../layouts/home"
const userRoutes = () => {

    return (
        <>
                <Route path = "/login" element = {
                <Login />} />       
               <Route path = "/dashboard" element = {
                <ProtectedRoute>
                <Home />
                </ProtectedRoute>
                } />
                <Route path = "/register" element = {
                <Register />
                } />
        </>
    )

}

export default userRoutes