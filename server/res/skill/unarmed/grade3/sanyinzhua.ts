import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "三阴蜈蚣爪";
    id = "sanyinzhua";
    grade = 3;

    // 原始描述：星宿派的拳脚功夫，阴狠毒辣。以三阴之力淬炼指爪，爪中带毒，中者经脉溃烂，毒气攻心，端的歹毒无比。
    desc = "星宿派的拳脚功夫，阴狠毒辣";
    can_enables = ["unarmed","parry"];
    attack_actions = [
        "$N十指如钩，泛起一层暗绿色的幽光，一招「<HIC>蜈蚣噬心</HIC>」带着腥风抓向$n",
        "$N身形如蛇般扭曲，五指成爪，自腋下穿出，正是星宿派的「<HIC>毒蛇出洞</HIC>」",
        "$N双爪连环抓出，招招不离$n的要害，爪风中夹杂着腥臭之气，正是「<HIC>百毒噬体</HIC>」",
        "$N怪啸一声，十指齐张，指风锐利如刀，一式「<HIC>千蛛万毒</HIC>」罩向$n的$l",
        "$N身法诡异，忽左忽右，双爪如鬼魅般探出，正是「<HIC>毒影幢幢</HIC>」的精妙招数",
        "$N探手一抓，五指间隐现紫黑之气，正是「<HIC>五毒追魂</HIC>」，直取$n的$l",
        "$N爪势忽变，由抓变戳，指尖射出缕缕阴毒内力，此招名为「<HIC>断脉截经</HIC>」",
        "$N纵身跃起，头下脚上，双爪自半空疾抓而下，正是星宿派的「<HIC>天毒降世</HIC>」",
        "$N双爪交错，指尖绿芒闪烁，一式「<HIC>碧磷焚心</HIC>」带着剧毒抓向$n",
        "$N怪笑一声，身形急转，双爪如狂风暴雨般疾攻$n周身大穴，正是「<HIC>毒贯山河</HIC>」"
    ];
    parry_actions = [
        "$N十指如钩，以三阴蜈蚣爪的毒辣手法反抓$P的兵器，迫使$P收招回防\n",
        "$N双爪交错，指尖绿芒闪烁，以毒爪之势格挡$P的攻击\n",
    ];
    slots = [
        {
            prop: 'syz_poison',
            value: (lv: number) => 10,
            format: (val: number) => '三阴毒爪命中后使对方中毒，持续3次',
        },
        {
            prop: 'syz_zhsh',
            value: (lv: number) => 10,
            format: (val: number) => '追魂爪附加的伤害增加51%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + Math.floor(lv * 1.6),
                mz: 20 + Math.floor(lv * 1.5),
                dex: 1 + Math.floor(lv / 7),
            },
            parry: {
                zj: 20 + Math.floor(lv * 1.5),
                fy: 20 + lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        du:
            {
                name: "三阴毒爪",
                distime: 18000,
                enable_skill: "unarmed",
                mp: 20,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var per = 7;
                    me.send_room("<HIG>$N厉啸一声，十指泛起诡异的暗绿色光芒，空气中弥漫着腥臭之气</HIG>", target);
                    for (var i = 0; i < 3; i++) {
                        var du_gj = me.gj * per / 100;
                        me.do_attack({
                            target: target,
                            attack_msg: "<hig>$N第" + (i + 1) + "爪破空而至，指尖绿芒闪烁，带着阴毒内力直取$n要害</hig>",
                            miss_msg: "<cyn>$n屏住呼吸，身法施展到极致，勉强避开了这记毒爪</cyn>",
                            gj: du_gj,
                            mz: me.mz,
                            no_weapon: true
                        });
                    }
                    var poison = me.query_prop('syz_poison');
                    if (poison) {
                        target.add_status({
                            id: "poison",
                            name: "中毒",
                            duration: 15000,
                            count: 3,
                            downside: true,
                            desc: "你中了三阴蜈蚣爪的剧毒，每5秒受到毒伤",
                            prop: {
                                max_hp: -lv * 2
                            }
                        }, me);
                    }
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    return "快速攻击敌人三爪，每爪附加你7%的毒质内力。";
                },
            },
        hun:
            {
                name: "追魂爪",
                distime: 18000,
                enable_skill: "unarmed",
                mp: 20,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var per = zhuihunPer(lv);
                    var extra = me.query_prop('syz_zhsh');
                    if (extra) per += extra;
                    var bonus = (1 - target.hp / (target.max_hp || 1)) * 200;
                    var total_gj = me.gj * (per + bonus) / 100;
                    me.send_room("<HIR>$N眼中闪过一丝狠厉之色，五指成爪，带着尖锐的破空声向$n抓去！</HIR>", target);
                    me.do_attack({
                        target: target,
                        attack_msg: "<hir>$N这一爪「追魂」来势汹汹，直取$n胸口要穴，爪风锐利如刀</hir>",
                        damage_msg: "<red>$n被$N一爪命中，只觉得一股阴毒内力透体而入，经脉剧痛</red>",
                        miss_msg: "<cyn>$n见$N爪势凌厉，不敢硬接，急忙侧身闪避</cyn>",
                        gj: total_gj,
                        mz: me.mz,
                        no_weapon: true
                    });
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var per = zhuihunPer(lv);
                    return "对敌人造成" + per + "%的伤害，敌人气血每减低1%，伤害增加2%";
                },
            },
    };
}

function zhuihunPer(lv: number): number {
    var per = 100 + int(lv / 10);
    if (per > 200) per = 200;
    return per;
}
