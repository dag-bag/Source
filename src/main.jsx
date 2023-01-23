/** @format */

import { createRoot } from "react-dom/client";
import App from "./App";
import "./assets/css/app.css";
import {
  Auth0Provider,
  useAuth0,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Auth0Provider
    domain="dev-v4v3gc245y1g6wg1.us.auth0.com"
    clientId="bZHyBRVR1bu6HCB1HXmwnWvFS2cTrPCn"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
