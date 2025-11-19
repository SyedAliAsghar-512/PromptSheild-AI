import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "../src/App.css"
import React from 'react';
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import Store from "../src/redux/store.js"
import useUserRoutes from "./routes/userRoutes.jsx";
import useAdminRoutes from "./routes/adminRoutes.jsx";
import NotFound from "./layouts/NotFound.jsx";

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

