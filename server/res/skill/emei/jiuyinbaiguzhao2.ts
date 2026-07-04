import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../core/const.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "九阴白骨爪";
    id = "jiuyinbaiguzhao2";
    source_skill = "jiuyinbaiguzhao";
    grade = 4;
    family = FAMILIES.EMEI;
    desc = "九阴真经里记载的外门功夫，阴狠毒辣";
    can_enables = ["unarmed","parry"];
    attack_actions = SKILL.get("unarmed")?.attack_actions || [];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '夺魄造成的伤害增加30%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '风卷残云最低攻击次数+1',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + lv * 2,
                mz: 20 + lv * 2,
                diff_fy_per: 3 + Math.floor(lv / 300),
                desc: "对方气血每降低1%，你的九阴白骨爪伤害和命中增加" + (lv >= 1000 ? "2%" : "1%"),
            },
            parry: {
                zj: 20 + lv * 2,
                fy: 20 + lv * 2,
                max_hp: lv * 20,
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "夺魄",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var gj = me.gj * (200 + lv / 10) / 100;
                var sh = me.do_attack({
                    target: target,
                    gj: gj,
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: "<hiy>$N冷笑数声，手指微微弯曲成爪，身形疾转，飞向$n头顶抓下</hiy>",
                    damage_msg: "<hir>$n哪里料到$N竟有如此变招，不及躲闪，被$P抓了个鲜血淋漓，头痛欲裂。</hir>"
                });
                if (sh) {
                    var time = 3000 + lv * 5;
                    if (time > 10000) time = 10000;
                    target.add_status({
                        id: "unarmed",
                        name: "夺魄",
                        desc: "你陷入了昏迷状态",
                        is_faint: true,
                        duration: time,
                        downside: true
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var gj = 200 + Math.floor(lv / 10);
                var time = 3000 + lv * 5;
                if (time > 10000) time = 10000;
                return "快速狠辣的攻击，命中后对敌人造成你攻击力" + gj + "%的伤害，并使敌方昏迷" + (time / 1000) + "秒。";
            },
        },
        pfm_1: {
            name: "风卷残云",
            distime: 18000,
            enable_skill: "unarmed",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var threshold = 30 - Math.floor(lv / 100);
                if (threshold < 10) threshold = 10;
                var count = Math.floor((100 - target.hp * 100 / target.max_hp) / threshold) + 3;
                me.send_room("<hir>$N一声厉啸，手指弯曲成爪，身形疾转，双爪化为一片残影，飞向$n抓去</hir>\n", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        no_weapon: true
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var threshold = 30 - Math.floor(lv / 100);
                if (threshold < 10) threshold = 10;
                return "对敌人进行快速攻击，对方的气血每降低" + threshold + "%，你的攻击次数增加1次";
            },
        },
    };
}
