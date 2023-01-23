/** @format */

import ScrollToTop from "@/base-components/scroll-to-top/Main";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Router from "./router";
import Login from "./views/login/Main";
import {
  Auth0Provider,
  useAuth0,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
function App() {
  const { user, isAuthenticated } = useAuth0();
  console.log({ user, isAuthenticated });
  const userRoles =
    user && user["http:///dev-v4v3gc245y1g6wg1.us.auth0.com/roles"];
  // const userHasAccess = userRoles.some(function (role) {
  //   return "React Admin" === role;
  // });
  console.log({ userRoles });
  // const userRoles = user && user["http://localhost:3006/roles"];
  // const userHasAccess = userRoles.some(function (role) {
  //   return "React Admin" === role;
  // });
  // console.log(userHasAccess);

  return (
    <RecoilRoot>
      <BrowserRouter>
        {isAuthenticated ? <Router /> : <Login />}

        <ScrollToTop />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
