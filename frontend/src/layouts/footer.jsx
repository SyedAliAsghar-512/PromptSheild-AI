import React from "react";
import "../../App.css"

const footer = () => {
    return (
      <>
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
            rel="stylesheet"
          />
          <footer className="footer-text" style={{marginBottom: "10%"}}>
            <p class="text-center mt-1 fw-bold">
              Developed by Syed Ali Asghar, National University of Sciences & Technology(NUST), Pakistan 2024 - 2025 © All rights reserved
            </p>
          </footer>
      </>
    )
}

export default footer