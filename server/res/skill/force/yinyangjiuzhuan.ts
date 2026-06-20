import {SKILL, PERFORM} from "../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "阴阳九转";
    id = "yinyangjiuzhuan";
    grade = 6;
    
    desc = "无";
    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                hp_per: 15,
                add_sh_per: 10,
                diff_fy_per: 10,
                diff_sh_per: 10,
                limit_mp: 950000,
                desc: "唯一将你内力的125%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "转阴阳",
            distime: 30000,
            enable_skill: "force",
            mp: 6120,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 转阴阳
                // 九烛：增加55%气血和伤害减免(被动)，命中后造成12000反震伤害
                // 九幽：增加40%攻击，40%无视防御，20%攻击速度
                me.send_room("$N使出「转阴阳」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "转换阴阳二气：九烛增加55%气血和伤害减免，命中后造成12000反震伤害；九幽增加40%攻击、40%无视防御、20%攻击速度";
            },
        },
        pfm_1: {
            name: "定乾坤",
            distime: 60000,
            enable_skill: "force",
            mp: 107100,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 定乾坤
                // 压制附近敌人，4秒内封印敌方技能
                me.send_room("$N使出「定乾坤」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "压制附近敌人，4秒内封印敌方技能";
            },
        },
        pfm_2: {
            name: "镇天地",
            distime: 60000,
            enable_skill: "force",
            mp: 84150,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                // TODO: Implement 镇天地
                // 5秒内大幅增加减伤，引导天地之力攻击单个敌人，每秒造成自己攻击力附加敌方1%当前气血的伤害，1秒后再次使用可取消镇守状态
                me.send_room("$N使出「镇天地」攻向$n。", target);
                me.do_attack({ target, gj: me.gj, mz: me.mz });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                return "5秒内大幅增加减伤，引导天地之力攻击单个敌人，每秒造成自己攻击力附加敌方1%当前气血的伤害，1秒后再次使用可取消镇守状态";
            },
        },
    };
}
