# FALAI Landing Page

## Overview
A landing page for FALAI, a voice-to-text product. Built with React, TypeScript, Vite, and Tailwind CSS v4.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Forms**: react-hook-form + zod validation
- **Animations**: framer-motion
- **Icons**: lucide-react

## Project Structure
- `src/` - Source code
  - `App.tsx` - Main app component
  - `main.tsx` - Entry point
  - `components/` - Page sections (Hero, Benefits, CaptureForm, etc.)
- `public/assets/` - Static assets (logos, icons)
- `index.html` - HTML entry point

## Development
- **Dev server**: `npm run dev` (runs on port 5000, host 0.0.0.0)
- **Build**: `npm run build` (outputs to `dist/`)

## Deployment
- Configured as a static site deployment
- Build command: `npm run build`
- Public directory: `dist`
