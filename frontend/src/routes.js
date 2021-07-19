import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import CreateUserForm from "./components/CreateUserForm";
import SignPage from "./pages/Sign";
import MainPage from "./pages/Main";
import LoginPage from "./pages/Login";
import { CampanhaForm } from "./components/CampanhaForm";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import ChangePasswordPage from "./pages/ChangePasswordPage";

export const isAuthenticated = () => {
  const jwt = localStorage.getItem("@tcc/jwt");

  if (!jwt || jwt === "undefined") {
    console.log("NOT AUTHENTICATED");
    return false;
  }

  console.log("AUTHENTICATED");
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);

export const isRegistryPath = () => /registro/.test(window.location);

const Routes = () => (
  <Switch>
    <PrivateRoute exact path="/" component={MainPage} />
    <PrivateRoute exact path="/user" to={"/user"} component={CreateUserForm} />
    <Route
      exact
      path="/forgotPassword"
      to={"/forgotPassword"}
      component={ForgotPasswordPage}
    />
    <Route
      path="/resetPassword"
      to={"/resetPassword"}
      component={ResetPasswordPage}
    />
    <PrivateRoute
      exact
      path="/campanha"
      to={"/campanha"}
      component={CampanhaForm}
    />
    <PrivateRoute
      exact
      path="/campanha/:id"
      to={"/campanha"}
      component={MainPage}
    />
    <PrivateRoute
      exact
      path="/campanha/:id/registro"
      to={"/campanha"}
      component={MainPage}
    />
    <PrivateRoute path="/registro" to={"/registro"} component={MainPage} />
    <PrivateRoute
      exact
      path="/changePassword"
      to={"/changePassword"}
      component={ChangePasswordPage}
    />

    <Route exact path="/sign" component={SignPage} />
    <Route exact path="/login" to={"/login"} component={LoginPage} />
    <Route component={() => <h1>Not found</h1>} />
  </Switch>
);

export default Routes;
