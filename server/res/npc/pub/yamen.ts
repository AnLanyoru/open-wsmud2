import { NPC } from '../../../core/char/npc.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { WORLD } from '../../../core/world.js';
import type { SKILL, SkillItem } from '../../../core/skill/skill.js';
import { UTIL } from '../../../core/util/util.js';

interface FugitiveLevel {
    skillGrade: number;
    skillBase: number;
    skillPerCapture: number;
    attributeBase?: number;
    attributePerCapture?: number;
    hpBase: number;
    hpPerCapture: number;
}

/** grade 为当前衙门职位：0 未加入，1 衙役，依次到 5 巡检。 */
const FUGITIVE_LEVELS: readonly FugitiveLevel[] = [
    { skillGrade: 1, skillBase: 100, skillPerCapture: 0, hpBase: 1200, hpPerCapture: 0 },
    {
        skillGrade: 2,
        skillBase: 350,
        skillPerCapture: 50,
        attributeBase: 2400,
        attributePerCapture: 400,
        hpBase: 20000,
        hpPerCapture: 20000,
    },
    {
        skillGrade: 3,
        skillBase: 870,
        skillPerCapture: 70,
        attributeBase: 9200,
        attributePerCapture: 1200,
        hpBase: 140000,
        hpPerCapture: 40000,
    },
    {
        skillGrade: 4,
        skillBase: 1600,
        skillPerCapture: 100,
        attributeBase: 23000,
        attributePerCapture: 3000,
        hpBase: 500000,
        hpPerCapture: 250000,
    },
    {
        skillGrade: 5,
        skillBase: 2750,
        skillPerCapture: 250,
        attributeBase: 120000,
        attributePerCapture: 20000,
        hpBase: 5500000,
        hpPerCapture: 500000,
    },
    {
        skillGrade: 6,
        skillBase: 5000,
        skillPerCapture: 5000,
        attributeBase: 500000,
        attributePerCapture: 500000,
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
    throwing: 'eq/lv0/fei',
};
const WEAPON_PRIORITY = ['sword', 'blade', 'staff', 'club', 'whip', 'throwing'] as const;

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
        const attribute = levelConfig.attributeBase
            ? levelConfig.attributeBase +
              (levelConfig.attributePerCapture ?? 0) * captureCount
            : 30;

        this.con = this.dex = this.int = this.str = attribute;
        this.gender = this.random(2) + 1;

        this.desc = (this.gender == 2 ? '她' : '他') + '是' + player.name + '正在追捕的逃犯';

        this.name = UTIL.random_name(this.gender);
        this.hp = this.max_hp =
            levelConfig.hpBase + levelConfig.hpPerCapture * captureCount;
        this.pfm_rate = 1;
        this.mp = this.max_mp = this.max_hp;

        const basicSkills: SkillItem[] = BASIC_COMBAT_SKILLS.map(id => [id, skillLevel]);
        const skill = this.random_skill(levelConfig.skillGrade);
        if (skill) {
            const enables = skill.can_enables.filter(type => BASIC_COMBAT_SKILL_SET.has(type));
            this.skill_map(...basicSkills, [skill.id, skillLevel, enables]);

            const weaponType = WEAPON_PRIORITY.find(type => enables.includes(type));
            if (weaponType) this.set_objects([SKILL_WEAPONS[weaponType], 1, 1]);
        } else this.skill_map(...basicSkills);

        this.init();
        this.recount();
    }

    private random_skill(grade: number): SKILL | undefined {
        const skills = Array.from(WORLD.SKILLS.values()).filter(
            skill =>
                skill.type === SKILL_TYPES.SKILL &&
                skill.grade === grade &&
                skill.can_enables.some(type => BASIC_COMBAT_SKILL_SET.has(type)),
        );
        if (!skills.length) return;
        return skills[this.random(skills.length)];
    }
}
