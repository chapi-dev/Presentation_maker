# Challenge 05: Deploy to Azure Container Apps

> **Goal:** Deploy the app to Azure Container Apps with managed identity and RBAC — the real deal!

---

## What You'll Build

```
Azure Container Apps Environment
└── Container App: presentation-maker
    ├── System Managed Identity → "Cognitive Services OpenAI User" role
    ├── Image built in ACR (Azure Container Registry)
    └── Ingress: HTTPS, external, port 3000
```

---

## Steps

### 1. Create a Container Apps Environment

```bash
az containerapp env create \
  --name cae-presentation-maker \
  --resource-group rg-presentation-maker \
  --location eastus2
```

### 2. Deploy Using `az containerapp up`

This single command creates an ACR, builds the image, and deploys:

```bash
az containerapp up \
  --name presentation-maker \
  --resource-group rg-presentation-maker \
  --environment cae-presentation-maker \
  --source . \
  --ingress external \
  --target-port 3000 \
  --build-env-vars \
    "VITE_MSAL_CLIENT_ID=YOUR_APP_CLIENT_ID" \
    "VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID"
```

> `--build-env-vars` passes the MSAL values as build arguments to the Dockerfile.

Note the **FQDN** in the output — that's your app's public URL!

### 3. Enable Managed Identity

```bash
az containerapp identity assign \
  --name presentation-maker \
  --resource-group rg-presentation-maker \
  --system-assigned
```

Note the `principalId` from the output.

### 4. Assign OpenAI RBAC to Managed Identity

```bash
az role assignment create \
  --assignee YOUR_MANAGED_IDENTITY_PRINCIPAL_ID \
  --assignee-object-id YOUR_MANAGED_IDENTITY_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --role "Cognitive Services OpenAI User" \
  --scope "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-presentation-maker/providers/Microsoft.CognitiveServices/accounts/YOUR_OPENAI_RESOURCE_NAME"
```

> **Important:** Use `--assignee-principal-type ServicePrincipal` — this is a managed identity, not a user.

### 5. Set Runtime Environment Variables

```bash
az containerapp update \
  --name presentation-maker \
  --resource-group rg-presentation-maker \
  --set-env-vars \
    "AZURE_OPENAI_ENDPOINT=https://YOUR_OPENAI_RESOURCE.openai.azure.com/" \
    "BING_SEARCH_API_KEY="
```

### 6. Update Entra ID Redirect URIs

Add your Container Apps URL to the SPA redirect URIs:

```bash
# Get your app's object ID
az ad app list --display-name "Presentation Maker" --query "[0].id" --output tsv
```

```bash
az rest --method PATCH \
  --uri "https://graph.microsoft.com/v1.0/applications/YOUR_APP_OBJECT_ID" \
  --headers "Content-Type=application/json" \
  --body "{\"spa\":{\"redirectUris\":[\"http://localhost:5173/\",\"https://YOUR_APP.YOUR_REGION.azurecontainerapps.io/\"]}}"
```

> Include **both** localhost (for development) and the Container Apps URL.

### 7. Test Your Deployment!

Open your Container Apps FQDN in a browser:

```
https://YOUR_APP.YOUR_REGION.azurecontainerapps.io
```

1. Log in with your Microsoft account
2. Enter a topic and number of slides
3. Watch the AI generate your presentation
4. Present in full screen! 🎉

---

## How It All Connects

```
Browser → Container Apps (HTTPS)
  ├── Static files (dist/) → React + MSAL
  └── POST /api/generate → Express
        ├── searchWeb() → Bing (optional)
        └── generateSlides() → Azure OpenAI
              └── Auth: Managed Identity → RBAC → GPT-4o
```

**The magic of managed identity:**
- The container app has a system-assigned identity
- That identity has the "Cognitive Services OpenAI User" role
- `DefaultAzureCredential` in the code automatically discovers and uses it
- **Zero secrets stored anywhere!**

---

## Rebuilding After Code Changes

If you update the code:

```bash
# Find your ACR name
az containerapp show \
  --name presentation-maker \
  --resource-group rg-presentation-maker \
  --query "properties.configuration.registries[0].server" \
  --output tsv

# Build a new image in ACR
az acr build \
  --registry YOUR_ACR_NAME \
  --image presentation-maker:v2 \
  --build-arg VITE_MSAL_CLIENT_ID=YOUR_APP_CLIENT_ID \
  --build-arg "VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID" \
  .

# Update the container app
az containerapp update \
  --name presentation-maker \
  --resource-group rg-presentation-maker \
  --image YOUR_ACR_NAME.azurecr.io/presentation-maker:v2
```

---

## Cost Management

To avoid unexpected charges:

```bash
# Stop the app (scale to 0)
az containerapp update \
  --name presentation-maker \
  --resource-group rg-presentation-maker \
  --min-replicas 0 \
  --max-replicas 1

# Or delete everything when done
az group delete --name rg-presentation-maker --yes --no-wait
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `redirect_uri_mismatch` | Add Container Apps URL to SPA redirect URIs (Step 6) |
| `AuthenticationError` from OpenAI | Check managed identity is enabled + has RBAC role |
| Container keeps restarting | Check logs: `az containerapp logs show --name presentation-maker -g rg-presentation-maker` |
| Build fails in ACR | Make sure `.dockerignore` excludes `node_modules` and `.env` |
| 502 Bad Gateway | The app may still be starting — wait 30 seconds and refresh |

---

## ✅ Success Criteria

- [ ] Container Apps environment created
- [ ] App deployed and accessible via HTTPS
- [ ] Managed identity enabled and has "Cognitive Services OpenAI User" role
- [ ] Entra ID redirect URIs include the Container Apps URL
- [ ] You can log in and generate presentations from the deployed app
- [ ] No secrets stored in code, config, or environment (only RBAC!)

---

## 🎉 Congratulations!

You've built and deployed a full AI-powered web application on Azure with:
- ✅ React + TypeScript + Tailwind CSS frontend
- ✅ Express.js backend calling Azure OpenAI
- ✅ Microsoft Entra ID authentication
- ✅ Docker containerization
- ✅ Azure Container Apps deployment
- ✅ Managed identity + RBAC (zero secrets!)

---

**Previous:** [Challenge 04 — Containerize](04-containerize.md) | **Back to:** [README](../README.md)
