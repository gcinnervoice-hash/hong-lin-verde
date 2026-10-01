# Repository Guidelines

## Project Structure & Module Organization

This is a Vite, React, and TypeScript single-page application. Application startup and routing live in `src/main.tsx` and `src/App.tsx`. Put route-level screens in `src/pages/` (for example, `Home.tsx`) and compose page sections from `src/sections/`. Shared UI primitives are in `src/components/ui/`; reuse these Radix-based components before adding new primitives. Keep static catalog content in `src/data/`, small helpers in `src/lib/`, and app-level constants in `src/config.ts`. Images served directly by Vite belong in `public/`, such as `public/plants/hero.jpg`.

## Build, Test, and Development Commands

- `npm install`: install the locked dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server with hot reload.
- `npm run build`: type-check the project with TypeScript and produce the production bundle in `dist/`.
- `npm run lint`: run ESLint across the repository.
- `npm run preview`: serve the most recent production build locally.

Run `npm run lint` and `npm run build` before submitting a change.

## Coding Style & Naming Conventions

Write TypeScript and TSX with 2-space indentation, single-quoted imports, and no semicolons, matching the existing source. Use PascalCase for React components and their files (`PlantGrid.tsx`), camelCase for functions and values, and kebab-case only where established by assets or utility filenames (`use-mobile.ts`). Prefer function components with named imports. Style application UI with Tailwind utility classes; keep shared class composition in `src/lib/utils.ts` and preserve the existing design tokens in `src/index.css` and `tailwind.config.js`. ESLint is the enforced style and correctness check; no dedicated formatter is configured.

## Testing Guidelines

No automated test framework or test script is currently configured. For each change, run linting and a production build, then manually check the relevant screen in `npm run dev`, including responsive behavior and visible plant imagery. When adding a test setup, place tests beside the module or under `src/` using `*.test.ts` or `*.test.tsx`, and add a corresponding npm script.

## Commit & Pull Request Guidelines

This checkout has no Git history, so no local commit convention can be inferred. Use short, imperative Conventional Commit-style subjects, such as `feat: add pickup hours` or `fix: preserve mobile navigation`. Keep commits focused. Pull requests should explain the user-visible change, link the relevant issue when one exists, list validation commands, and include before/after screenshots for visual changes.
