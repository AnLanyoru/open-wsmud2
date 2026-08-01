import { NPC } from '../../../core/char/npc.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { WORLD } from '../../../core/world.js';
import type { SKILL, SkillItem } from '../../../core/skill/skill.js';
import { UTIL } from '../../../core/util/util.js';

interface FugitiveLevel {
    skillGrade: number;
    skillBase: number;
    skillPerCapture: number;
    combatAttributeBase?: number;
    combatAttributePerCapture?: number;
    hpBase: number;
    hpPerCapture: number;
}

/** grade 为当前衙门职位：0 未加入，1 衙役，依次到 5 巡检。 */
const FUGITIVE_LEVELS: readonly FugitiveLevel[] = [
    {
        skillGrade: 1,
        skillBase: 100,
        skillPerCapture: 0,
        hpBase: 1200,
        hpPerCapture: 0,
    },
    {
        skillGrade: 2,
        skillBase: 350,
        skillPerCapture: 50,
        combatAttributeBase: 2400,
        combatAttributePerCapture: 400,
        hpBase: 20000,
        hpPerCapture: 20000,
    },
    {
        skillGrade: 3,
        skillBase: 870,
        skillPerCapture: 70,
        combatAttributeBase: 9200,
        combatAttributePerCapture: 1200,
        hpBase: 140000,
        hpPerCapture: 40000,
    },
    {
        skillGrade: 4,
        skillBase: 1600,
        skillPerCapture: 100,
        combatAttributeBase: 23000,
        combatAttributePerCapture: 3000,
        hpBase: 500000,
        hpPerCapture: 250000,
    },
    {
        skillGrade: 5,
        skillBase: 2750,
        skillPerCapture: 250,
        combatAttributeBase: 120000,
        combatAttributePerCapture: 20000,
        hpBase: 5500000,
        hpPerCapture: 500000,
    },
    {
        skillGrade: 6,
        skillBase: 5000,
        skillPerCapture: 5000,
        combatAttributeBase: 500000,
        combatAttributePerCapture: 500000,
        hpBase: 15000000,
        hpPerCapture: 5000000,
    },
];

const BASIC_COMBAT_SKILLS = [
    'force',
    'unarmed',
    'sword',
    'blade',
    'staff',
    'club',
    'whip',
    'throwing',
    'parry',
    'dodge',
] as const;

const BASIC_COMBAT_SKILL_SET: ReadonlySet<string> = new Set(BASIC_COMBAT_SKILLS);

/** 使用普通配套武器，避免装备强度主导逃犯的成长数值。 */
const SKILL_WEAPONS: Readonly<Record<string, string>> = {
    sword: 'eq/lv0/jian',
    blade: 'eq/lv0/dao',
    staff: 'eq/lv0/tiezhang',
    club: 'eq/lv0/mugun',
    whip: 'eq/lv0/whip',
};
const WEAPON_SKILL_TYPES = ['sword', 'blade', 'staff', 'club', 'whip'] as const;
const WEAPON_SKILL_TYPE_SET: ReadonlySet<string> = new Set(WEAPON_SKILL_TYPES);
const SKILL_SUITE_SLOTS = ['weapon', 'force', 'unarmed', 'dodge', 'parry'] as const;

type SkillSuiteSlot = (typeof SKILL_SUITE_SLOTS)[number];
type SkillSuiteItem = { slot: SkillSuiteSlot; skill: SKILL; enable: string };

export default class extends NPC {
    name = '逃犯';
    desc = '他是衙门正在追捕的逃犯';
    title = '<red>衙门逃犯</red>';
    gender = 1;
    age = 25;
    per = 18;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    no_refresh = true;
    no_fight = true;

    init_from(player, grade = 0, level = 0) {
        const levelConfig = FUGITIVE_LEVELS[Math.max(0, Math.min(grade, FUGITIVE_LEVELS.length - 1))];
        const captureCount = Math.max(0, level);
        const skillLevel =
            levelConfig.skillBase + levelConfig.skillPerCapture * captureCount;
        const combatAttribute = levelConfig.combatAttributeBase
            ? levelConfig.combatAttributeBase +
              (levelConfig.combatAttributePerCapture ?? 0) * captureCount
            : undefined;

        this.con = this.dex = this.int = this.str = 30;
        if (combatAttribute !== undefined) this.set_base_combat_attributes(combatAttribute);
        this.gender = this.random(2) + 1;

        this.desc = (this.gender == 2 ? '她' : '他') + '是' + player.name + '正在追捕的逃犯';

        this.name = UTIL.random_name(this.gender);
        this.hp = this.max_hp =
            levelConfig.hpBase + levelConfig.hpPerCapture * captureCount;
        this.pfm_rate = 1;
        this.mp = this.max_mp = this.max_hp;

        const basicSkills: SkillItem[] = BASIC_COMBAT_SKILLS.map(id => [id, skillLevel]);
        const suite = this.random_skill_suite(levelConfig.skillGrade);
        const specialSkills: SkillItem[] = suite.map(item => [item.skill.id, skillLevel, item.enable]);
        this.skill_map(...basicSkills, ...specialSkills);

        const weapon = suite.find(item => item.slot === 'weapon');
        if (weapon) this.set_objects([SKILL_WEAPONS[weapon.enable], 1, 1]);

        this.init();
        this.recount();
    }

    /** 设置攻击、命中、招架、防御、闪避五项基础战斗属性。 */
    private set_base_combat_attributes(value: number): void {
        // recount 会把四维的天然贡献计入结果，先扣除它们以保证五维基础值准确。
        this.add_prop('gj', value - this.str);
        this.add_prop('mz', value - this.dex / 2);
        this.add_prop('zj', value - this.str / 2);
        this.add_prop('fy', value - (this.str + this.con) / 10);
        this.add_prop('ds', value - this.dex / 2);
    }

    /**
     * 同品级随机组成五门互不重复的特殊武功：兵器（不含暗器）、内功、拳脚、轻功、招架。
     * 每门武功只激活到自己的技能位，避免多用途武功覆盖套装中的其他技能。
     */
    private random_skill_suite(grade: number): SkillSuiteItem[] {
        const skills = Array.from(WORLD.SKILLS.values()).filter(
            skill =>
                skill.type === SKILL_TYPES.SKILL &&
                skill.grade === grade &&
                skill.can_enables.some(type => BASIC_COMBAT_SKILL_SET.has(type)),
        );

        const pools = new Map<SkillSuiteSlot, SKILL[]>();
        for (const slot of SKILL_SUITE_SLOTS) {
            const pool = skills.filter(skill =>
                slot === 'weapon'
                    ? skill.can_enables.some(type => WEAPON_SKILL_TYPE_SET.has(type))
                    : skill.can_enables.includes(slot),
            );
            this.shuffle(pool);
            pools.set(slot, pool);
        }

        // 优先匹配候选最少的位置，再通过回溯保证五门武功互不重复。
        const slots = [...SKILL_SUITE_SLOTS].sort(
            (a, b) => pools.get(a)!.length - pools.get(b)!.length,
        );
        const selected = new Map<SkillSuiteSlot, SKILL>();
        const used = new Set<string>();
        const pick = (index: number): boolean => {
            if (index >= slots.length) return true;
            const slot = slots[index];
            for (const skill of pools.get(slot)!) {
                if (used.has(skill.id)) continue;
                selected.set(slot, skill);
                used.add(skill.id);
                if (pick(index + 1)) return true;
                used.delete(skill.id);
                selected.delete(slot);
            }
            return false;
        };

        if (!pick(0)) {
            console.warn('逃犯无法组成完整的%d品技能套装', grade);
            return [];
        }

        return SKILL_SUITE_SLOTS.map(slot => {
            const skill = selected.get(slot)!;
            const enables =
                slot === 'weapon'
                    ? skill.can_enables.filter(type => WEAPON_SKILL_TYPE_SET.has(type))
                    : [slot];
            return { slot, skill, enable: enables[this.random(enables.length)] };
        });
    }

    private shuffle<T>(items: T[]): void {
        for (let i = items.length - 1; i > 0; i--) {
            const j = this.random(i + 1);
            [items[i], items[j]] = [items[j], items[i]];
        }
    }
}
