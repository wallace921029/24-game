# AGENTS.md

This file provides guidance for coding agents working in this repository.

## Scope

These instructions apply to the entire repository unless a more specific `AGENTS.md` exists in a subdirectory.

## Commands

```bash
npm run dev       # Start the Vite dev server with HMR
npm run build     # Type-check with tsc -b, then bundle with Vite
npm run lint      # Run ESLint over the project
npm run preview   # Preview the production build locally
```

No test runner is configured yet.

## Stack

- React 19
- TypeScript 6
- Vite 8
- Single-page app
- Source code lives under `src/`
- Entry point: `src/main.tsx` -> `src/App.tsx`

## TypeScript

- `tsconfig.app.json` compiles `src/` only using bundler mode and `noEmit`.
- `tsconfig.node.json` covers Vite config files.
- `tsc -b` builds both TypeScript projects in order.
- Strict unused checks are enabled with `noUnusedLocals` and `noUnusedParameters`.
- `erasableSyntaxOnly` is enabled, so type-only constructs must use `import type` and `export type`.

## ESLint

- `eslint.config.js` uses ESLint v9 flat config.
- Enabled rule sets/plugins:
  - `@eslint/js` recommended
  - `typescript-eslint` recommended
  - `react-hooks`
  - `react-refresh`
- `dist/` is ignored.

## Required Coding Guidance

1. Prioritize the existing UI libraries:
   - Components: shadcn-ui (`https://ui.shadcn.com/`)
   - Icons: lucide-react (`https://lucide.dev/icons/`)
2. Think before coding. Prefer existing libraries, components, helpers, and repository patterns before adding new code.
3. Ask the user for clarification when the requested behavior is unclear or when it is not obvious whether to write new code or use an existing solution.
4. When new code is necessary:
   - Use clear, descriptive names for variables, functions, components, and files.
   - Add comments only where they clarify complex logic or non-obvious decisions.
   - Keep code modular and organized.
   - Avoid duplication by extracting reusable functions or components when it meaningfully improves maintainability.
5. Test changes thoroughly. Use the configured checks where applicable, and perform focused manual testing when no automated test runner exists.

## Verification Expectations

For code changes, run the most relevant available checks before finishing:

```bash
npm run lint
npm run build
```

If either command is not run, explain why in the final response.
