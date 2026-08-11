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

const [{ default: WorldBoss }, { SKILL }, { WORLD }] = await Promise.all([
    import('../server/dist/res/npc/pub/world_boss.js'),
    import('../server/dist/core/skill/skill.js'),
    import('../server/dist/core/world.js'),
]);

const skillIds = [
    'force',
    'unarmed',
    'sword',
    'parry',
    'dodge',
    'baiyunxinfa',
    'qishangquan',
    'songshanjianfa',
    'anyingfuxiang',
    'mingyugong',
    'hamagong',
    'bianjianfa',
    'yihuajiemu',
    'xuanxubu',
    'jiuyangshengong',
    'rulaishenzhang',
    'xuantiejianfa',
    'qiankundanuoyi',
    'lingxibu',
];

for (const id of skillIds) {
    const skill = new SKILL();
    skill.id = id;
    skill.name = id;
    skill.can_enables = [id];
    WORLD.SKILLS.set(id, skill);
}

test('high-grade world boss resources have isolated names, skills and native drops', () => {
    const expected = [
        [3, '宗师级首领', 'baiyunxinfa'],
        [4, '武圣级首领', 'mingyugong'],
        [5, '武帝级首领', 'jiuyangshengong'],
    ];

    for (const [grade, name, signatureSkill] of expected) {
        const boss = new WorldBoss();
        boss.set_objects = () => {};
        boss.create('pub/world_boss', `#${grade}`);
        assert.equal(boss.name, name);
        assert.equal(boss.path, `pub/world_boss#${grade}`);
        assert.equal(boss.skills.has(signatureSkill), true);
        assert.equal(boss.drop_list.length, 3);
    }
});
