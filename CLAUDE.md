# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check (tsc -b) then bundle with Vite
npm run lint      # ESLint over all .ts/.tsx files
npm run preview   # Preview the production build locally
```

No test runner is configured yet.

## Stack

React 19 + TypeScript 6 + Vite 8. Single-page app; all source lives under `src/`. Entry point is `src/main.tsx` → `src/App.tsx`.

## TypeScript config

`tsconfig.app.json` compiles `src/` only (bundler mode, `noEmit`). `tsconfig.node.json` covers Vite config files. `tsc -b` builds both in order.

Strict unused-locals/parameters checks are enabled (`noUnusedLocals`, `noUnusedParameters`). `erasableSyntaxOnly` is set, so type-only constructs must use `import type` / `export type`.

## ESLint

`eslint.config.js` uses flat config (ESLint v9). Rules: `@eslint/js` recommended + `typescript-eslint` recommended + `react-hooks` + `react-refresh`. `dist/` is ignored.


## ABSOLUTE COMMANDS

You must follow these commands when writing code for this repository!!!

1. Please prioritize the use of the UI libraries listed below:
   - components: shadcn-ui (https://ui.shadcn.com/)
   - icons: lucide-react (https://lucide.dev/icons/)
2. Think before coding. Always ask yourself if the code you are about to write is necessary, or if it can be avoided by using existing libraries, components, or patterns. Avoid writing new code if it can be achieved with existing solutions. Ask me if you are unsure about whether to write new code or use existing solutions, or my description of the problem is not clear enough. I can provide additional information, clarification, or guidance to help you make an informed decision.
3. If you need to write new code, please follow best practices for code quality, readability, and maintainability. This includes:
   - Writing clear and descriptive variable and function names.
   - Adding comments and documentation where necessary to explain complex logic or decisions.
   - Structuring code in a modular and organized way.
   - Avoiding code duplication by creating reusable functions or components.
4. Always test your code thoroughly to ensure it works as expected and does not introduce bugs or issues. This includes writing unit tests, integration tests, and manual testing as needed.