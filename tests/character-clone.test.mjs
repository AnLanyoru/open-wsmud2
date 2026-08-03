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
};

const [{ CHARACTER }, { NPC }, { SkillsMap }] = await Promise.all([
    import('../server/dist/core/char/character.js'),
    import('../server/dist/core/char/npc.js'),
    import('../server/dist/core/char/skills_map.js'),
]);

function cloneTemplate(template) {
    const clone = Object.create(template);
    clone.clone();
    return clone;
}

function makeTemplate() {
    const template = new CHARACTER();
    template.skills = new SkillsMap([
        ['force', { level: 10, exp: 20, enable_skill: null, addin: [1, 2] }],
    ]);
    template.pfm_cd.set('force/test', 123);

    // clone() 的其余初始化依赖已加载的游戏技能；本测试只验证克隆隔离。
    template.init = () => {};
    template.recount = () => {};
    return template;
}

test('character clones isolate cooldowns and nested skill data', () => {
    const template = makeTemplate();
    const first = cloneTemplate(template);
    const second = cloneTemplate(template);

    assert.equal(Object.hasOwn(first, 'pfm_cd'), true);
    assert.notEqual(first.pfm_cd, template.pfm_cd);
    assert.notEqual(first.pfm_cd, second.pfm_cd);
    assert.equal(first.pfm_cd.size, 0);

    const firstSkill = first.skills.get('force');
    const secondSkill = second.skills.get('force');
    const templateSkill = template.skills.get('force');
    firstSkill.level = 99;
    firstSkill.addin.push(3);

    assert.equal(templateSkill.level, 10);
    assert.equal(secondSkill.level, 10);
    assert.deepEqual(templateSkill.addin, [1, 2]);
    assert.deepEqual(secondSkill.addin, [1, 2]);
});

test('character clones own mutable runtime state instead of inheriting it', () => {
    const template = makeTemplate();
    template.status = [{ id: 'template-status' }];
    template.enemy = [template];
    template.damages = { player: 10 };
    template.follow_targets = [template];

    const clone = cloneTemplate(template);

    for (const field of [
        'status',
        'combat_props',
        'enemy',
        'auto_skills',
        'pfm_cd',
        'attack_part',
        'attack_handler',
        'damages',
        'json',
        'environment',
        'state',
        'follow_target',
        'follow_targets',
        'team',
        'socket',
    ]) {
        assert.equal(Object.hasOwn(clone, field), true, `${field} should be an own property`);
    }

    assert.equal(clone.status, null);
    assert.equal(clone.enemy, null);
    assert.equal(clone.damages, null);
    assert.equal(clone.follow_targets, null);
    assert.deepEqual(template.status, [{ id: 'template-status' }]);
    assert.deepEqual(template.damages, { player: 10 });
});

test('an NPC cloned from a live NPC does not reuse its cached commands', () => {
    const original = new NPC();
    original.id = 'original-id';
    original.name = '本体';
    original.json = JSON.stringify({
        type: 'item',
        id: original.id,
        commands: [{ cmd: `kill ${original.id}`, name: '击杀' }],
    });
    original.init = () => {};
    original.recount = () => {};

    const demon = cloneTemplate(original);
    demon.name = '本体「心魔」';
    const commands = JSON.parse(demon.query_commands());

    assert.notEqual(demon.id, original.id);
    assert.equal(commands.id, demon.id);
    assert.equal(commands.name, demon.name);
    assert.equal(commands.commands.some(item => item.cmd === `kill ${demon.id}`), true);
    assert.equal(commands.commands.some(item => item.cmd.includes(original.id)), false);
});

test('NPC shop actions are explicit and include the backend refresh command', () => {
    const npc = new NPC();
    npc.id = 'seller-id';
    npc.add_action('forge', '锻造', () => {});
    npc.add_action('unrelated', '交谈', () => {});
    npc.add_shop_action('forge');

    assert.deepEqual(npc.query_shop_actions(), [
        { cmd: 'shop_refresh seller-id', name: '刷新' },
        { cmd: 'forge seller-id', name: '锻造' },
    ]);
});
