import React, { useState } from 'react';
import { styled } from '@mui/system';
import {
  Card,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  AlertTitle,
  AlertColor
} from '@mui/material';
import apiCalls from "../backend/apiCalls";


const ContainerStyled = styled(Container)({
  marginTop: '20px',
  backgroundColor: "#FFFFFF",
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100vh - 120px)', 
  justifyContent: 'center',
});

const CardStyled = styled(Card)({
  padding: '20px',
  boxShadow: '0px 0px 10px #D5D5D5'
});

const ButtonStyled = styled(Button)({
  marginTop: '16px',
});

const Auth = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AlertColor | undefined>(undefined);

  const handleFormChange = (form: any) => {
    setAlertMessage('');
    setAlertType(undefined);
    setActiveForm(form);
  };

  const handleLogin = async (event: any) => {
    setAlertMessage('');
    setAlertType(undefined);
    event.preventDefault();
    const payload = {
      email: event.target.elements.email.value,
      password: event.target.elements.password.value
    }
    await apiCalls.loginApi(payload).then((data) => {
      localStorage.setItem("token", data?.data.access_token);
      localStorage.setItem("role", data?.data.role);
      window.location.href = "/";
    })
      .catch((err) => {
        let errorMessage = 'Login failed. Please try again.';
        if (err.response && err.response.status === 401) {
          errorMessage = 'Email/Password Incorrect';
        }
        setAlertType('error');
        setAlertMessage(errorMessage);
      });
  };

  const handleRegister = async (event: any) => {
    setAlertMessage('');
    setAlertType(undefined);
    event.preventDefault();
    const payload = {
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      password: event.target.elements.password.value
    }
    await apiCalls.registerApi(payload).then(() => {
      setActiveForm('login');
    })
      .catch((err) => {
        let errorMessage = 'Registration failed. Please try again.';
        if (err.response && err.response.status === 409) {
          errorMessage = err.response.data;
        }
        setAlertType('error');
        setAlertMessage(errorMessage);
      });
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'login':
        return (
          <form id='login' onSubmit={handleLogin}>
            <TextField
              key={'login1'}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
            />
            <TextField
              key={'login2'}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            {alertMessage && (
              <Alert severity={alertType}>
                <AlertTitle>{alertType}</AlertTitle>
                {alertMessage}
              </Alert>
            )}
            <ButtonStyled
              key={3}
              type="submit"
              fullWidth
              variant="contained"
            >
              Login
            </ButtonStyled>
            <ButtonStyled
              key={5}
              onClick={() => handleFormChange('register')}
              fullWidth
              variant="text"
            >
              Register
            </ButtonStyled>
          </form>
        );
      case 'register':
        return (
          <form id='register' onSubmit={handleRegister}>
            <TextField
              key={'register1'}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
            />
            <TextField
              key={'register2'}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
            />
            <TextField
              key={'register3'}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            {alertMessage && (
              <Alert severity={alertType}>
                <AlertTitle>{alertType}</AlertTitle>
                {alertMessage}
              </Alert>
            )}
            <ButtonStyled
              key={4}
              type="submit"
              fullWidth
              variant="contained"
            >
              Register
            </ButtonStyled>
            <ButtonStyled
              key={2}
              onClick={() => handleFormChange('login')}
              fullWidth
              variant="text"
            >
              Login
            </ButtonStyled>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ContainerStyled maxWidth="xs">
        <CardStyled>
          <Typography variant="h5" component="h1" align="center">
            {activeForm === 'forgotPassword' ? 'Forgot Password' : activeForm === 'login' ? "Login" : activeForm === 'resetPassword' ? "Reset Password" : "Register"}
          </Typography>
          {renderForm()}
        </CardStyled>
      </ContainerStyled>
    </>
  );
};

export default Auth;