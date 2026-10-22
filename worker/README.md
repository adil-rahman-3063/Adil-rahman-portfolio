# Adil Rahman Portfolio — Cloudflare Worker Gateway

High-performance Cloudflare Worker backend for [adilrahman.cc](https://adilrahman.cc).

## Features
- **AI Chat Endpoint** (`/api/chat`): Powers the interactive portfolio assistant with OpenAI `gpt-4.1-nano` / `gpt-4o-mini`, custom guardrails, and tool calling (`submit_requirement`).
- **Google Sheets Proxy** (`/api/projects`, `/api/reviews`, `/api/requirements`): Secure CORS gateway to the portfolio's Google Apps Script backend.
- **Environment Variables & Secrets**: Keeps API keys, model names, and Google Sheets URLs safely off the client side.

## Setup & Deployment

### 1. Install Wrangler
```bash
npm install
```

### 2. Set OpenAI API Key Secret
```bash
npx wrangler secret put OPENAI_API_KEY
```

### 3. Local Development
Create a `.dev.vars` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
MODEL_PRIMARY=gpt-4.1-nano
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbx9kD2SMJtPkG9g4I-1nkL7FJvNgeHEMeaBhaMmjfAU74ughomLS95mpkGeu8zteGikfw/exec
```

Run locally:
```bash
npm run dev
```

### 4. Deploy to Cloudflare
```bash
npm run deploy
```
