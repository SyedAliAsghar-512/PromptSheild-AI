import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "../src/App.css"
import React from 'react';
import Header from "./components/layouts/header";
import Footer from "./components/layouts/footer";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import Store from "../src/redux/store.js"
import useUserRoutes from "./components/routes/userRoutes.jsx";
import useAdminRoutes from "./components/routes/adminRoutes.jsx";
import NotFound from "./components/layouts/NotFound.jsx";
import BottomNavBar from "./components/layouts/lownav.jsx";

function App() {

  const userRoutes = useUserRoutes()
  const adminRoutes = useAdminRoutes()

    return (
      <>
      
        <Provider store={Store}>
        <Router>
        <Toaster position="top-center"/>
          <div className="App">
            <Header />
            
            <div className="container">
              <Routes>
               {userRoutes}
               {adminRoutes}
               <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <BottomNavBar />
            <Footer />
          </div>
        </Router>
        </Provider>
        </>
    )

}


export default App;

