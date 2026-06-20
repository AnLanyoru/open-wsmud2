import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "北冥神功";
    id = "beimingshengong3";
    grade = 6;
    
    desc = "逍遥派镇派神功，可吸取他人内力以供己用，是迅速提升功力的捷径功法。";
    can_enables = ["force","parry"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '每次吸取内力额外增加：+10',
        },
        {
            prop: 'slot_1',
            value: (lv: number) => 10,
            format: (val: number) => '吸取内力的内置冷却减少1秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                con: 510,
                dex: 501,
                limit_mp: 245000,
                desc: "当你命中敌人后，会吸取对方内力增加自身最大内力; 唯一将你内力的80%转化为气血",
            },
            parry: {
                zj: 1820,
                dex: 252,
                max_hp: 13000,
                desc: "当你招架成功后会吸取对方内力增加自身最大内力",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "鲲字诀",
            distime: 28500,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 鲲字诀
                // 战斗中恢复自己15%气血，内力。
                me.send_room("$N使出「鲲字诀」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "战斗中恢复自己15%气血，内力。";
            },
        },
    };
}
