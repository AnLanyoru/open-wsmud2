import { NPC } from '../../../core/char/npc.js';
import { OBJ } from '../../../core/item/obj.js';
import type { CORPSE } from '../../../core/item/corpse.js';
import type { USER } from '../../../core/char/user.js';
import type { FAMILY } from '../../../core/skill/family.js';
import type { SkillItem } from '../../../core/skill/skill.js';
import { GRADE_COLORS } from '../../../core/const.js';
import { UTIL } from '../../../core/util/util.js';
import { WORLD } from '../../../core/world.js';
import { FAMILY_EQUIPMENT } from '../../data/family_equipment.js';

export default class extends NPC {
    name = '门派弟子';
    desc = '门派弟子';
    title = '';
    gender = 1;
    age = 25;
    per = 18;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    no_refresh = true;
    is_drop = false;

    init_from(fam: FAMILY, grade: number, role: 'disciple' | 'elder' | 'boss' = 'disciple') {
        const config = fam.battle_config;
        if (!config) throw new Error(`${fam.name}缺少门派战配置`);

        this.family = fam;
        this.family_level = grade;
        this.battle_grade = grade;
        this.battle_role = role;
        this.battle_death_handled = false;
        this.name = fam.create_name(this);
        const titleKey = role === 'boss' ? 'boss' : role === 'elder' ? 'elder' :
            (['green', 'blue', 'yellow', 'purple'] as const)[grade - 1];
        const title = config.titles[titleKey];
        const color = GRADE_COLORS[grade] ?? 'wht';
        this.title = `<${color}>${title}</${color}>`;
        this.desc = `这是${fam.name}派驻战场的${title}。`;
        this.gender = fam.gender ?? (this.random(2) + 1);

        const skillLevels = [0, 100, 500, 900, 1000];
        const skillLevel = role === 'boss' ? 2000 : role === 'elder' ? 1500 :
            (skillLevels[grade] ?? 1000);
        const skillSource = (role === 'boss' || role === 'elder'
            ? (fam.boss_skills.length ? fam.boss_skills : fam.npc_skills)
            : fam.npc_skills) as SkillItem[];
        const skills: SkillItem[] = skillSource.map((item) => {
            const battleSkill = grade === 1 ? this.query_green_skill(fam, item) : item;
            return [battleSkill[0], skillLevel, battleSkill[2]];
        });
        this.skill_map.apply(this, skills);
        const equipment = FAMILY_EQUIPMENT[fam.id] ?? [];
        for (const item of equipment.slice(0, 2)) {
            this.set_objects([`${item.path}#${grade}`, 1, 1]);
        }
        this.level = Math.min(6, Math.max(1, grade));
        this.str = this.con = this.dex = this.int = 20 + grade * 12;
        const combatAttribute = role === 'boss' ? 100000 : role === 'elder' ? 50000 :
            ([0, 500, 5000, 10000, 25000] as number[])[grade] ?? 25000;
        const health = role === 'boss' ? 90000000 : role === 'elder' ? 50000000 :
            ([0, 2000, 40000, 200000, 2000000] as number[])[grade] ?? 2000000;
        this.max_mp = this.mp = Math.floor(health / 2);
        this.exp = skillLevel * skillLevel * 10;
        this.no_refresh = true;
        this.is_drop = false;
        this.record_damage = grade >= 3;
        for (const property of ['gj', 'mz', 'zj', 'fy', 'ds'] as const) {
            this.add_prop(property, combatAttribute);
        }
        this.init();
        this.recount();
        this.calibrate_max_hp(health);
        this.hp = this.max_hp;
        this.mp = this.max_mp;
    }

    /** 绿弟子不使用紫色武功，按原技能位换成本门最高不超过黄色的武功。 */
    private query_green_skill(fam: FAMILY, item: SkillItem): SkillItem {
        const skill = WORLD.SKILLS.get(item[0]);
        if (!skill || skill.grade !== 4) return item;

        const requested = typeof item[2] === 'string' ? [item[2]] : item[2] ?? skill.can_enables;
        const replacement = fam.skills
            .filter(candidate =>
                candidate.grade > 0 &&
                candidate.grade < 4 &&
                candidate.can_enables.some(enable => requested.includes(enable)),
            )
            .sort((a, b) => b.grade - a.grade)[0];
        if (!replacement) return item;

        const enables = requested.filter(enable => replacement.can_enables.includes(enable));
        return [replacement.id, item[1], enables.length === 1 ? enables[0] : enables];
    }

    /** 校准技能、装备和内力转化后的气血。 */
    private calibrate_max_hp(target: number) {
        for (let i = 0; i < 3 && this.max_hp !== target; i++) {
            const multiplier = Math.max((100 + this.query_prop('hp_per')) / 100, 0.01);
            this.add_prop('max_hp', (target - this.max_hp) / multiplier);
            this.recount_max_hp();
        }
    }

    /** 敌方玩家进入战场时，由品级不低于玩家境界的弟子主动叫杀。 */
    on_enter(target: NPC | USER) {
        if (!target.check_player() || this.hp <= 0) return;
        const me = target as USER;
        if ((this.battle_grade ?? 0) < me.level) return;
        const isBattleEnemy = me.family?.id === this.family.battle_family;
        const isAssassin = me.family?.id === 'SHASHOU' &&
            me.family.query_temp('ss_target') === this.family.id;
        if (isBattleEnemy || isAssassin) this.do_kill(me);
    }

    prepare_battle_corpse(corpse: CORPSE, eligibleIds: string[]) {
        const eligible = new Set(eligibleIds);
        const claimed = new Set<string>();
        let remaining = eligible.size;
        corpse.no_alloc = true;
        corpse.items = null;

        const finish = (me: USER) => {
            if (claimed.has(me.id)) return;
            claimed.add(me.id);
            remaining--;
            if (remaining <= 0) corpse.disappear();
        };

        corpse.query_items = (me: USER) => {
            if (!eligible.has(me.id)) return;
            if (!this.user_items) this.user_items = {};
            if (this.user_items[me.id]) return this.user_items[me.id];
            if (claimed.has(me.id)) return;
            if (me.query_temp('mp_battle_drop', 0) >= 10) {
                me.notify('你今天获得的门派战战利品已经达到10次上限。');
                finish(me);
                return;
            }

            const grade = this.battle_grade ?? 1;
            const equipmentOdds = [0, 3000, 2000, 500, 200, 10][grade] ?? 0;
            const crystalRanges = [[0, 0], [1, 5], [6, 10], [11, 15], [16, 20], [21, 50]];
            const silverMins = [0, 10, 20, 30, 40, 50];
            const equipment = FAMILY_EQUIPMENT[this.family.id] ?? [];
            const equipmentPaths = equipment.map((item) => `${item.path}#${grade}`);
            const [crystalMin, crystalMax] = crystalRanges[grade] ?? [1, 1];
            const drops = [
                { obj: 'st/xuanjing', min: crystalMin, max: crystalMax },
                { obj: 'money/silver', min: silverMins[grade] ?? 10, max: 99 },
            ];
            if (equipmentPaths.length) drops.push({ obj: equipmentPaths, odds: equipmentOdds } as any);
            const items = OBJ.create_by_odds(drops);
            this.user_items[me.id] = items;
            me.add_temp('mp_battle_drop', 1, UTIL.diff_time());
            return items;
        };

        corpse.clear_items = (me: USER, noget?: any[]) => {
            const items = this.user_items?.[me.id];
            if (items) {
                items.length = 0;
                if (noget?.length) items.push(...noget);
            }
            if (!noget?.length) finish(me);
        };

        if (remaining === 0) corpse.disappear();
    }
}
