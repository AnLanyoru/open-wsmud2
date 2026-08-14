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

## Investigation before modification

- Before changing behavior, fully trace the relevant runtime path, configuration, scheduling cadence, and existing domain implementation. Do not add cooldowns, guards, timers, or compatibility layers until the current mechanism has been verified end to end.
- Prefer the smallest domain-local implementation that follows existing project conventions. For example, skill-specific behavior belongs in that skill rather than in shared combat or property infrastructure.

## Framework change approval

- Do not modify shared framework or core infrastructure merely to complete a resource, equipment, skill, or content task.
- If the requested behavior cannot be implemented correctly without a framework/core change, stop before editing those shared files. Report the limitation, present the proposed framework change and its impact to the user, and wait for explicit approval.

## Source descriptions

- When a reference document supplies an item introduction or description, copy that text verbatim into the item's `desc`. Do not polish, paraphrase, expand, or shorten it.
- Put implementation notes, interpretation, or more detailed background in adjacent code comments rather than changing the source description.

## Status IDs

- Any status whose purpose is the framework's standard busy/忙乱 state must use the fixed ID `busy` together with `is_busy: true`; do not create equipment- or skill-specific busy IDs.
