import { Warning } from "@mui/icons-material";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react"; 
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header"; 
import "./Login.css"; 

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const person = { 
    username: "",
    password:"",
  }
  const [Users, setUsers] = useState(person);
  const [isLoading, setIsLoading] = useState(false);
  
  const history = useHistory();
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    const FullFormData = { ...formData };
    
    try {
      setIsLoading(true)
      const response = await axios.post(`${config.endpoint}/auth/login`, FullFormData)
      const data = response.data;
      setIsLoading(false);

      persistLogin(data.token, data.username, data.balance);
      
        enqueueSnackbar("Logged in successfully", { variant: "success", autoHideDuration: 2000  })
        history.push("/", { from: "Login" });
    
        } catch (error) {
          setIsLoading(true)
          if (error.response.status === 400 && error.response) {
          setIsLoading(false);
          // The request was made but no response was received error 400...
          return enqueueSnackbar(error.response.data.message, { variant: "error", autoHideDuration: 2000  })
          } else {
            setIsLoading(false);
          // Something happened in setting up the request that triggered an Error
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error", autoHideDuration: 2000  });
        }
      }
    };

    // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
    /**
     * Validate the input values so that any bad or illegal values are not passed to the backend.
     *
     * @param {{ username: string, password: string }} data
     *  Object with values of username, password and confirm password user entered to register
     *
     * @returns {boolean}
     *    Whether validation has passed or not
     *
     * Return false and show warning message if any validation condition fails, otherwise return true.
     * (NOTE: The error messages to be shown for each of these cases, are given with them)
     * -    Check that username field is not an empty value - "Username is a required field"
     * -    Check that password field is not an empty value - "Password is a required field"
     */
    const validateInput = (data) => {
      let validData = {...data}

      if (!validData.username) {
        enqueueSnackbar("Username is a required field", { variant: 'warning' });
        return false;
      }
      if (!validData.password) {
        enqueueSnackbar("Password is a required field", { variant: 'warning' });
        return false;
      }
      return login(validData);
    };
 
    // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
    /**
     * Store the login information so that it can be used to identify the user in subsequent API calls
     *
     * @param {string} token
     *    API token used for authentication of requests after logging in
     * @param {string} username
     *    Username of the logged in user
     * @param {string} balance 
     *    Wallet balance amount of the logged in user
     *
     * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
     * -    `token` field in localStorage can be used to store the Oauth token
     * -    `username` field in localStorage can be used to store the username that the user is logged in as
     * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
     */
  
  const handleInput = (error) => {
      const name = error.target.name;
      const value = error.target.value;
      setUsers(Users => ({ ...Users, [name]: value }))
  };
  
  const persistLogin = (token, username, balance) => {
    // let url = "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage";
    // let response = axios.get(url);

    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);
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
            <h2 className="title">Login</h2>
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
            <div>
              {(isLoading === true) ? <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress color="success" />
              </Box>
                :
                <Button className="button" variant="contained"
                  onClick={() => validateInput(Users)}>
                    LOGIN TO QKART
                </Button>}  
            </div>
            <p className="secondary-action">
              Don't have an account? {" "}
              <Link className="link" to="/register">
                Register Now
              </Link>
            </p>
          </Stack>
        </Box>
        <Footer />
      </Box>
    );
  };

export default Login;
