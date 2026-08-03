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

const { OBJ } = await import('../server/dist/core/item/obj.js');

function makeObject(combineCount) {
    const item = new OBJ();
    item.name = '碎片';
    item.color_name = '碎片';
    item.id = 'piece';
    item.unit = '块';
    item.count = 3;
    item.combine_count = combineCount;
    return item;
}

test('item formats expose the required combine count instead of a boolean', () => {
    const item = makeObject(10);

    assert.equal(JSON.parse(item.item_to_json())[10], 10);
    assert.equal(JSON.parse(item.format_to_pack())[10], 10);
});

test('item formats expose zero when the item cannot be combined', () => {
    const item = makeObject(undefined);

    assert.equal(JSON.parse(item.item_to_json())[10], 0);
    assert.equal(JSON.parse(item.format_to_pack())[10], 0);
});
