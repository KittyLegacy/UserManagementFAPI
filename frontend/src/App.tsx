import React from "react";
import { styled } from "@mui/system";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import { Routes, Route } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const HeaderStyled = styled("header")({
  textAlign: "center",
  backgroundColor: "#FFFFFF",
  padding: "15px",
  boxShadow: "0px 0px 10px #D5D5D5",
  display: "flex",
  justifyContent: "space-between",
});

const FooterStyled = styled("footer")({
  textAlign: "center",
  margin: 0,
  padding: 0,
});

function App() {
  return (
    <>
      {localStorage.getItem("token") ? (
        <HeaderStyled>
          <Avatar>
            <AccountCircle />
          </Avatar>
          <div>
            <Button
              variant="text"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="text"
              onClick={() => {
                window.location.href = "/users";
              }}
            >
              Users
            </Button>
            <Button
              variant="text"
              onClick={() => {
                window.location.href = "/setting";
              }}
            >
              Settings
            </Button>
          </div>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Log Out
          </Button>
        </HeaderStyled>
      ) : (
        <HeaderStyled>
          <span style={{ fontWeight: "bold", fontSize: "23px" }}></span>
          <div>
            <Button
              variant="text"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="text"
              onClick={() => {
                window.location.href = "/setting";
              }}
            >
              Settings
            </Button>
          </div>
          <span style={{ fontWeight: "bold", fontSize: "23px" }}></span>
        </HeaderStyled>
      )}
      {localStorage.getItem("token") ? (
        <Routes>
          <Route path="/users" element={<Users />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      )}
      <FooterStyled>&copy; {new Date().getFullYear()}</FooterStyled>
    </>
  );
}

export default App;
