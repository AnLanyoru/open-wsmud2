import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar, CharacterStatus } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "黯然销魂掌";
    id = "anranxiaohun";
    grade = 5;

    desc = "神雕大侠杨过和小龙女分开后，因为刻骨思念之情而创出的一路掌法，黯然销魂者，唯别而已矣";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N黯然神伤间双掌一错，使出一招「<HIC>徘徊空谷</HIC>」，掌风萧瑟，凄然拍向$n的$l",
        "$N长叹一声，双掌似有若无地推出，正是「<HIC>力不从心</HIC>」，掌力若即若离地飘向$n的$l",
        "却见$N神情木然，双掌如行尸走肉般缓缓推出，一招「<HIC>行尸走肉</HIC>」带起阵阵阴风",
        "$N身形踉跄，掌法凌乱中带着奇诡，一式「<HIC>拖泥带水</HIC>」缠缠绵绵地裹向$n的$l",
        "$N魂不守舍地拍出一掌，掌到中途却陡然变向，「<HIC>魂不守舍</HIC>」竟从绝不可能的方位击至",
        "$N恍恍惚惚间左掌右拳，一招「<HIC>倒行逆施</HIC>」逆势而上，直取$n的$l",
        "只见$N面如死灰，双掌却凌厉无匹，一式「<HIC>穷途末路</HIC>」带着决绝之意猛击$n的$l",
        "$N痴痴呆呆地挥掌拍出，黯然销魂之意弥漫四周，「<HIC>废寝忘食</HIC>」已无声无息地罩向$n",
        "$N身法飘忽，双目含悲，一招「<HIC>心惊肉跳</HIC>」伴着幽幽叹息击向$n的$l",
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + Math.floor(lv * 2.3),
                mz: 20 + Math.floor(lv * 1.7),
                int: 12 + Math.floor(lv * 0.25),
                con: 12 + Math.floor(lv * 0.25),
                diff_downside_per: 10,
            },
        };
    }

    pfm_set: PerformData = {
        wu: {
            name: "无中生有",
            distime: 20000,
            enable_skill: "unarmed",
            mp: 34,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj * 2,
                    mz: me.mz,
                    attack_msg: "<hiy>$N黯然长叹，双掌似有似无地缓缓推出，正是黯然销魂掌中最诡异的「<HIC>无中生有</HIC>」！</hiy>",
                    miss_msg: "<cyn>$n心头一凛，于千钧一发之际堪堪避过这无形无迹的一掌。</cyn>",
                    damage_msg: "<hir>只听「嘭」地一声闷响，$n已被$N一掌击中，浑身一震，面色大变！</hir>",
                });
                if (sh && target.status && target.status.length > 0) {
                    for (var i = 0; i < target.status.length; i++) {
                        var buff = target.status[i];
                        if (!buff.downside && buff.name && !buff.no_clear) {
                            var stolen_prop = buff.prop;
                            var stolen_name = buff.name;
                            me.send_room("<hiz>$N掌力一吐，竟从$n身上生生剥离出一道「" + stolen_name + "」气劲，化为己用！</hiz>", target);
                            me.add_status({
                                id: "anran_steal_" + buff.id,
                                name: stolen_name,
                                duration: buff.duration,
                                prop: stolen_prop,
                            });
                            target.remove_status(buff.id);
                            break;
                        }
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "对敌人造成200%的伤害，命中后会偷取敌人的一个正面状态附加自身";
            },
        },
        dai: {
            name: "呆若木鸡",
            distime: 36000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 3000 + lv * 3;
                if (time > 8000) time = 8000;
                var sh = me.do_attack({
                    target: target,
                    gj: Math.floor(me.gj * 2.66),
                    mz: me.mz * 2,
                    attack_msg: "<hiy>$N双目无神，神情呆滞，却于一瞬间拍出惊天动地的一掌——黯然销魂掌之「<HIC>呆若木鸡</HIC>」！</hiy>",
                    miss_msg: "<cyn>$n被$N这一掌的气势所慑，于间不容发之际拼命闪开！</cyn>",
                    damage_msg: "<hir>$n被$N一掌印在胸口，整个人如遭雷击，呆立当场！</hir>",
                });
                if (sh) {
                    target.add_status({
                        id: "anran_dai",
                        name: "呆若木鸡",
                        duration: time,
                        downside: true,
                        prop: {
                            gjsd_per: -60,
                        },
                        desc: "攻击速度和技能释放速度降低60%",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "超高命中的一击，对敌人造成266%的伤害，命中减少对方60%攻击速度和技能释放速度";
            },
        },
    };
}
