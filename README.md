# WovenVibes Store Static Assets

This repository contains the prebuilt assets for the WovenVibes storefront.

## Configuration

Sensitive credentials are no longer embedded in the frontend bundle. A `config.js` file in the `wovenvibes-graphql-fixed/wovenvibes-store/dist` directory provides runtime configuration.

1. Copy `config.example.js` to `config.js`:
   ```bash
   cp wovenvibes-graphql-fixed/wovenvibes-store/dist/config.example.js wovenvibes-graphql-fixed/wovenvibes-store/dist/config.js
   ```
2. Edit `config.js` and set the following values:
   - `SHOPIFY_DOMAIN` – your Shopify store domain
   - `SHOPIFY_ACCESS_TOKEN` – a private app or custom app storefront API token
   - `SUPABASE_PROJECT_URL` – your Supabase project URL
   - `SUPABASE_PROXY_URL` – endpoint that proxies Shopify requests
   - `SUPABASE_ANON_KEY` – Supabase anon key used by the frontend

The HTML page loads this file before the main script so the bundle accesses these globals at runtime.

## Security

Do **not** commit real credentials to this repository. Instead, provide them in `config.js` during deployment.

## Server Functions

The `functions` directory contains Node.js modules for Shopify integration:

- `syncProduct.js` – imports a product from Shopify and upserts it into a Supabase table.
- `shopifyWebhook.js` – Express application that validates Shopify webhooks and stores order/fulfillment data in Supabase.

These files require environment variables for Shopify and Supabase credentials. They are provided as examples and may need adaptation for your deployment (e.g. running as Supabase Edge Functions or another serverless platform).

## Development

Install Node.js dependencies to run the example scripts:

```bash
npm install
```

Test loading the modules locally:

```bash
node -e "require('./functions/syncProduct.js'); require('./functions/shopifyWebhook.js'); console.log('loaded');"
```
