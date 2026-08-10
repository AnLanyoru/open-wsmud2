import { NPC } from '../../../core/char/npc.js';
import { OBJ } from '../../../core/item/obj.js';
import type { CORPSE } from '../../../core/item/corpse.js';
import type { USER } from '../../../core/char/user.js';
import type { FAMILY } from '../../../core/skill/family.js';
import type { SkillItem } from '../../../core/skill/skill.js';
import { GRADE_COLORS } from '../../../core/const.js';
import { UTIL } from '../../../core/util/util.js';
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

        const skillLevels = [0, 200, 350, 500, 800, 1200];
        const skillLevel = skillLevels[grade] ?? 1200;
        const skills: SkillItem[] = fam.npc_skills.map((item) => [item[0], skillLevel, item[2]]);
        this.skill_map.apply(this, skills);
        const equipment = FAMILY_EQUIPMENT[fam.id] ?? [];
        for (const item of equipment.slice(0, 2)) {
            this.set_objects([`${item.path}#${grade}`, 1, 1]);
        }
        this.level = Math.min(6, Math.max(1, grade));
        this.str = this.con = this.dex = this.int = 20 + grade * 12;
        this.max_mp = this.mp = [0, 2000, 5000, 10000, 20000, 40000][grade] ?? 40000;
        this.max_hp = this.hp = [0, 5000, 12000, 30000, 80000, 160000][grade] ?? 160000;
        this.exp = skillLevel * skillLevel * 10;
        this.no_refresh = true;
        this.is_drop = false;
        this.record_damage = grade >= 3;
        this.init();
        this.recount();
        this.recount_max_hp();
        this.hp = this.max_hp;
        this.mp = this.max_mp;
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
