import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "五毒钩法";
    id = "wudugoufa";
    grade = 3;

    desc = "五毒教的高级剑法，阴狠毒辣";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一钩，带起一道<MAG>惨绿</MAG>光芒，如毒蛇吐信般阴狠地钩向$n$l",
        "$N$w斜钩，招式<MAG>阴毒</MAG>诡异，$w上隐隐泛着<MAG>紫黑</MAG>光芒，显然淬有剧毒",
        "$N身形鬼魅般一闪，$w以一个意想不到的角度钩出，正是五毒钩法中的一招<MAG>「青蛇缠腕」</MAG>",
        "$N$w连钩带刺，招式<MAG>狠辣</MAG>歹毒，每一招都直取$n的要害部位",
        "$N冷笑一声，$w上<MAG>毒芒</MAG>大盛，一招「<MAG>蝎尾藏针</MAG>」阴损无比地袭向$n$l"
    ];
    slots = [
        {
            prop: 'jghs_sb',
            value: (lv: number) => 10,
            format: (val: number) => '金钩锁魂失败后也可以触发后续效果',
        },
        {
            prop: 'jghs_lv',
            value: (lv: number) => 10,
            format: (val: number) => '金钩锁魂判定成功的有效等级增加60级',
        },
        {
            prop: 'ds_sh',
            value: (lv: number) => 10,
            format: (val: number) => '毒伤效果额外附加3250点伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                str: 1 + Math.floor(lv * 0.2),
                mz: 10 + Math.floor(lv * 1.4),
                desc: "当你命中敌人后对敌人造成毒素伤害",
            },
        };
    }

    pfm_set: PerformData = {
        gou: {
            name: "金钩锁魂",
            distime: 25000,
            enable_skill: "sword",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var rate = calcJGHSRate(lv);
                var roll = int(Math.random() * 100);
                var disarmed = roll < rate;
                var weap = target.query_weapon();
                me.send_room("<MAG>$N手中$W一翻，带着一道惨绿毒芒，如毒钩般锁向$n的兵器！</MAG>", target);
                if (disarmed && weap && weap.weapon_type !== WEAPON_TYPE.NONE) {
                    me.send_room("<MAG>只听得「叮当」一声，$n的兵器被$N的$W牢牢锁住，脱手飞出！</MAG>", target);
                    target.unequip(weap, true, 10000);
                }
                for (var i = 0; i < 4; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: i > 0 ? "<MAG>钩势未衰，紧跟着又是一钩</MAG>" : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var rate = calcJGHSRate(lv);
                return "打掉对方兵器，成功率" + rate + "%，成功后继续攻击对方4次，等级越高成功率越高";
            },
        },
    };
}

function calcJGHSRate(lv: number): number {
    return 30 + int(lv / 10);
}
