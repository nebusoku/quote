# Quote Assistant Deployment

This repository contains a simple web application and an n8n workflow used to collect project information, query Autotask, call a Custom GPT, and archive files to SharePoint.

## Prerequisites

* Docker and Docker Compose
* An existing n8n instance reachable at `https://${N8N_DOMAIN}`
* Autotask, OpenAI, and Microsoft Graph credentials configured in n8n
* A Cloudflare Tunnel token for exposing the web interface
* Azure AD application (client ID and tenant ID) for Microsoft sign‑in

## Environment Variables

Create a `.env` file or define the following variables in Portainer when deploying the stack:

| Variable | Description |
|----------|-------------|
| `AAD_CLIENT_ID` | Azure AD application client ID |
| `AAD_TENANT_ID` | Azure AD tenant ID |
| `CLOUDFLARED_TOKEN` | Token for Cloudflare Tunnel |
| `N8N_DOMAIN` | Domain for the n8n instance |
| `QUOTE_DOMAIN` | Domain for the web interface |

## Run the Web App

```bash
docker compose up -d --build
```

The web interface will be available on port `3000` locally and via the Cloudflare tunnel at `https://${QUOTE_DOMAIN}` once DNS is configured.

## Import the n8n Workflow

1. Log in to `https://${N8N_DOMAIN}`.
2. From the **Workflows** view, choose **Import from File** and select `n8n-workflow.json`.
3. Assign credentials to the following nodes:
   * **Autotask Lookup** – Autotask API credentials
   * **OpenAI** – API key with access to the Custom GPT
   * **Upload to SharePoint** – Microsoft Graph credentials with permission to write to the target site
4. Activate the workflow and note the webhook URL (`/webhook/project`).

## Usage

1. Open `https://${QUOTE_DOMAIN}`.
2. Sign in with Microsoft.
3. Enter project details and optionally upload files.
4. Submitted information is sent to n8n, which verifies the customer in Autotask, queries the Custom GPT, stores files in SharePoint, and returns GPT output to the web page.

## Development

The web service runs a small Node/Express server that injects environment variables into a static HTML page using MSAL for Azure AD sign‑in.

```bash
cd web
npm install
npm start
```

## Files

* `docker-compose.yml` – Stack definition for the web app and Cloudflare tunnel
* `web/` – Source for the front‑end server
* `n8n-workflow.json` – Importable workflow for n8n
