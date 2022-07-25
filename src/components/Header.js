

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";
import { useSnackbar } from "notistack";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const username = localStorage.getItem("username");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  let logOut = () => {
    localStorage.clear();
    window.location.reload();
    enqueueSnackbar("Logged Out Successfully", { variant:"success" })
    history.push("/", { from: "Header" })
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons ? (
          <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={() => {
              history.push("/")
            }}
            
        >
          Back to explore
        </Button>
        ) : username ? (
             <Stack direction="row" spacing={2} alignItems="center" key="logout">
              <Avatar src="avatar.png" alt="crio.do"/>
              <p style={{ marginTop: "0.1rem" }}>{username}</p>
              <Button
                variant="text"
                onClick={logOut}>
                LOGOUT
              </Button>
            </Stack>
          ) : (
               <Stack direction="row" spacing={2} alignItems="center" key="login">
                <Button variant="text" onClick={() => history.push("/login")}>
                  LOGIN
                </Button>
                <Button
                  name="logout"
                  variant="contained"
                  onClick={()=>history.push("/register")}
                >
                  REGISTER
                </Button>
              </Stack>
        )
      }
        
      </Box>
    );
};

export default Header;



// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Avatar, Button, Stack } from "@mui/material";
// import Box from "@mui/material/Box";
// import React from "react";
// import "./Header.css"; 
// import { useSnackbar } from "notistack";
// import { useHistory, Link } from "react-router-dom";

// const Header = ({ children, hasHiddenAuthButtons }) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const history = useHistory();
  
//   const backToExplore = () => {
//     history.push("/")
//   }
  
//   const exploreButton =
//     <Box>
//       <Button className="explore-button"
//         startIcon={<ArrowBackIcon />}
//         variant="text"
//         onClick={backToExplore}
//         >
//         BACK TO EXPLORE
//         </Button>
//       </Box>

//   let logOut = () => {
//     localStorage.clear();
//     window.location.reload();
//     enqueueSnackbar("Logged Out Successfully", { variant:"success" })
//     history.push("/", { from: "Header" })
//   }

//   const logInRegisterButton =
//     <Stack direction="row" spacing={2} alignItems="center" key="login">
//       <Link className="link" to="/login"><Button variant="text">LOGIN</Button></Link>
//       <Link className="link" to="/register"><Button variant="contained">REGISTER</Button></Link>
//     </Stack>
  
//   const userLogoutButton =
//     <Stack direction="row" spacing={2} alignItems="center" key="logout">
//     <Avatar src="avatar.png" alt="crio.do"/>
//       <b>{localStorage.getItem("username")}</b>
//       <Button className="link" onClick={logOut}>
//         LOGOUT
//       </Button>
//     </Stack>

//   let buttonCheck = localStorage.getItem("username") ? [children, userLogoutButton]:[children, logInRegisterButton]
    
//     return ( 
//       <Box className="header">
//         <Box className="header-title">
//             <img src="logo_light.svg" alt="QKart-icon"></img>
//         </Box>
//         { hasHiddenAuthButtons? buttonCheck : exploreButton }
//       </Box>
//     ); 
// };

// export default Header;

