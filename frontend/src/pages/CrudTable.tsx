import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  TextField,
  Button,
  Card,
  Box,
  Tooltip,
  IconButton,
  Modal,
  AlertColor,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import apiCalls from "../backend/apiCalls";
import { Delete, Edit } from "@mui/icons-material";

const TableContainerStyled = styled(TableContainer)({
  marginTop: "20px",
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 0px 10px #D5D5D5",
  borderRadius: "8px",
});

const TableCellStyled = styled(TableCell)({
  fontWeight: "bold",
  textAlign: "center",
});

const CardStyled = styled(Card)({
  padding: "20px",
  boxShadow: "0px 0px 10px #D5D5D5",
  maxWidth: "35%",
});

const ModalStyled = styled(Modal)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const ButtonStyled = styled(Button)({
  marginTop: "16px",
});

interface ResultTableProps {
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    locked: boolean;
    created_at: string;
  }[];
  fetchUsers: any;
  setMainAlertMessage: any;
  setMainAlertType: any;
}
const CrudTable = ({
  data,
  fetchUsers,
  setMainAlertMessage,
  setMainAlertType,
}: ResultTableProps) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertColor | undefined>(undefined);
  const [formData, setFormData] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [mode, setmode] = useState("");
  const handleOpen = (item: any) => {
    if (item) {
      setFormData(item);
    }
    setOpen(true);
  };
  const handleClose = () => {
    setFormData({});
    setOpen(false);
    setAlertMessage("");
    setAlertType(undefined);
  };

  const handleDeleteUser = async (item: any) => {
    await apiCalls
      .deleteUserApi(item)
      .then(() => {
        fetchUsers();
        setMainAlertMessage("User Deleted");
        setMainAlertType("info");
      })
      .catch((err) => {
        let errorMessage = "User deletion failed";
        setMainAlertType("error");
        setMainAlertMessage(errorMessage);
      });
  };

  const handleEditUser = async (event: any) => {
    setAlertMessage("");
    setAlertType(undefined);
    event.preventDefault();
    const payload = {
      id: formData.id,
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
      role: event.target.elements.role.value,
      locked: event.target.elements.locked.value,
    };
    await apiCalls
      .updateUserApi(payload)
      .then(() => {
        fetchUsers();
        handleClose();
        setMainAlertMessage("User Updated");
        setMainAlertType("info");
      })
      .catch((err) => {
        let errorMessage = "User update Failed";
        setAlertType("error");
        setAlertMessage(errorMessage);
      });
  };

  const handleAddUser = async (event: any) => {
    setAlertMessage("");
    setAlertType(undefined);
    event.preventDefault();
    const payload = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
      role: event.target.elements.role.value
    };
    await apiCalls
      .addUserApi(payload)
      .then(() => {
        fetchUsers();
        handleClose();
        setMainAlertMessage("User Added");
        setMainAlertType("info");
      })
      .catch((err) => {
        let errorMessage = "User Add Failed";
        setAlertType("error");
        setAlertMessage(errorMessage);
      });
  };

  return (
    <TableContainerStyled>
      <ModalStyled
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CardStyled>
          {mode === "edit" ? (
            <form id="userupdate" onSubmit={handleEditUser}>
              <TextField
                key={"edit1"}
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                name="name"
                defaultValue={formData.name}
              />
              <TextField
                key={"edit2"}
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                defaultValue={formData.email}
              />
              <TextField
                key={"edit3"}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <TextField
                key={"edit4"}
                variant="outlined"
                margin="normal"
                defaultValue={formData.role}
                name="role"
                label="Role"
                type="text"
                placeholder="Role"
                select
                fullWidth
              >
                <MenuItem value={'admin'}>Admin</MenuItem>
                <MenuItem value={'viewer'}>Viewer</MenuItem>
              </TextField>
              <TextField
                key={"edit5"}
                variant="outlined"
                margin="normal"
                defaultValue={formData.locked == true ? 1 : 0}
                name="locked"
                label="Locked"
                type="text"
                placeholder="Locked"
                select
                fullWidth
              >
                <MenuItem value={1}>Yes</MenuItem>
                <MenuItem value={0}>No</MenuItem>
              </TextField>
              {alertMessage && (
                <Alert severity={alertType}>
                  <AlertTitle>{alertType}</AlertTitle>
                  {alertMessage}
                </Alert>
              )}
              <ButtonStyled key={4} type="submit" fullWidth variant="contained">
                Update User
              </ButtonStyled>
              <ButtonStyled
                key={5}
                fullWidth
                variant="contained"
                onClick={handleClose}
              >
                Cancel
              </ButtonStyled>
            </form>
          ) : (
            <form id="useradd" onSubmit={handleAddUser}>
              <TextField
                key={"register1"}
                variant="outlined"
                margin="normal"
                fullWidth
                id="name"
                label="Name"
                name="name"
                defaultValue={formData.name}
                autoFocus
                required
              />
              <TextField
                key={"register2"}
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                required
                defaultValue={formData.email}
              />
              <TextField
                key={"register3"}
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                required
              />
              <TextField
                key={"edit4"}
                variant="outlined"
                margin="normal"
                defaultValue={formData.role}
                name="role"
                label="Role"
                type="text"
                placeholder="Role"
                select
                fullWidth
                required
              >
                <MenuItem value={'admin'}>Admin</MenuItem>
                <MenuItem value={'viewer'}>Viewer</MenuItem>
              </TextField>
              {alertMessage && (
                <Alert severity={alertType}>
                  <AlertTitle>{alertType}</AlertTitle>
                  {alertMessage}
                </Alert>
              )}
              <ButtonStyled key={4} type="submit" fullWidth variant="contained">
                Add User
              </ButtonStyled>
              <ButtonStyled
                key={5}
                fullWidth
                variant="contained"
                onClick={handleClose}
              >
                Cancel
              </ButtonStyled>
            </form>
          )}
        </CardStyled>
      </ModalStyled>
      {localStorage.getItem("role") === "admin" && (
        <div style={{ textAlign: "right", padding: "10px" }}>
          <Button
            variant="contained"
            onClick={() => {
              handleOpen(null);
              setmode("add");
            }}
          >
            Add User
          </Button>
        </div>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCellStyled>Name</TableCellStyled>
            <TableCellStyled>Email</TableCellStyled>
            <TableCellStyled>Role</TableCellStyled>
            <TableCellStyled>Created At</TableCellStyled>
            <TableCellStyled>Locked</TableCellStyled>
            {localStorage.getItem("role") === "admin" && (
              <TableCellStyled>Actions</TableCellStyled>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.created_at}</TableCell>
                <TableCell>{item.locked.toString()}</TableCell>
                {localStorage.getItem("role") === "admin" && (
                  <TableCell>
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                      <Tooltip arrow placement="left" title="Edit">
                        <IconButton
                          onClick={() => {
                            handleOpen(item);
                            setmode("edit");
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow placement="right" title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(item)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainerStyled>
  );
};

export default CrudTable;
