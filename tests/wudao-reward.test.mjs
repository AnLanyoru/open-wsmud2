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

const [{ wudao_grade }, { wudao_daily_fragment_slots }] = await Promise.all([
    import('../server/dist/res/map/wudao/ta.js'),
    import('../server/dist/res/task/wd_task.js'),
]);

test('wudao fragment grades follow the documented twenty-floor boundaries', () => {
    const cases = [
        [1, 1],
        [19, 1],
        [20, 2],
        [39, 2],
        [40, 3],
        [59, 3],
        [60, 4],
        [79, 4],
        [80, 5],
        [99, 5],
        [100, 5],
    ];

    for (const [level, grade] of cases) assert.equal(wudao_grade(level), grade);
});

test('daily fragments below floor 100 keep one guaranteed current slot and one bonus slot', () => {
    assert.deepEqual(wudao_daily_fragment_slots(19), [
        { grade: 1, odds: 10000 },
        { grade: 1, odds: 5000 },
    ]);
    assert.deepEqual(wudao_daily_fragment_slots(20), [
        { grade: 1, odds: 5000 },
        { grade: 2, odds: 10000 },
        { grade: 2, odds: 5000 },
    ]);
    assert.deepEqual(wudao_daily_fragment_slots(80), [
        { grade: 1, odds: 5000 },
        { grade: 2, odds: 5000 },
        { grade: 3, odds: 5000 },
        { grade: 4, odds: 5000 },
        { grade: 5, odds: 10000 },
        { grade: 5, odds: 5000 },
    ]);
});

test('floor 100 and above independently replace two orange slots with red fragments', () => {
    for (const [level, odds] of [
        [100, 2000],
        [101, 4000],
        [102, 6000],
        [103, 8000],
    ]) {
        const slots = wudao_daily_fragment_slots(level);
        assert.deepEqual(slots.slice(-2), [
            { grade: 6, odds, fall_grade: 5 },
            { grade: 6, odds, fall_grade: 5 },
        ]);
    }

    assert.deepEqual(wudao_daily_fragment_slots(104).slice(-3), [
        { grade: 6, odds: 10000, fall_grade: 5 },
        { grade: 6, odds: 10000, fall_grade: 5 },
        { grade: 5, odds: 5000 },
    ]);
    assert.deepEqual(wudao_daily_fragment_slots(105).slice(-3), [
        { grade: 6, odds: 10000, fall_grade: 5 },
        { grade: 6, odds: 10000, fall_grade: 5 },
        { grade: 5, odds: 5000 },
    ]);
});
