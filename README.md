# Estudio Verde Hong

Estudio Verde Hong is a React and TypeScript catalogue for indoor plants with local pickup in Madrid and Toledo.

## Local development

```bash
npm install
copy .env.example .env
npm run dev
```

### Environment variables

Set the following in `.env`:
- `VITE_FACEBOOK_URL`: Facebook page URL.
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase anon/publishable key.

## Supabase Setup

1. Open your Supabase project dashboard.
2. In the **SQL Editor**, open a new query, paste the content of `supabase/schema.sql`, and execute it (**Run**).
   - This creates the `plants` and `store_settings` tables with Row Level Security (RLS).
   - Sets up the `plants` storage bucket for uploaded images.
   - Enables Realtime subscriptions.
   - Populates initial plant and settings data.
3. In **Authentication > Users**, click **Add user** to create your admin account (e.g., `honglin@estudioverde.com` with a secure password).

## Available commands

- `npm run dev`: start the Vite development server.
- `npm run lint`: check TypeScript and React source with ESLint.
- `npm run build`: type-check and create the production build in `dist/`.
- `npm run preview`: serve the production build locally.
