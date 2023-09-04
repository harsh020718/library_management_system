import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import Mybooks from "./components/Mybooks";
import "./App.css"; // Import the CSS file here
import NoteState from "./components/Context/NoteState";
import YourComponent from "./components/book-list/booklist"

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  // Get user full name from localStorage
  const userFullName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  return (
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
            <Route
              path={`/${userFullName}/api/books/fetchuserbook/`}
              element={
                localStorage.getItem("token") ? (
                  // If the user is logged in, go to My Books with the user's full name
                  <Mybooks showAlert={showAlert} />
                ) : (
                  // If the user is not logged in, go to the login page
                  <Login showAlert={showAlert} />
                )
              }
            />
            
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;
