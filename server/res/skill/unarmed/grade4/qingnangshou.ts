import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "青囊手";
    id = "qingnangshou";
    grade = 4;

    // 原始描述：药王谷独门拳脚功夫，糅合医术点穴之法，刚柔并济暗藏玄机。青囊妙手，既可活人性命，亦可取人性命。
    desc = "药王谷独门拳脚功夫，糅合医术点穴之法，刚柔并济暗藏玄机。";
    can_enables = ["unarmed","parry"];
    attack_actions = [
        "$N五指轻舒，如抚琴弦，一招「<HIC>妙手回春</HIC>」带着一股温润内力拂向$n的$l",
        "$N左指点穴，右掌化劲，正是青囊手的「<HIC>悬壶济世</HIC>」，招式飘逸出尘",
        "$N双掌翻飞，掌影重重，一招「<HIC>药王拂柳</HIC>」带着和煦之风罩向$n",
        "$N食指与中指并拢，如捻金针，疾点$n周身大穴，正是「<HIC>金针渡穴</HIC>」的绝妙手法",
        "$N掌势忽变，由柔转刚，一掌拍出带起呼啸风声，正是青囊手中的「<HIC>刚柔并济</HIC>」",
        "$N双手如穿花蝴蝶般上下翻飞，指尖带起缕缕劲风，正是「<HIC>蝶舞纷飞</HIC>」的精妙招数",
        "$N一掌探出，五指微屈如拈花，一招「<HIC>拈花问诊</HIC>」看似轻柔实藏暗劲",
        "$N身形微侧，右掌自腰间穿出，左掌护胸，正是「<HIC>药炉炼丹</HIC>」的起手式",
        "$N并指如刀，掌缘泛起一层金光，正是青囊手中凌厉的「<HIC>药锄断脉</HIC>」",
        "$N双掌齐出，一上一下，一掌疗伤一掌夺命，正是青囊手之「<HIC>生死两判</HIC>」"
    ];
    parry_actions = [
        "$N双掌翻飞，以青囊手的精妙手法化解$P的攻势",
        "$N五指轻舒，如抚琴弦，以柔劲引开$P的攻击",
    ];
    slots = [
        {
            prop: 'qns_sj_sh',
            value: (lv: number) => 10,
            format: (val: number) => '松筋造成的伤害额外增加50%',
        },
        {
            prop: 'qns_tg_sh',
            value: (lv: number) => 10,
            format: (val: number) => '剔骨会附加自身150%攻击力的伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 8 + Math.floor(lv * 1.8),
                mz: 15 + Math.floor(lv * 2.2),
                add_sh_per: 8,
            },
            parry: {
                fy: 50 + Math.floor(lv * 1.5),
                mz: 10 + Math.floor(lv * 1.6),
                con: 8 + Math.floor(lv / 9),
            },
        };
    }

    pfm_set: PerformData = {
        jin:
            {
                name: "松筋",
                distime: 12000,
                enable_skill: "unarmed",
                mp: 80,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var per = songjinPer(lv);
                    var extra = me.query_prop('qns_sj_sh');
                    if (extra) per += extra;
                    me.send_room("<HIC>$N双手微张，十指如飞，施出青囊手中的松筋活脉秘术，指尖带起一缕缕劲风</HIC>", target);
                    var sh = me.do_attack({
                        target: target,
                        attack_msg: "<hic>$N双手快如闪电，或点或按，或揉或捏，直取$n的关节筋脉</hic>",
                        damage_msg: "<hir>$n被$N击中关节要穴，只觉四肢一麻，劲力顿失</hir>",
                        miss_msg: "<cyn>$n见$N手法精妙，不敢怠慢，凝神应对间闪过了这一击</cyn>",
                        gj: me.gj * per / 100,
                        mz: me.mz,
                        no_weapon: true
                    });
                    if (sh) {
                        var weap = target.query_weapon();
                        if (weap && weap.weapon_type !== WEAPON_TYPE.NONE) {
                            target.unequip(weap, true, 8000);
                            me.send_room("<hiy>$n被$N的松筋手法命中，手中$i脱手飞出！</hiy>", target);
                        }
                    }
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var per = songjinPer(lv);
                    var extra = me.query_prop('qns_sj_sh');
                    if (extra) per += extra;
                    return "施展秘传的松筋活脉，命中后造成" + per + "%攻击力的伤害并且解除对方的武器或拳脚强化。";
                },
            },
        ti:
            {
                name: "剔骨",
                distime: 25000,
                enable_skill: "unarmed",
                mp: 100,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var max_hp = target.max_hp || 1;
                    var lost_hp = max_hp - target.hp;
                    var per = 6;
                    var extra = me.query_prop('qns_tg_sh');
                    if (extra) per += 150 * extra / 100;
                    var dmg = Math.floor(lost_hp * per / 100) + me.gj;
                    me.send_room("<HIC>$N眼中闪过一丝悲悯之色，掌势却毫不留情，以手代刀，直取$n的骨肉要害</HIC>", target);
                    me.do_attack({
                        target: target,
                        attack_msg: "<hic>$N掌势如刀，精准地切入$n的骨肉之间，巧妙避开了所有骨骼的阻挡，直透内腑</hic>",
                        damage_msg: "<hir>$n被$N一招剔骨命中，只觉得骨肉分离之痛传遍全身，痛不欲生！</hir>",
                        miss_msg: "<cyn>$n心中一惊，凌空一个翻身，堪堪避过了这凌厉的一击</cyn>",
                        gj: dmg,
                        mz: me.mz,
                        no_weapon: true,
                        diff_fy: 100
                    });
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    return "医者仁心，以手代刀无视敌方血肉，使对方受到已损失气血6%的内力伤害。";
                },
            },
    };
}

function songjinPer(lv: number): number {
    var per = 100 + int(lv / 20);
    if (per > 150) per = 150;
    return per;
}
