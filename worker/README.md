# Adil Rahman Portfolio — Cloudflare Worker Gateway (Supabase Backend)

High-performance Cloudflare Worker backend gateway for [adilrahman.cc](https://adilrahman.cc).

## Features
- **Supabase Relational Database**: Direct edge integration with Supabase PostgREST:
  - `GET /api/projects`: Fetches active portfolio projects.
  - `GET /api/saas`: Fetches dedicated SaaS products.
  - `GET /api/reviews`: Fetches approved reviews.
  - `POST /api/reviews`: Adds client reviews directly into Supabase `reviews` table.
  - `POST /api/requirements`: Adds client quote inquiries directly into Supabase `requirements` table.
- **AI Chat Endpoint** (`/api/chat`): Powers the interactive portfolio assistant with OpenAI `gpt-4.1-nano` / `gpt-4o-mini`, custom guardrails, and tool calling (`submit_requirement`). When leads are captured, they are stored directly into Supabase `requirements`.
- **Google Apps Script Bridge**: Dispatches instant email notification triggers to Apps Script, and Apps Script runs a daily 9:00 AM digest that queries Supabase.
- **Secured Environment Variables & Secrets**: Keeps all database keys and AI credentials securely on Cloudflare Edge.

---

## Supabase Database Setup

1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy the entire contents of [`supabase_schema.sql`](./supabase_schema.sql) and paste it into the editor.
4. Click **Run**.
   - This creates `projects`, `saas`, `reviews`, and `requirements` tables.
   - Sets up Row Level Security (RLS) policies.
   - Seeds your initial 13 portfolio projects and verified reviews.

---

## Worker Configuration & Secrets

### 1. Configure `wrangler.toml`
Set your public Supabase URL in `worker/wrangler.toml`:
```toml
[vars]
SUPABASE_URL = "https://your-project-id.supabase.co"
APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_EXEC_ID/exec"
MODEL_PRIMARY = "gpt-4.1-nano"
```

### 2. Set Worker Secrets
In terminal from the `worker/` folder:
```bash
# Add your Supabase Anon or Service Role key
npx wrangler secret put SUPABASE_ANON_KEY

# Add your OpenAI / OpenRouter API key
npx wrangler secret put OPENAI_API_KEY
```

### 3. Local Development (`.dev.vars`)
Create a `worker/.dev.vars` file for local testing:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_or_openrouter_key
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_EXEC_ID/exec
```

Run locally:
```bash
npm run dev
```

### 4. Deploy to Cloudflare
```bash
npm run deploy
```
