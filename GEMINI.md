# GEMINI.md

This file provides foundational mandates and guidance for Gemini CLI when working in this repository. These instructions take precedence over general defaults.

## Absolute Mandates

1.  **Library Priorities:**
    *   **UI Components:** Always use **shadcn-ui** (https://ui.shadcn.com/).
    *   **Icons:** Always use **lucide-react** (https://lucide.dev/icons/).
2.  **Minimalist Implementation:** Think before coding. Use existing libraries, components, or patterns whenever possible. Avoid writing new code if existing solutions suffice. If unsure, ask for clarification.
3.  **Code Quality:**
    *   Use clear, descriptive variable and function names.
    *   Add comments/documentation for complex logic.
    *   Maintain modular and organized structure.
    *   Avoid duplication; create reusable components/functions.
4.  **Verification:** Always test code thoroughly. Include unit/integration tests and perform manual testing as needed.

## Technical Standards

*   **Stack:** React 19, TypeScript 6, Vite 8 (SPA).
*   **Entry Point:** `src/main.tsx` → `src/App.tsx`.
*   **TypeScript:**
    *   Strict `unused-locals` and `unused-parameters` checks are enabled.
    *   `erasableSyntaxOnly` is active: **MUST** use `import type` and `export type` for type-only constructs.
    *   Build with `tsc -b`.
*   **ESLint:** Flat config (v9) in `eslint.config.js`. Ignores `dist/`.

## Core Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check (tsc -b) and bundle
npm run lint      # ESLint check
npm run preview   # Preview production build
```

## Workflow Requirements

*   **Research:** Verify existing components in `src/components/` before creating new ones.
*   **Execution:** Adhere strictly to the established TypeScript and ESLint configurations.
*   **Validation:** Run `npm run lint` and `npm run build` to ensure no regressions or type errors.
