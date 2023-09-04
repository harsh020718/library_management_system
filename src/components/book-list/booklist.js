import React from "react";
import { useState, useEffect, useContext } from "react";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import classes from "./styles.module.css";
import NoteContext from "../Context/NoteContext";
// import Mybooks from "../Mybooks"
// import User from "../../../backend/models/User"

const host = "http://localhost:5000";



function YourComponent() {
  
  

  const [alertState, setAlertState] = useState({
    message: "",
    severity: "info",
    open: false,
  });
  
 
  const borrowBook = async (book) => {
    
    try {
      const response = await fetch(`${host}/api/books/borrow/${book._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          // Send book details in the request body
          name: book.name,
          category: book.category,
          // Add other book details as needed
        }),
        // Add your authentication token here
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(data)

      if (response.status === 200) {
        setAlertState({
          message: data.message,
          severity: "success",
          open: true,
        });
      } else {
        setAlertState({
          message: data.message,
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      console.error(error);
      setAlertState({
        message: "You have already borrowed this book.",
        severity: "error",
        open: true,
      });
    }
  };



  const context = useContext(NoteContext);
  const { getbooks } = context;
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const data = await getbooks();
    setBooks(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBooks();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [fetchBooks]);

  const handleAlertClose = () => {
    setAlertState({
      ...alertState,
      open: false,
    });
  };

  return (
    <>
    <div className={classes.pageContainer} style={{ marginTop: '-20px' }}>
      
<div className={`${classes.pageHeader} ${classes.mb2}`} >
        <Typography variant="h5"  style={{ color: "white" }}>Book List</Typography>
      </div>
      {books.length > 0 ? (
        <div className={classes.tableContainer }>
          <TableContainer component={Paper} >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell component="th" scope="row">
                      {book.name}
                    </TableCell>
                    <TableCell>{book.category}</TableCell>
                    <TableCell>
                      <div className={classes.actionsContainer}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>  borrowBook(book)}
                        >
                          Borrow
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <Typography variant="h5">No books issued!</Typography>
      )}

      {/* Customized Alert */}
      <Snackbar open={alertState.open} autoHideDuration={4000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
      </div>
      
      </>
    
  );
}

export default YourComponent;
