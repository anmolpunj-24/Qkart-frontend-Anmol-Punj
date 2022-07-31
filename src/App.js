import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products"; 
import { ThemeProvider } from "@mui/system";
import theme from "./theme";
import Checkout from "./components/Checkout";
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};
 
function App() {  
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <div className="App">
          <BrowserRouter>
            <Switch>
                <Route exact path="/register">
                  <Register />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/">
                  <Products />
                </Route>
                <Route exact path="/checkout">
                  <Checkout />
                </Route>
            </Switch>
          </BrowserRouter>
          {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          {/* <Login /> */}
        </div>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
