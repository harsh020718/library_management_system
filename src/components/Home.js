import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppBar, Toolbar, Typography, Container } from "@mui/material";

import BooksList from "../components/book-list/booklist";


const Home = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    else{

    }
  });

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "white",
              }}
            >
              Your Home For Books
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <div>
        <BooksList />
      </div>
    </>
  );
};

export default Home;
