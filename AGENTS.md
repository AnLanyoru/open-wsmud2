# Repository Guidance

## Verification

- By default, verify changes only with TypeScript validation and `node scripts/pack.mjs --binary` (or the equivalent `npm run build-b`).
- Do not run additional verification scripts unless they are directly relevant to the change or the user explicitly requests them.
