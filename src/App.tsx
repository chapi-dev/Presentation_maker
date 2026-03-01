import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth/msalConfig";
import { AuthProvider } from "./auth/AuthContext";
import HomePage from "./pages/HomePage";
import PresentationPage from "./pages/PresentationPage";
import LoginPage from "./pages/LoginPage";

const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === "true";

const msalInstance = AUTH_DISABLED ? null : new PublicClientApplication(msalConfig);

/** Wraps routes with auth context populated from MSAL */
function AuthenticatedApp() {
  const { instance, accounts } = useMsal();
  const user = accounts[0];

  return (
    <AuthProvider
      value={{
        user: user
          ? { name: user.name || "User", username: user.username || "" }
          : null,
        logout: () => instance.logoutPopup(),
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/present" element={<PresentationPage />} />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  // Dev mode — no Microsoft login required
  if (AUTH_DISABLED || !msalInstance) {
    return (
      <AuthProvider
        value={{
          user: { name: "Developer", username: "dev@local" },
          logout: () => {},
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/present" element={<PresentationPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }

  // Production — full MSAL auth
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <UnauthenticatedTemplate>
          <LoginPage />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <AuthenticatedApp />
        </AuthenticatedTemplate>
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;
