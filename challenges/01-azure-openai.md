# Challenge 01: Azure OpenAI

> **Goal:** Switch from a regular OpenAI API key to Azure OpenAI with managed authentication — no keys in production!

---

## Why Azure OpenAI?

In Challenge 00 you used an OpenAI API key. That works great for local dev, but for production you want:

- **No secrets to manage** — `DefaultAzureCredential` replaces API keys
- **Enterprise compliance** — data stays in your Azure region
- **RBAC access** — granular control over who can call the model
- **Managed identity** — zero credentials stored anywhere when deployed to Azure

---

## Prerequisites

| Tool | Install |
|------|---------|
| Azure CLI | [Install Guide](https://learn.microsoft.com/cli/azure/install-azure-cli) |
| Azure subscription | [Free Trial](https://azure.microsoft.com/free/) |

```bash
az --version    # Confirm installed
az login        # Sign in to your account
```

---

## Steps

### 1. Create a Resource Group

```bash
az group create \
  --name rg-presentation-maker \
  --location eastus2
```

> Pick a region that supports Azure OpenAI. See [available regions](https://learn.microsoft.com/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability).

### 2. Create an Azure OpenAI Resource

```bash
az cognitiveservices account create \
  --name YOUR_OPENAI_RESOURCE_NAME \
  --resource-group rg-presentation-maker \
  --location eastus2 \
  --kind OpenAI \
  --sku-name S0
```

Replace `YOUR_OPENAI_RESOURCE_NAME` with a unique name (e.g., `oai-yourname-presentmaker`).

### 3. Deploy the GPT-4o Model

```bash
az cognitiveservices account deployment create \
  --name YOUR_OPENAI_RESOURCE_NAME \
  --resource-group rg-presentation-maker \
  --deployment-name gpt-4o \
  --model-name gpt-4o \
  --model-version 2024-08-06 \
  --model-format OpenAI \
  --sku-name Standard \
  --sku-capacity 10
```

> The deployment name **must be `gpt-4o`** — the code references it by this name.

### 4. Get Your Endpoint

```bash
az cognitiveservices account show \
  --name YOUR_OPENAI_RESOURCE_NAME \
  --resource-group rg-presentation-maker \
  --query properties.endpoint \
  --output tsv
```

### 5. Assign RBAC Role to Your User

```bash
# Get your user object ID
az ad signed-in-user show --query id --output tsv
```

```bash
# Assign the role
az role assignment create \
  --assignee YOUR_USER_OBJECT_ID \
  --role "Cognitive Services OpenAI User" \
  --scope "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-presentation-maker/providers/Microsoft.CognitiveServices/accounts/YOUR_OPENAI_RESOURCE_NAME"
```

> **Why "Cognitive Services OpenAI User"?** Least privilege — allows inference but no management access.

### 6. Update Your `.env`

Comment out the OpenAI key and enable Azure OpenAI:

```env
# ── AI Provider ──
# Comment out the OpenAI key:
# OPENAI_API_KEY=sk-xxxxxxxx
# OPENAI_MODEL=gpt-4o-mini

# Uncomment Azure OpenAI:
AZURE_OPENAI_ENDPOINT=https://YOUR_OPENAI_RESOURCE_NAME.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o
```

### 7. Test It

```bash
az login    # Refresh your credentials
npm run dev
```

The server log should show: `✓ Using Azure OpenAI with DefaultAzureCredential`

---

## How the Code Works

Check `server/services/openai.ts` — it auto-detects which provider to use:

```typescript
function createClient(): OpenAI {
  // Priority 1: Regular OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    return new OpenAI({ apiKey: openaiKey });
  }

  // Priority 2: Azure OpenAI + DefaultAzureCredential
  if (process.env.AZURE_OPENAI_ENDPOINT) {
    const credential = new DefaultAzureCredential();
    const azureADTokenProvider = getBearerTokenProvider(
      credential, "https://cognitiveservices.azure.com/.default"
    );
    return new AzureOpenAI({ endpoint, azureADTokenProvider, ... });
  }
}
```

**`DefaultAzureCredential`** tries multiple auth methods in order:
1. Environment variables → 2. Managed Identity → 3. Azure CLI (`az login`) → 4. etc.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `AuthenticationError` | Run `az login` again and make sure you have the RBAC role |
| `DeploymentNotFound` | Verify the deployment name is exactly `gpt-4o` |
| `disableLocalAuth` | Your subscription enforces Entra-only auth — that's fine, we use `DefaultAzureCredential` |
| `QuotaExceeded` | Request a quota increase or lower `sku-capacity` |
| Still using OpenAI key | Make sure `OPENAI_API_KEY` is commented out in `.env` |

---

## ✅ Success Criteria

- [ ] Azure OpenAI resource created with GPT-4o deployed
- [ ] RBAC role "Cognitive Services OpenAI User" assigned to your user
- [ ] `.env` updated — OpenAI key commented out, Azure endpoint set
- [ ] Server log shows `✓ Using Azure OpenAI with DefaultAzureCredential`
- [ ] App generates slides using Azure OpenAI

---

**Previous:** [Challenge 00 — Run Locally](00-local-setup.md) | **Next:** [Challenge 02 — Bing Search](02-bing-search.md)
