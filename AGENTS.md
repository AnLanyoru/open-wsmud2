# Repository Guidance

## Verification

- Run verification only for the areas changed; do not build the project after every task.
- When code under `server/` changes, use only TypeScript validation while making changes, then attempt `node scripts/pack.mjs --binary` (or the equivalent `npm run build-b`) during final verification before wrapping up.
- When code under `web/` changes, run `npx vite build` for verification.
- When both `server/` and `web/` code change, apply both corresponding verification rules.
- Changes outside `server/` and `web/` do not require a build unless a check is directly relevant to the change or the user explicitly requests it.

## User-facing item names

- When displaying an item name in messages, dialogs, or buttons, prefer the item's colored `color_name` (or `unit_name(count)` when a quantity is needed) instead of its plain `name`, unless the UI intentionally needs a non-item label such as a bare attribute name.

## Interactive message controls

- For runtime messages that combine selectable buttons with explanatory text, use `USER.send_cmd_and_text(...CmdAndText)`; do not hand-build `<span cmd="...">` markup.
- Reserve literal `<span cmd="...">...</span>` markup for room/scene descriptions and other static HTML content rendered as part of a room or location introduction. See [消息交互接口使用规范](docs/消息交互接口使用规范.md).

## Version control

- Write commit message content in Chinese.
