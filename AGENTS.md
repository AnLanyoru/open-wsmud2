# Repository Guidance

## Verification

- While making changes, use only TypeScript validation.
- Attempt `node scripts/pack.mjs --binary` (or the equivalent `npm run build-b`) only during final verification before wrapping up.
- Do not run additional verification scripts unless they are directly relevant to the change or the user explicitly requests them.
