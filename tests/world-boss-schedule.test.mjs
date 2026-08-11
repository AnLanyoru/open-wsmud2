import assert from 'node:assert/strict';
import test from 'node:test';

globalThis.__CONFIG = { DB: {} };
globalThis.__PATH = {
    BASE: '',
    WORLD: '',
    COMMAND: '',
    SKILL: '',
    MAP: '',
    NPC: '',
    OBJ: '',
    TASK: '',
    AREA: '',
    FAMILY: '',
    EXTENDS: '',
    DATA: '',
    DEF_DATA: '',
    BASE_DATA: '',
};

const { calculateNextBossTime } = await import('../server/dist/res/task/boss_task.js');

test('world boss schedule preserves hourly and 21:00 carnival rules', () => {
    const cases = [
        [new Date(2026, 7, 11, 19, 30), 7, new Date(2026, 7, 11, 20, 13, 20)],
        [new Date(2026, 7, 11, 20, 30), 7, new Date(2026, 7, 11, 21, 0, 20)],
        [new Date(2026, 7, 11, 21, 0), 7, new Date(2026, 7, 11, 21, 5, 20)],
        [new Date(2026, 7, 11, 21, 59), 7, new Date(2026, 7, 11, 22, 0, 20)],
        [new Date(2026, 7, 11, 22, 30), 49, new Date(2026, 7, 11, 23, 55, 20)],
    ];

    for (const [now, minute, expected] of cases) {
        const next = calculateNextBossTime(now, minute);
        assert.equal(next.getTime(), expected.getTime());
        assert.equal(next.getTime() > now.getTime(), true);
    }
});
