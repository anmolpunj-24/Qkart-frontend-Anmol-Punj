import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer"; 
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const person = { 
    username: "", 
    password:"",
    confirmPassword:""
  }
  const [Users, setUsers] = useState(person);
  const [isLoading, setIsLoading] = useState(false);
  
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string,  : string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    const FullFormData = {...formData};
        
    try {
      setIsLoading(true)
        const response = await axios.post(`${config.endpoint}/auth/register`, FullFormData);
        const data = response.data;
      setIsLoading(false);
        enqueueSnackbar("Registered successfully", { variant: "success", autoHideDuration: 2000 })
        history.push("/login", { from: "Register" });
    } catch (error) {
      setIsLoading(true)
      if (error.response.status === 400 && error.response) {
      setIsLoading(false);
        // The request was made but no response was received error 400...
        return enqueueSnackbar(error.response.data.message, { variant: "error", autoHideDuration: 2000 });
      } else {
        setIsLoading(false);
        // Something happened in setting up the request that triggered an Error
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error", autoHideDuration: 2000 });
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const handleInput = (error) => {
    const name = error.target.name;
    const value = error.target.value;
    setUsers(Users => ({ ...Users, [name]: value }))
  };
 
  const validateInput = (data) => {
    let validData = {...data}
    
    if (!validData.username) {
      enqueueSnackbar("Username is a required field", { variant: 'warning' });
      return false;
    }
    if (validData.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", { variant: 'warning' });
      return false;
    }
    if (!validData.password) {
      enqueueSnackbar("Password is a required field", { variant: 'warning' });
      return false;
    }
    if (validData.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: 'warning' });
      return false;
    }
    if (validData.password !== validData.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: 'warning' });
      return false;
    }
    delete validData.confirmPassword;
    return register(validData);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons = {true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={Users.username}
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            title="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={Users.password}
            onChange={handleInput}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            title="Confirm Password"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={Users.confirmPassword}
            onChange={handleInput}
          />
          <div>
            {(isLoading === true) ? <Box sx={{ display: "flex", justifyContent: "center"}}>
              <CircularProgress color="success" />
            </Box>
              :
              <Button className="button" variant="contained"
                onClick={() => validateInput(Users)}>
            Register Now
            </Button>} 
          </div>
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login Here
             </Link>
          </p> 
        </Stack>
      </Box>
      <Footer />
    </Box> 
  );
};

export default Register;
