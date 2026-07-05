import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "参合指";
    id = "canhezhi";
    grade = 4;
    is_public = true;
    
    // 原始描述：慕容世家的一式家传指法，参合之名取自慕容世家祖宅参合陂。以彼之道，还施彼身，指力阴阳并济，变化无穷。
    desc = "慕容世家的一式家传指法";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N衣袂飘飘，食指凌空一点，一道无形指劲破空而出，正是慕容世家不传之秘「<HIC>参合指</HIC>」",
        "$N并指如剑，一缕劲风自指尖激射而出，似正似奇，正是「<HIC>参商永隔</HIC>」的精妙起手",
        "$N左手虚引，右手食中二指并拢，一记「<HIC>参合破虚</HIC>」直取$n的$l",
        "$N双指连弹，指风如雨，点点寒芒笼罩$n周身大穴，正是「<HIC>天河星落</HIC>」",
        "$N一指点出，看似平平无奇，实则暗藏慕容家的斗转星移之力，正是「<HIC>参合之镜</HIC>」",
        "$N长袖轻拂，指尖在袖底穿出，指法变幻莫测，正是「<HIC>袖底参合</HIC>」的精妙招数",
        "$N食指微曲，轻轻一弹，一道凌厉指风如流星赶月般射向$n，正是「<HIC>弹指定乾坤</HIC>」",
        "$N身形不动，只是遥遥一指点出，指劲却已跨越数丈距离，正是「<HIC>隔空点穴</HIC>」",
        "$N指法忽变，由快转慢，一指点出，劲力内敛，看似轻柔实则暗藏杀机，正是「<HIC>参合藏锋</HIC>」",
        "$N食指连点三下，三道指劲分取$n上中下三路，正是慕容家传的「<HIC>三叠参合</HIC>」"
    ];
    slots = [
        {
            prop: 'chz_max',
            value: (lv: number) => 10,
            format: (val: number) => '参合指的最大层数可达到20层',
        },
        {
            prop: 'chz_no_reset',
            value: (lv: number) => 10,
            format: (val: number) => '参合之殇不会重置参合层数',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.52),
                mz: Math.floor(lv * 1.52),
                bj_per: 4,
                int: Math.floor(lv * 0.169),
                desc: "命中后使敌人受到的伤害增加1001可叠加10层",
            },
        };
    }

    pfm_set: PerformData = {
        can:
            {
                name: "参合之殇",
                distime: 20000,
                enable_skill: "unarmed",
                mp: 20,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var chz_count = target.query_status("canhezhi") || 0;
                    var per = chz_count * 30;
                    var max_chz = me.query_prop('chz_max');
                    var faint_need = 4;
                    if (max_chz) faint_need = 5;
                    me.send_room("<HIM>$N食指微抬，一缕若有若无的指风在指尖萦绕，正是慕容家不世绝学——参合指！</HIM>", target);
                    var sh = me.do_attack({
                        target: target,
                        attack_msg: "<him>$N一指向$n点出，指风中隐现金戈铁马之声，似有千军万马奔腾而来，正是参合指的精髓所在</him>",
                        damage_msg: "<mag>$n被$N一指击中，只觉一股沛然莫御的指力透体而入，经脉如遭重锤</mag>",
                        miss_msg: "<cyn>$n识得慕容家参合指的厉害，不敢硬接，身法如电般向旁闪开</cyn>",
                        gj: me.gj * (100 + per) / 100,
                        mz: me.mz,
                        no_weapon: true
                    });
                    if (sh) {
                        if (chz_count >= faint_need) {
                            target.add_status({
                                id: "faint",
                                is_faint: true,
                                name: "昏迷",
                                duration: 5000,
                                downside: true,
                                desc: "参合指力透体，你陷入了昏迷",
                                start_msg: "<hir>$n被$N参合指力击中，只觉眼前一黑，失去了知觉</hir>\n",
                                finish_msg: "<hiy>$n悠悠转醒，发现自己竟昏了过去</hiy>\n"
                            }, me);
                        }
                        if (!me.query_prop('chz_no_reset')) {
                            target.remove_status("canhezhi");
                        }
                    }
                    target.add_status({
                        id: "canhezhi",
                        name: "参合",
                        duration: 30000,
                        count: 1,
                        downside: true,
                        override: 2,
                        max_count: max_chz || 10,
                        prop: {
                            diff_sh_per: -10
                        },
                        desc: "你被参合指力标记，受到的伤害增加"
                    }, me);
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var max_chz = me.query_prop('chz_max');
                    var faint_need = 4;
                    if (max_chz) faint_need = 5;
                    return "对敌人造成伤害，每层参合状态增加你30%伤害，如果对方层数大于" + faint_need + "层将昏迷5秒。";
                },
            },
    };
}
