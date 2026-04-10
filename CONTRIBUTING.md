# Contributing to Mirlo

Thanks for your interest in contributing.

## Setup

```bash
npm install
npm run dev        # WXT dev server with HMR
npm test           # Run Vitest tests
npm run build      # Production build
```

Load the dev build: Chrome → `chrome://extensions` → Developer mode → Load unpacked → select `.output/chrome-mv3/`.

## Making Changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Run `npm test` — all tests must pass
5. Open a pull request

## Commit Messages

Use conventional commit prefixes:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance, dependencies, tooling

## Code Style

- TypeScript throughout
- Tests live in `src/__tests__/`
- Shared utilities go in `src/utils/`
- WXT entrypoints go in `src/entrypoints/`

## Reporting Issues

Open an issue on this repo. Include:
- What you expected
- What happened instead
- Chrome version and OS
- The website URL where the issue occurred (if applicable)
