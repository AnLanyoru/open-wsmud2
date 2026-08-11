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

const [{ SKILL }, { WORLD }, { FAMILIES }, { SKILL_TYPES }] = await Promise.all([
    import('../server/dist/core/skill/skill.js'),
    import('../server/dist/core/world.js'),
    import('../server/dist/core/skill/family.js'),
    import('../server/dist/core/const.js'),
]);

function makeSkill(id, overrides = {}) {
    const skill = new SKILL();
    skill.id = id;
    skill.name = id;
    skill.grade = 3;
    skill.can_enables = ['sword'];
    Object.assign(skill, overrides);
    WORLD.SKILLS.set(id, skill);
    return skill;
}

test('fragment pool keeps only ordinary public combat skills of the requested grade', () => {
    WORLD.SKILLS.clear();
    const eligible = makeSkill('eligible');
    makeSkill('wrong-grade', { grade: 2 });
    makeSkill('base', { type: SKILL_TYPES.BASE });
    makeSkill('knowledge', { type: SKILL_TYPES.KNOWLEDGE });
    makeSkill('family', { family: {} });
    makeSkill('hidden', { is_hidden: true });
    makeSkill('custom', { is_custom: true });
    makeSkill('advanced', { source_skill: 'eligible' });
    makeSkill('ultimate', { is_ultimate: true });
    makeSkill('non-combat', { can_enables: [] });
    makeSkill('explicit-none', { family: FAMILIES.NONE });

    assert.deepEqual(
        SKILL.query_fragment_pool(3).map(skill => skill.id),
        ['eligible', 'explicit-none'],
    );
    assert.equal(SKILL.query_fragment_pool(0).length, 0);
    assert.equal(SKILL.query_fragment_pool(2)[0]?.id, 'wrong-grade');
    assert.equal([eligible, WORLD.SKILLS.get('explicit-none')].includes(SKILL.random_fragment_skill(3)), true);
});
