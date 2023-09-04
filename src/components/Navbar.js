import React, { useEffect } from "react";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";



  

const Navbar = () => {
  let location = useLocation();
  
  const navigate = useNavigate(); 
  const userFullName = localStorage.getItem("userName");
  const isLoggedIn = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMyBooksClick = () => {
    if (isLoggedIn) {
      // If the user is logged in, navigate to the user's books
      navigate(`${userFullName}/api/books/fetchuserbook`);
    } else {
      // If the user is not logged in, navigate to the login page
      navigate("/login");
    }
  };
  useEffect(() => {}, [location]);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Your Pustakalaya
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                aria-current="page"
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/mybooks" ? "active" : ""
                }`}
                to={
                  isLoggedIn
                    ? `${userFullName}/api/books/fetchuserbook`
                    : "/login"
                }
              >
                My Books
              </Link>
            </li>
          </ul>
          {isLoggedIn ? (
            // If user is logged in, display full name and logout button
            <div className="d-flex align-items-center">
              <span className="text-white mx-3">Welcome, {userFullName}</span>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          ) : (
            // If user is not logged in, display login and signup links
            <form className="d-flex" role="search">
              <Link className="btn btn-primary mx-1" to="/login" role="button">
                Login
              </Link>
              <Link className="btn btn-primary mx-1" to="/signup" role="button">
                Signup
              </Link>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
