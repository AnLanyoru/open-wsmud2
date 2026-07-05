import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "摧心掌";
    id = "cuixinzhang";
    grade = 3;
    is_public = true;
    
    // 原始描述：催心掌乃是青城绝学，中此掌者，外在并无任何伤痕，但内里的五脏六腑已然碎裂。掌力阴毒，专破内家罡气。
    desc = "催心掌乃是青城绝学，中此掌者，外在并无任何伤痕，但内里的五脏六腑已然碎裂";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N身形鬼魅般飘至，掌心泛黑，一招「<HIC>摧心裂肺</HIC>」无声无息印向$n的$l",
        "$N左掌虚晃，右掌五指微屈如爪，一股阴寒内力透掌而出，正是「<HIC>青城鬼手</HIC>」",
        "$N掌势诡谲，忽左忽右，掌风中夹杂着丝丝阴寒之气，一式「<HIC>阴风入髓</HIC>」罩向$n",
        "$N双掌连环拍出，掌力一重接一重，如浪潮般涌向$n，正是「<HIC>叠浪摧心</HIC>」",
        "$N身形一旋，掌随身转，暗劲自掌心吐出，此招「<HIC>暗渡陈仓</HIC>」端的阴狠毒辣",
        "$N双掌翻飞，掌影重重，猛地一掌拍出，看似轻飘无力，实则「<HIC>绵里藏针</HIC>」暗藏杀机",
        "$N吐气开声，一掌当胸推出，掌力凝而不散，正是「<HIC>破罡碎元</HIC>」的绝妙手法",
        "$N掌势陡变，由实转虚，由刚转柔，一式「<HIC>摧心断脉</HIC>」已然拂向$n的$l",
        "$N五指成爪，凌空一抓，一股阴毒内力隔空射向$n，正是「<HIC>隔山打牛</HIC>」的化用",
        "$N蓦地转身反手一掌，掌心隐现青黑之色，此招「<HIC>回风拂柳</HIC>」暗藏摧心掌力"
    ];
    slots = [
        {
            prop: 'cxz_ds_sh',
            value: (lv: number) => 10,
            format: (val: number) => '催心掌阴毒爆发时造成120%催心掌力的伤害',
        },
        {
            prop: 'cxz_zj_cx',
            value: (lv: number) => 10,
            format: (val: number) => '命中后招架失败也可触发催心效果',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.52),
                mz: Math.floor(lv * 1.42),
            },
        };
    }

    pfm_set: PerformData = {
        cui:
            {
                name: "催心",
                distime: 20000,
                enable_skill: "unarmed",
                mp: 20,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var per = cuixinPer(lv);
                    var time = 7000 + lv * 0;
                    var faint = 4000;
                    me.send_room("<HIB>$N眼神一寒，掌心泛起一层青黑色的雾气，内力催动之下，阴毒之气弥漫四周</HIB>", target);
                    var sh = me.do_attack({
                        target: target,
                        attack_msg: "<hib>$N悄无声息地一掌拍出，掌力阴柔至极，直透$n的护体真气，直击五脏六腑</hib>",
                        damage_msg: "<hir>$n被$N一掌击中，只觉得一股阴寒之力侵入体内，五脏六腑如被撕裂般剧痛</hir>",
                        miss_msg: "<cyn>$n察觉到$N掌力中的阴毒之气，急施身法，向后疾退数丈</cyn>",
                        gj: me.gj * per / 100,
                        mz: me.mz,
                        no_weapon: true
                    });
                    if (sh) {
                        target.add_status({
                            id: "cxz_poison",
                            name: "摧心毒",
                            duration: time,
                            downside: true,
                            desc: "你中了摧心掌的阴毒，五脏六腑正被逐渐侵蚀",
                            prop: {
                                diff_sh_per: -20
                            },
                            on_expire: function(p: CHARACTER) {
                                var extra = me.query_prop('cxz_ds_sh');
                                if (extra) {
                                    p.add_hp(-me.gj * extra / 100);
                                }
                                p.add_status({
                                    id: "faint",
                                    is_faint: true,
                                    name: "昏迷",
                                    duration: faint,
                                    downside: true,
                                    desc: "摧心掌毒发作，你陷入了昏迷",
                                    start_msg: "<hir>$n体内的阴毒猛然发作，只觉得眼前一黑，便什么也不知道了</hir>\n",
                                    finish_msg: "<hiy>慢慢的$n又恢复了知觉...</hiy>\n"
                                }, me);
                            }
                        }, me);
                    }
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var per = cuixinPer(lv);
                    return "对敌人造成你" + per + "%伤害，并使敌人受到阴毒伤害，7秒后毒发昏迷4秒。";
                },
            },
    };
}

function cuixinPer(lv: number): number {
    var per = 100 + int(lv / 10);
    if (per > 200) per = 200;
    return per;
}
