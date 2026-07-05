import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData} from "../../../../core/skill/skill.js";
import type { PropMap } from "../../../../types/props.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "火龙攻击";
    id = "huolong";
    grade = 4;
    
    desc = "上古火龙，吞吐烈焰，爪牙皆可伤人，中者火毒攻心，气血难复";
    can_enables = [];

    query_prop(lv: number): PropMap {
        return {
            gj: lv * 2,
            mz: lv * 2,
            fy: lv * 2,
            zj: lv * 2,
            ds: lv * 1,
        };
    }

    pfm_set: PerformData = {
        du: {
            name: "火毒攻击",
            distime: 60000,
            enable_skill: "force",
            mp: 510,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIR>$N张口喷出一道炽热的火焰，$n被火海吞没！</HIR>", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });

                if (target.hp > 0) {
                    var dmg = Math.floor(lv * 3);
                    target.add_status({
                        id: "huolong_huodu",
                        name: "火毒",
                        desc: "身中火毒，每三秒减少气血",
                        duration: 15000,
                        duration_count: 5,
                        downside: true,
                        override: 1,
                        on_interval: function(t, count) {
                            t.from_attack(dmg, 999999, '', "<HIR>$n体内火毒发作，痛不欲生！</HIR>");
                        },
                        finish_msg: "<HIW>$n体内的火毒终于被逼出体外。</HIW>",
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "每三秒减少气血";
            },
        },
        yao: {
            name: "撕咬",
            distime: 7000,
            enable_skill: "force",
            mp: 510,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIR>$N发出震天咆哮，疯狂的扑向$n，利爪獠牙齐施！</HIR>", target);
                for (var i = 0; i < 5; i++) {
                    me.do_attack({ target, gj: me.gj, mz: me.mz });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "快速攻击5次";
            },
        },
        she: {
            name: "威慑",
            distime: 20000,
            enable_skill: "force",
            mp: 510,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room("<HIR>$N仰天发出一声震天巨吼，$n被龙威震慑，心神剧震！</HIR>", target);
                me.do_attack({ target, gj: Math.floor(me.gj * 2.5), mz: Math.floor(me.mz * 1.5) });

                if (target.hp > 0) {
                    target.add_status({
                        id: "busy",
                        name: "忙乱",
                        duration: 4000,
                        downside: true,
                    }, me);
                }

                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "威慑对方，2倍攻击的伤害并忙乱";
            },
        },
    };
}
