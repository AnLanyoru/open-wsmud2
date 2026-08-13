import { NPC } from '../../../core/char/npc.js';
import type { USER } from '../../../core/char/user.js';
import type { CHARACTER } from '../../../core/char/character.js';
import { SKILL } from '../../../core/skill/skill.js';
import type { SkillItem } from '../../../core/skill/skill.js';

interface GuardianConfig {
    name: string;
    title?: string;
    hp: number;
    panel: number;
    downsideResistance: number;
    crit: number;
    critResistance: number;
    cooldownReduction: number;
    finalDamage: number;
    defenseIgnore: number;
    damageReduction: number;
    busyReduction?: number;
    weapon: string;
    skills: SkillItem[];
    performs?: string[];
}

const GUARDIANS: readonly GuardianConfig[] = [
    {
        name: '武道塔守护者',
        hp: 30_000_000,
        panel: 150_000,
        downsideResistance: 50,
        crit: 10,
        critResistance: 10,
        cooldownReduction: 60,
        finalDamage: 30,
        defenseIgnore: 10,
        damageReduction: 60,
        busyReduction: 5000,
        weapon: 'eq/lv6/yingdao',
        skills: [
            ['blade', 5000],
            ['force', 5000],
            ['jiuyangshengong', 5000],
            ['dodge', 5000],
            ['unarmed', 5000],
            ['parry', 5000],
            ['xuedao', 5000, 'blade'],
            ['taixuangong', 5000, 'force'],
            ['shenxingbaibian', 5000, 'dodge'],
            ['liumaishenjian', 5000, 'unarmed'],
            ['taijiquan2', 5000, 'parry'],
        ],
        performs: ['jiuyangshengong/huti'],
    },
    {
        name: '武道镇守者',
        hp: 35_000_000,
        panel: 200_000,
        downsideResistance: 80,
        crit: 20,
        critResistance: 20,
        cooldownReduction: 60,
        finalDamage: 40,
        defenseIgnore: 20,
        damageReduction: 70,
        busyReduction: 5000,
        weapon: 'eq/lv6/xuanyuanjian',
        skills: [
            ['sword', 5000],
            ['force', 5000],
            ['unarmed', 5000],
            ['parry', 5000],
            ['dodge', 5000],
            ['xuantiejianfa', 5000, 'sword'],
            ['jiuyangshengong', 5000, 'force'],
            ['anranxiaohun', 5000, 'unarmed'],
            ['taijiquan2', 5000, 'parry'],
            ['zhutianbu2', 5000, 'dodge'],
        ],
        performs: ['jiuyangshengong/huti', 'jiuyangshengong/zhenyan'],
    },
    {
        name: '武道传承者',
        hp: 40_000_000,
        panel: 250_000,
        downsideResistance: 100,
        crit: 30,
        critResistance: 30,
        cooldownReduction: 65,
        finalDamage: 50,
        defenseIgnore: 30,
        damageReduction: 80,
        weapon: 'eq/lv6/xuanyuanjian',
        skills: [
            ['sword', 5000],
            ['force', 5000],
            ['unarmed', 5000],
            ['parry', 5000],
            ['dodge', 5000],
            ['yitianjianfa2', 5000, 'sword'],
            ['rulaishenzhang', 5000, 'unarmed'],
            ['changshengjue', 5000, 'force'],
            ['dugujiujian2', 5000, 'parry'],
            ['xuanxubu', 5000, 'dodge'],
            ['lingboweibu2', 5000],
        ],
        performs: ['lingboweibu2/lingbo'],
    },
    {
        title: '武道统领者',
        name: '秦雅南',
        hp: 45_000_000,
        panel: 300_000,
        downsideResistance: 120,
        crit: 40,
        critResistance: 40,
        cooldownReduction: 70,
        finalDamage: 60,
        defenseIgnore: 40,
        damageReduction: 90,
        weapon: 'eq/lv6/xuanyuanjian',
        skills: [
            ['sword', 5000],
            ['force', 5000],
            ['unarmed', 5000],
            ['parry', 5000],
            ['dodge', 5000],
            ['xuantiejianfa', 5000, 'sword'],
            ['changshengjue', 5000, 'force'],
            ['liumaishenjian', 5000, 'unarmed'],
            ['dugujiujian2', 5000, 'parry'],
            ['xuanxubu', 5000, 'dodge'],
            ['lingboweibu2', 5000],
        ],
        performs: ['lingboweibu2/lingbo'],
    },
    {
        title: '武道领主',
        name: '暗淡',
        hp: 50_000_000,
        panel: 350_000,
        downsideResistance: 140,
        crit: 50,
        critResistance: 50,
        cooldownReduction: 70,
        finalDamage: 70,
        defenseIgnore: 50,
        damageReduction: 100,
        weapon: 'eq/lv6/xuanyuanjian',
        skills: [
            ['sword', 5000],
            ['force', 5000],
            ['unarmed', 5000],
            ['parry', 5000],
            ['dodge', 5000],
            ['fuyujianfa', 5000, 'sword'],
            ['changshengjue', 5000, 'force'],
            ['rulaishenzhang', 5000, 'unarmed'],
            ['dugujiujian2', 5000, 'parry'],
            ['xuanxubu', 5000, 'dodge'],
            ['lingboweibu2', 5000],
        ],
        performs: ['lingboweibu2/lingbo'],
    },
    {
        title: '武道塔主',
        name: '黑暗',
        hp: 60_000_000,
        panel: 400_000,
        downsideResistance: 160,
        crit: 60,
        critResistance: 60,
        cooldownReduction: 80,
        finalDamage: 80,
        defenseIgnore: 60,
        damageReduction: 120,
        weapon: 'eq/lv6/xuanyuanjian',
        skills: [
            ['sword', 5000],
            ['force', 5000],
            ['unarmed', 5000],
            ['parry', 5000],
            ['dodge', 5000],
            ['fuyujianfa', 5000, 'parry'],
            ['changshengjue', 5000, 'force'],
            ['liumaishenjian', 5000, 'unarmed'],
            ['dugujiujian2', 5000, 'sword'],
            ['xuanxubu', 5000, 'dodge'],
            ['lingboweibu2', 5000],
            ['jiuyangshengong', 5000],
        ],
        performs: ['lingboweibu2/lingbo', 'jiuyangshengong/huti'],
    },
];

export default class WuDaoBoss extends NPC {
    name = '<ord>武道塔守护者</ord>';
    desc = '他镇守在武道塔百层之上。';
    gender = 1;
    age = 25;
    no_refresh = true;
    no_fight = true;
    private entry_performs: readonly string[] = [];

    init_from(_player: USER, level: number): void {
        const guardian = GUARDIANS[Math.max(0, Math.min(level - 100, GUARDIANS.length - 1))];
        this.name = guardian.title ? guardian.name : '<ord>' + guardian.name + '</ord>';
        this.title = guardian.title ? '<ord>' + guardian.title + '</ord>' : '';
        const skills: SkillItem[] = guardian.skills.length
            ? guardian.skills
            : [
                  ['force', 5000],
                  ['parry', 5000],
                  ['unarmed', 5000],
                  ['dodge', 5000],
              ];
        this.skill_map(...skills);
        this.set_objects([guardian.weapon, 1, 1]);
        this.entry_performs = guardian.performs ?? [];
        this.init();
        this.recount();
        this.calibrate_panel(guardian.panel);
        this.add_prop(
            'diff_downside_per',
            guardian.downsideResistance - this.query_prop('diff_downside_per'),
        );
        this.set_total_prop('bj_per', guardian.crit);
        this.set_total_prop('diff_bj', guardian.critResistance);
        this.set_total_prop('distime_per', guardian.cooldownReduction);
        this.set_total_prop('add_sh_per', guardian.finalDamage);
        this.set_total_prop('diff_fy_per', guardian.defenseIgnore);
        this.set_total_prop('diff_sh_per', guardian.damageReduction);
        if (guardian.busyReduction) {
            this.add_prop('diff_busy', guardian.busyReduction - this.query_prop('diff_busy'));
        }
        this.hp = this.max_hp = guardian.hp;
        this.mp = this.max_mp = Math.floor(guardian.hp / 2);
        this.recount();
        this.hp = this.max_hp = guardian.hp;
        this.mp = this.max_mp = Math.floor(guardian.hp / 2);
    }

    private set_total_prop(prop: string, target: number): void {
        this.add_prop(prop, target - this.query_prop(prop));
    }

    use_entry_performs(target: CHARACTER): void {
        for (const ref of this.entry_performs) {
            const [skillId, performId] = ref.split('/');
            const skill = SKILL.get(skillId);
            const perform = skill?.get_pfm(performId);
            if (!skill || !perform) continue;
            const level = this.query_skill(skillId, 0);
            this.use_pfm(performId === 'zhenyan' ? target : this, perform, level, 'force');
        }
    }

    private calibrate_panel(target: number): void {
        this.calibrate_combat_prop('gj', 'gj_per', target);
        this.calibrate_combat_prop('mz', 'mz_per', target);
        this.calibrate_combat_prop('zj', 'zj_per', target);
        this.calibrate_combat_prop('fy', 'fy_per', target);
        this.calibrate_combat_prop('ds', 'ds_per', target);
    }

    private calibrate_combat_prop(
        prop: 'gj' | 'mz' | 'zj' | 'fy' | 'ds',
        percentageProp: 'gj_per' | 'mz_per' | 'zj_per' | 'fy_per' | 'ds_per',
        target: number,
    ): void {
        for (let i = 0; i < 3 && this[prop] !== target; i++) {
            const multiplier = Math.max((100 + this.query_prop(percentageProp)) / 100, 0.01);
            this.add_prop(prop, (target - this[prop]) / multiplier);
            this.recount();
        }
    }
}
