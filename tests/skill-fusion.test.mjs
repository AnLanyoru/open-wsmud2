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

const [
    { convert_skill_progress, query_skill_potential },
    { SKILL, PERFORM },
    { SkillsMap },
    { WORLD },
    { default: FusionCommand },
] = await Promise.all([
        import('../server/dist/core/skill/progress.js'),
        import('../server/dist/core/skill/skill.js'),
        import('../server/dist/core/char/skills_map.js'),
        import('../server/dist/core/world.js'),
        import('../server/dist/res/cmd/skill/lingwu2.js'),
    ]);

function totalProgress(level, exp, grade) {
    return query_skill_potential(level, grade) + exp;
}

function makeSkill(id, name, grade, enables) {
    const skill = new SKILL();
    skill.id = id;
    skill.name = name;
    skill.grade = grade;
    skill.can_enables = enables;
    skill.release_prop = () => {};
    skill.attach_prop = () => {};
    skill.query_score = () => 0;
    skill.query_desc = () => '';
    return skill;
}

function makePlayer(entries) {
    const messages = [];
    return {
        skills: new SkillsMap(entries),
        pot: 0,
        messages,
        query_skill(id, fallback = 0) {
            return this.skills.get(id)?.level ?? fallback;
        },
        skill_limit: () => 9999,
        notify(message) {
            messages.push(message);
        },
        send(message) {
            messages.push(message);
        },
        send_commands(...commands) {
            messages.push(commands);
        },
        add_score: () => {},
        init_skill: () => {},
        recount: () => {},
    };
}

test('grade conversion preserves all invested skill progress in both directions', () => {
    const original = { level: 3001, exp: 12345 };
    const fused = convert_skill_progress(original.level, original.exp, 5, 6);
    const restored = convert_skill_progress(fused.level, fused.exp, 6, 5);

    assert.equal(
        totalProgress(fused.level, fused.exp, 6),
        totalProgress(original.level, original.exp, 5),
    );
    assert.deepEqual(restored, original);
});

test('fusion accepts a shared equipment position and reverses without progress loss', () => {
    const target = makeSkill('target', '主武功', 5, ['sword']);
    const source = makeSkill('source', '来源武功', 4, ['sword', 'parry']);
    const perform = new PERFORM();
    perform.name = '来源绝招';
    perform.pid = 'strike';
    perform.enable_skill = 'sword';
    source.pfm.strike = perform;
    WORLD.SKILLS.set(target.id, target);
    WORLD.SKILLS.set(source.id, source);

    const original = { level: 3001, exp: 321, enable_skill: null };
    const player = makePlayer([
        [target.id, { ...original }],
        [source.id, { level: 3001, exp: 0, enable_skill: null }],
    ]);
    const command = new FusionCommand();

    command.enter(player, target.id, 'source/strike', 'ok');
    const fused = player.skills.get(target.id);
    assert.equal(fused.ref, 'source/strike');
    assert.equal(target.query_grade(player), 6);
    assert.equal(
        totalProgress(fused.level, fused.exp, 6),
        totalProgress(original.level, original.exp, 5),
    );

    command.enter(player, target.id, 'cancel', 'ok');
    const restored = player.skills.get(target.id);
    assert.equal(restored.ref, undefined);
    assert.equal(target.query_grade(player), 5);
    assert.equal(restored.level, original.level);
    assert.equal(restored.exp, original.exp);
});

test('fusion rejects an action whose equipment position is not shared', () => {
    const target = makeSkill('target2', '主武功二', 5, ['sword']);
    const source = makeSkill('source2', '来源武功二', 4, ['parry']);
    const perform = new PERFORM();
    perform.name = '招架绝招';
    perform.pid = 'guard';
    perform.enable_skill = 'parry';
    source.pfm.guard = perform;
    WORLD.SKILLS.set(target.id, target);
    WORLD.SKILLS.set(source.id, source);

    const player = makePlayer([
        [target.id, { level: 3001, exp: 0, enable_skill: null }],
        [source.id, { level: 3001, exp: 0, enable_skill: null }],
    ]);

    new FusionCommand().enter(player, target.id, 'source2/guard', 'ok');
    assert.equal(player.skills.get(target.id).ref, undefined);
    assert.equal(
        player.messages.some(message => String(message).includes('不符合当前融合条件')),
        true,
    );
});

test('fusion accepts both levels at 3000 and still requires the target at grade 5', () => {
    const target = makeSkill('target3', '主武功三', 5, ['sword']);
    const source = makeSkill('source3', '来源武功三', 4, ['sword']);
    const perform = new PERFORM();
    perform.name = '来源绝招三';
    perform.pid = 'strike';
    perform.enable_skill = 'sword';
    source.pfm.strike = perform;
    WORLD.SKILLS.set(target.id, target);
    WORLD.SKILLS.set(source.id, source);
    const command = new FusionCommand();

    const atBoundary = makePlayer([
        [target.id, { level: 3000, exp: 0, enable_skill: null }],
        [source.id, { level: 3000, exp: 0, enable_skill: null }],
    ]);
    command.enter(atBoundary, target.id, 'source3/strike', 'ok');
    assert.equal(atBoundary.skills.get(target.id).ref, 'source3/strike');

    target.grade = 4;
    const wrongGrade = makePlayer([
        [target.id, { level: 3001, exp: 0, enable_skill: null }],
        [source.id, { level: 3001, exp: 0, enable_skill: null }],
    ]);
    command.enter(wrongGrade, target.id, 'source3/strike', 'ok');
    assert.equal(wrongGrade.skills.get(target.id).ref, undefined);
});

test('setting cooldown supports the fused perform ref key', () => {
    const perform = new PERFORM();
    perform.pid = 'strike';
    const messages = [];
    const player = {
        is_player: true,
        pfm_cd: new Map(),
        send(message) {
            messages.push(message);
        },
    };

    perform.set_distime(player, 'sword', 60000, 'ref');

    assert.equal(player.pfm_cd.has('sword.ref'), true);
    assert.equal(player.pfm_cd.has('sword.strike'), false);
    assert.equal(messages[0].includes('id:"sword.ref"'), true);
});
