# Estudio Verde Hong

Estudio Verde Hong is a React and TypeScript catalogue for indoor plants with local pickup in Madrid and Toledo.

## Local development

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_FACEBOOK_URL` in `.env` to the business Facebook page or Messenger URL. Vite exposes this value to the browser, so do not place secrets in it.

## Available commands

- `npm run dev`: start the Vite development server.
- `npm run lint`: check TypeScript and React source with ESLint.
- `npm run build`: type-check and create the production build in `dist/`.
- `npm run preview`: serve the production build locally.

Application code is in `src/`, image assets are in `public/plants/`, and catalogue data is in `src/data/plants.ts`.
