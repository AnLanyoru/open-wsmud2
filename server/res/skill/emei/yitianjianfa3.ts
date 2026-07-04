import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type { PropMap } from "../../../types/props.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "倚天剑法";
    id = "yitianjianfa3";
    grade = 6;
    family = FAMILIES.EMEI;
    is_hidden = true;
    desc = "峨眉派祖师郭襄在得到倚天剑后自创的一式剑法，招式狠辣，不留余地。";
    can_enables = ["sword"];
    attack_actions = SKILL.get("sword")?.attack_actions || [];

    query_prop(lv: number, me: CHARACTER): PropMap {
        return {
            diff_fy_per: 5 + Math.floor(lv / 300)
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 30 + lv * 3,
                mz: Math.floor(lv * 2.5) + 20,
                mz_per: 5 + Math.floor(lv / 300),
                add_bjsh_per: 10 + Math.floor(lv / 200),
                desc: "命中敌人后会使敌方防御减少1%，伤害加深1%，可叠加最高20层",
            },
        };
    }

    on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (!par.is_dodged && !par.is_parried) {
            target.add_status({
                id: "fumo",
                name: "伏魔",
                desc: "你的防御减少了，受到的伤害增加了",
                max_count: 20,
                prop: {
                    fy_per: -1,
                    diff_sh_per: -1
                },
                duration: 5000,
                count: 1,
                downside: true,
                override: 1
            });
        }
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "倚天剑决",
            distime: 14250,
            enable_skill: "sword",
            mp: 10,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var mzBonus = 15 + Math.floor(lv / 100);
                var dmgPer = 130 + Math.floor(lv / 50);
                var enemies = me.enemy?.length ? [...me.enemy] : [target];
                var gj = me.gj;
                var str = [
                    "<HIC>-----拔云见日!----- </HIC>\n",
                    "<BLU>-----星河在天!-----</BLU> \n",
                    "<HIY>-----倚天不出!----- </HIY>\n",
                    "<HIR>-----谁与争锋!-----</HIR> \n"
                ];
                me.send_room("<HIY>$N长啸一声：武林至尊、宝刀屠龙。号令天下，莫敢不从。倚天不出，谁与争锋 ！</hiy>\n <HIR>顿时风云变色，$N手中舞出漫天剑光........ \n<HIR>");
                for (var i = 0; i < 4; i++) {
                    var hitAny = false;
                    for (var j = 0; j < enemies.length; j++) {
                        var enemy = enemies[j];
                        if (enemy.hp <= 0) continue;
                        if (me.do_attack({
                            target: enemy,
                            attack_before: str[i],
                            gj: gj,
                            mz: me.mz * (100 + mzBonus) / 100
                        })) {
                            hitAny = true;
                        }
                    }
                    if (hitAny) {
                        gj = gj * dmgPer / 100;
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var mzBonus = 15 + Math.floor(lv / 100);
                var dmgPer = 30 + Math.floor(lv / 50);
                return "倚天剑决，瞬间对所有敌人攻击4次，命中增加" + mzBonus + "%,每次攻击伤害增加" + dmgPer + "%";
            },
        },
        pfm_1: {
            name: "号令天下",
            distime: 28500,
            enable_skill: "sword",
            mp: 10,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var per = 10 + Math.floor(lv / 50);
                if (per > 90) per = 90;
                var count = target.query_status("fumo");
                if (!count) count = 1;
                var totalPer = 100 + per * count;
                if (me.do_attack({
                    attack_msg: "<HIR>$N面容肃穆，高举$W, 顿时剑光暴长，手中$W化作漫天剑光直射$n。<HIR>",
                    target: target,
                    mz: me.mz * totalPer / 100,
                    gj: me.gj * totalPer / 100
                })) {
                    target.clear_downside(false);
                }
                if (count >= 1) target.remove_status("fumo", true);
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var per = 10 + Math.floor(lv / 50);
                if (per > 90) per = 90;
                return "对敌人造成伤害，每层伏魔增加" + per + "%伤害和命中，命中后伏魔重置，驱除对方的有益状态";
            },
        },
    };
}
