import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  TableContainer,
  Alert,
  AlertTitle,
  AlertColor,
} from "@mui/material";
import apiCalls from "../backend/apiCalls";
import CrudTable from "./CrudTable";

const ContainerStyled = styled("div")({
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
});

const TableContainerStyled = styled(TableContainer)({
  marginTop: "20px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 0px 10px #D5D5D5",
  borderRadius: "8px",
});


const Users = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertColor | undefined>(undefined);
  const [modalAlertMessage, setmodalAlertMessage] = useState("");
  const [modalAlertType, setmodalAlertType] = useState<AlertColor | undefined>(undefined);

  const fetchUsers = async () => {
    // Perform API call and retrieve search results
    await apiCalls
      .getUsers()
      .then((data) => {
        setSearchResults(data.data);
        if (data.data.length === 0) {
          setAlertType("info");
          setAlertMessage("No Data Found.");
        } else {
          setAlertMessage("");
          setAlertType(undefined);
        }
      })
      .catch((err) => {
        let errorMessage = "Data Fetching Failed";
        if (err.response && err.response.status === 401) {
          errorMessage = "Token Expired";
        }
        setAlertType("error");
        setAlertMessage(errorMessage);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ContainerStyled
      sx={{
        minHeight: "calc(100vh - 120px)", 
        minWidth: "90vw",
      }}
    >
      <div>
        {alertMessage && (
          <TableContainerStyled>
            <Alert severity={alertType}>
              <AlertTitle>{alertType}</AlertTitle>
              {alertMessage}
            </Alert>
          </TableContainerStyled>
        )}
        {modalAlertMessage && (
          <TableContainerStyled>
            <Alert severity={modalAlertType}>
              <AlertTitle>{modalAlertType}</AlertTitle>
              {modalAlertMessage}
            </Alert>
          </TableContainerStyled>
        )}
        {searchResults.length > 0 && (
          <CrudTable
            data={searchResults}
            fetchUsers={fetchUsers}
            setMainAlertMessage={setmodalAlertMessage}
            setMainAlertType={setmodalAlertType}
          />
        )}
      </div>
    </ContainerStyled>
  );
};

export default Users;
