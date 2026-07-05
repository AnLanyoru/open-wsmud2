import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "金蛇锥法";
    id = "jinshezhui";
    grade = 2;
    is_public = true;
    
    // 原始描述：金蛇郎君创造的一门暗器功法，以金蛇锥催动，如群蛇出洞，噬人于无形
    desc = "金蛇郎君创造的一门暗器功法";
    can_enables = ["throwing"];
    attack_actions = [
        "$N手腕一翻，$T化作一道金光，如灵蛇出洞般射向$n的$l",
        "$N指尖连弹，数枚$T带起尖锐破空声，分取$n周身大穴",
        "$N身形一旋，$T自掌心激射而出，轨迹诡异如蛇行",
        "$N冷笑一声，$T脱手飞出，在半空中划出一道金弧",
        "$N双指一错，$T如金蛇吐信般颤射而出，直取$n的$l",
        "$N袖袍鼓风，$T自袖中飞出，真假难辨地罩向$n",
    ];

    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '千蛇出洞命中增加10%',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '千蛇出洞最大次数增加1次',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            throwing: {
                gj: 10 + lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        she: {
            name: "千蛇出洞",
            distime: 10000,
            enable_skill: "throwing",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var count = 3 + Math.floor(lv / 500);
                var extraMZ = 10;

                me.send_room("<HIY>$N双掌齐扬，$T化作漫天金蛇，铺天盖地地罩向$n！</HIY>", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({ target, gj: me.gj, mz: me.mz + extraMZ });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "使用暗器对敌人发动攻击";
            },
        },
    };
}
