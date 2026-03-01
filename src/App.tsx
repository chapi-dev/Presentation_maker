import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth/msalConfig";
import HomePage from "./pages/HomePage";
import PresentationPage from "./pages/PresentationPage";
import LoginPage from "./pages/LoginPage";

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <UnauthenticatedTemplate>
          <LoginPage />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/present" element={<PresentationPage />} />
          </Routes>
        </AuthenticatedTemplate>
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;
