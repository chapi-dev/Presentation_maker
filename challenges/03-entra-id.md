# Challenge 03: Entra ID Authentication

> **Goal:** Add Microsoft login so only authenticated users can generate presentations.

---

## What Changes

Until now, `VITE_AUTH_DISABLED=true` in your `.env` skips login entirely. In this challenge you'll:

1. Create a Microsoft Entra ID app registration
2. Configure MSAL (Microsoft Authentication Library)
3. Set `VITE_AUTH_DISABLED=false` — now users must sign in via a Microsoft popup

---

## Steps

### 1. Create an App Registration

```bash
az ad app create \
  --display-name "Presentation Maker" \
  --sign-in-audience AzureADMyOrg
```

> `AzureADMyOrg` limits sign-in to your tenant. Use `AzureADandPersonalMicrosoftAccount` for personal accounts too.

Note the `appId` from the output — you'll need it.

### 2. Get Your App ID and Tenant ID

```bash
# App (Client) ID
az ad app list --display-name "Presentation Maker" --query "[0].appId" --output tsv

# Tenant ID
az account show --query tenantId --output tsv
```

### 3. Configure the SPA Redirect URIs

For a **Single-Page Application (SPA)**, you must register the redirect URIs where Microsoft will return users after login.

```bash
# Get the app's object ID (different from appId!)
az ad app list --display-name "Presentation Maker" --query "[0].id" --output tsv
```

Then update the app with SPA redirect URIs:

```bash
az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications/YOUR_APP_OBJECT_ID" \
  --headers "Content-Type=application/json" \
  --body "{\"spa\":{\"redirectUris\":[\"http://localhost:5173/\"]}}"
```

> **PowerShell users:** If the inline JSON doesn't work, write the body to a temp file:
> ```powershell
> $body = '{"spa":{"redirectUris":["http://localhost:5173/"]}}'
> [System.IO.File]::WriteAllText("$env:TEMP\body.json", $body)
> az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/YOUR_APP_OBJECT_ID" --headers "Content-Type=application/json" --body "@$env:TEMP\body.json"
> ```

### 4. Update Your `.env`

```env
# Disable auth bypass — require real login now!
VITE_AUTH_DISABLED=false

# Your Entra ID app registration
VITE_MSAL_CLIENT_ID=YOUR_APP_CLIENT_ID
VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID
```

> The `VITE_` prefix is required — Vite only exposes env vars with this prefix to the frontend.

### 5. Test Login

```bash
npm run dev
```

1. Open `http://localhost:5173`
2. Click "Sign in with Microsoft"
3. A popup appears — sign in with your Microsoft account
4. After login you should see the home page with the topic input form

---

## How the Code Works

### MSAL Configuration — `src/auth/msalConfig.ts`

```typescript
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: window.location.origin + "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};
```

### App Root — `src/App.tsx`

The app checks `VITE_AUTH_DISABLED`:

```tsx
// Dev mode — skip login entirely
if (import.meta.env.VITE_AUTH_DISABLED === 'true') {
  return <AppRoutes />; // user = { name: "Developer" }
}

// Production — full MSAL auth
return (
  <MsalProvider instance={msalInstance}>
    <UnauthenticatedTemplate><LoginPage /></UnauthenticatedTemplate>
    <AuthenticatedTemplate><AuthenticatedApp /></AuthenticatedTemplate>
  </MsalProvider>
);
```

**Key concepts:**
- `VITE_AUTH_DISABLED=true` → no MSAL, no login — great for local dev
- `VITE_AUTH_DISABLED=false` → full OAuth2 PKCE flow via MSAL
- `UnauthenticatedTemplate` / `AuthenticatedTemplate` toggle based on login state

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Popup blocked | Allow popups for `localhost:5173` in your browser |
| `redirect_uri_mismatch` | Make sure `http://localhost:5173/` is in your SPA redirect URIs (trailing slash matters!) |
| `AADSTS700054` | The `response_type` is wrong — make sure it's registered as a **SPA** platform, not Web |
| Login works but page is blank | Check browser console for MSAL errors |

---

## ✅ Success Criteria

- [ ] App registration created in Entra ID
- [ ] SPA redirect URI `http://localhost:5173/` configured
- [ ] `.env` updated: `VITE_AUTH_DISABLED=false`, Client ID and Authority set
- [ ] You see the login page at `http://localhost:5173`
- [ ] You can log in with your Microsoft account
- [ ] After login you see the presentation generator form

---

**Previous:** [Challenge 02 — Bing Search](02-bing-search.md) | **Next:** [Challenge 04 — Containerize](04-containerize.md)
