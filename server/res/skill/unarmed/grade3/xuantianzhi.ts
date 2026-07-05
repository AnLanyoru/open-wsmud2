import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "玄天指";
    id = "xuantianzhi";
    grade = 3;
    is_public = true;
    
    // 原始描述：梅庄二庄主黑白子的得意绝技，指力阴寒强劲，可隔空点穴，伤人于丈许之外。一指既出，冰封百里。
    desc = "梅庄二庄主黑白子的得意绝技，指力阴寒强劲，可隔空点穴，伤人于丈许之外";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N食指微屈，指尖凝起一层寒霜，一缕阴寒指力破空而出，正是「<HIC>寒冰指</HIC>」直取$n的$l",
        "$N气运丹田，内力贯于指尖，遥遥一指，一道无形寒气如箭般射向$n，乃是「<HIC>凝气成冰</HIC>」",
        "$N双指齐出，一道寒一阳暖，两道截然不同的指力交织成网，正是「<HIC>阴阳交错</HIC>」",
        "$N默运玄功，指尖透出缕缕白气，一指点出，寒气弥漫，正是「<HIC>寒梅吐蕊</HIC>」的精要",
        "$N食指连弹，三道寒冰指劲呈品字形射向$n，正是黑白子的「<HIC>三九寒天</HIC>」",
        "$N并指如剑，指尖泛起一层蓝光，隔空向$n连点，正是「<HIC>寒星点点</HIC>」的绝妙招数",
        "$N深吸一口气，一指缓缓点出，看似缓慢，实则封死了$n所有闪避路线，正是「<HIC>冰封三尺</HIC>」",
        "$N身形飘飘，凌空一指向$n点来，指风凛冽如刀，正是「<HIC>凌空虚点</HIC>」的玄妙手法",
        "$N双指微曲，轻轻一弹，一道寒芒激射而出，正是「<HIC>弹指飞霜</HIC>」的独门绝技",
        "$N一指当胸，指尖寒气大盛，空气都似要被冻结，正是玄天指的「<HIC>万里冰封</HIC>」"
    ];
    slots = [
        {
            prop: 'xtz_ds_mz',
            value: (lv: number) => 10,
            format: (val: number) => '寒阴指劲在对方躲闪失败后即可起效',
        },
        {
            prop: 'xtz_sd_down',
            value: (lv: number) => 10,
            format: (val: number) => '寒阴指劲降低攻速效果+10%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.43),
                mz: 5 + Math.floor(lv * 1.43),
                dex: Math.floor(lv * 0.086),
            },
        };
    }

    pfm_set: PerformData = {
        han:
            {
                name: "寒阴指劲",
                distime: 20000,
                enable_skill: "unarmed",
                mp: 15,
                release_time: 4000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var per = hanyinPer(lv);
                    var sd_down = 30;
                    var extra = me.query_prop('xtz_sd_down');
                    if (extra) sd_down += extra;
                    me.send_room("<HIB>$N深吸一口气，指尖凝起一层寒霜般的白芒，周遭温度骤然下降，空气都似要凝结</HIB>", target);
                    var sh = me.do_attack({
                        target: target,
                        attack_msg: "<hib>$N遥遥一指，一道蕴含玄阴之气的指劲破空而出，所过之处，水汽凝结成冰晶，直取$n的$l</hib>",
                        damage_msg: "<hir>$n被$N的寒阴指劲击中，只觉得一股极寒之力自伤口涌入，半边身子都失去了知觉</hir>",
                        miss_msg: "<cyn>$n感受到指风中那股惊人的寒意，不敢怠慢，使出浑身解数闪避开来</cyn>",
                        gj: me.gj * per / 100,
                        mz: me.mz,
                        no_weapon: true
                    });
                    if (sh) {
                        target.add_status({
                            id: "slow",
                            name: "迟缓",
                            duration: 10000,
                            downside: true,
                            desc: "你的技能攻击速度降低了30%",
                            prop: {
                                gjsd_per: -sd_down
                            }
                        }, me);
                    }
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var per = hanyinPer(lv);
                    return "打出蕴含阴寒之气的指劲，造成自身" + per + "%攻击力的伤害，使目标10秒内技能攻击速度降低30%";
                },
            },
    };
}

function hanyinPer(lv: number): number {
    var per = 200 + int(lv / 10);
    if (per > 300) per = 300;
    return per;
}
