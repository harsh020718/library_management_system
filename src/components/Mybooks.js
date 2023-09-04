import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
} from "@mui/material";
import Alert from "@mui/material/Alert";

const host = "http://localhost:5000";

const Mybooks = () => {
  const userFullName = localStorage.getItem("userName");
  const [alertState, setAlertState] = useState({
    message: "",
    severity: "info",
    open: false,
  });
  
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const showBorrowedBook = async () => {
    try {
      const response = await fetch(`${host}/api/books/showBorrowedBook/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const borrowedBooks = await response.json();
      setData(borrowedBooks); // Update the state with the fetched data
    } catch (error) {
      console.error(error);
      // Handle the error as needed, e.g., show a message to the user
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      const response = await fetch(`${host}/api/books/return/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      console.log(response.status)
      if (response.status === 200) {
        setAlertState({
          message: "You have returned the book successfully.",
          severity: "success",
          open: true,
        });}
      // If the book was successfully returned, update the state to remove it
      setData((prevData) => prevData.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error(error);
      // Handle the error as needed, e.g., show a message to the user
    }
  };

  useEffect(() => {
    if (!userFullName) {
      navigate("/login");
    } else {
      // Fetch the borrowed books when the component mounts
      showBorrowedBook();
    }
  }, [navigate, userFullName]);
  
  const handleAlertClose = () => {
    setAlertState({
      ...alertState,
      open: false,
    });
  }

  return (
    <div className="white-text">
      <h1>{userFullName} Books</h1>
      {data?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((book) => (
                <TableRow key={book._id}>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleReturnBook(book._id)}
                      variant="outlined"
                    >
                      Return
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>You haven't borrowed any books yet.</p>
      )}
      <Snackbar open={alertState.open} autoHideDuration={4000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Mybooks;
