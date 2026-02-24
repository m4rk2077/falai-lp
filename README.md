# FALAI LP

Landing page do beta com captura de leads integrada ao Supabase via backend da Vercel (`/api/lead`).

## Variáveis de ambiente (Vercel)

Configure no projeto da Vercel:

- `FALAI_LEAD_CAPTURE_URL`
- `FALAI_LEAD_ACTIVE_KEY_ID`
- `FALAI_LEAD_WEBHOOK_SECRET_V1` (ou `FALAI_LEAD_WEBHOOK_SECRET_<KEY_ID>`)

Use `.env.example` como referência.

## Fluxo de captura

1. Formulário (`src/components/CaptureForm.tsx`) envia para `/api/lead`.
2. A função `api/lead.js` assina o payload com HMAC SHA-256.
3. O backend chama `POST /functions/v1/lead_capture` no Supabase.
4. O Supabase grava em `leads_beta` e `lead_events`.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Obs: para testar a submissao real do form localmente usando a rota `/api/lead`, rode com `vercel dev`.

## Build

```bash
npm run build
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Environment setup

Create a `.env` file (you can copy from `.env.example`) and configure:

- `VITE_META_PIXEL_ID`: Meta Pixel ID used to initialize and track events on the landing page.
- `LEAD_WEBHOOK_URL`: webhook endpoint used by `/api/lead` to receive beta form submissions.

On Vercel, configure `LEAD_WEBHOOK_URL` as a server-side environment variable (without `VITE_`).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
