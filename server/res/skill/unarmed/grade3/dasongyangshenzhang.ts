import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "大嵩阳神掌";
    id = "dasongyangshenzhang";
    grade = 3;
    is_public = true;
    
    // 原始描述：大嵩阳神掌乃是嵩山派绝学，以变化繁复，出手迅捷见称。掌出如风，势若奔雷。
    desc = "大嵩阳神掌乃是嵩山派绝学，以变化繁复，出手迅捷见称。";
    can_enables = ["unarmed"];
    attack_actions = [
        "$N身形一晃，已然欺近$n身前，双掌齐出，一招「<HIC>嵩岳巍峨</HIC>」重重叠叠拍向$n",
        "$N左掌划弧，右掌直击，正是大嵩阳神掌的「<HIC>叠翠浮青</HIC>」，掌势连绵不断",
        "$N双掌翻飞，掌影如山，一式「<HIC>万壑争流</HIC>」铺天盖地向$n涌去",
        "$N吐气开声，右掌当胸推出，掌力沉雄，正是「<HIC>中岳独尊</HIC>」的起手式",
        "$N身形疾转，双掌如穿花蝴蝶般连环拍出，一招「<HIC>嵩阳照雪</HIC>」已罩向$n的$l",
        "$N左掌虚引，右掌实击，虚实结合，正是「<HIC>玉女擎天</HIC>」的精妙变化",
        "$N掌势忽变，由刚转柔，由快转慢，一招「<HIC>嵩山晚照</HIC>」似慢实快按向$n",
        "$N双掌一分，左掌取上盘，右掌攻下路，正是「<HIC>阴阳双行</HIC>」的巧妙运用",
        "$N掌风呼啸，身形腾挪，一招「<HIC>七十二峰</HIC>」幻起漫天掌影",
        "$N沉腰坐马，双掌猛然向前一推，劲风扑面，正是「<HIC>嵩阳开泰</HIC>」的杀招"
    ];
    slots = [
        {
            prop: 'dsys_wysh',
            value: (lv: number) => 10,
            format: (val: number) => '无影掌附加攻击力增加100%',
        },
        {
            prop: 'dsys_wymz',
            value: (lv: number) => 10,
            format: (val: number) => '无影掌命中增加35%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.3),
                gjsd: 200,
                mz: Math.floor(lv * 1.22),
            },
        };
    }

    pfm_set: PerformData = {
        wuying:
            {
                name: "无影掌",
                distime: 20000,
                enable_skill: "unarmed",
                mp: 20,
                release_time: 3000,
                use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                    var per = wuyingPer(lv);
                    var busy = wuyingBusy(lv);
                    me.send_room("<HIY>$N深吸一口气，双掌在身前虚虚一抱，刹那间掌影重重，竟看不清他出了多少掌！</HIY>", target);
                    var sh = me.do_attack({
                        target: target,
                        attack_msg: "<hiy>$N身形如风，双掌化作漫天掌影，虚实难辨，正是大嵩阳神掌的绝技——无影掌！</hiy>",
                        damage_msg: "<hir>$n被$N神出鬼没的一掌击中，只觉一股雄浑掌力透体而入，五脏六腑如翻江倒海</hir>",
                        miss_msg: "<cyn>$n只觉得掌风扑面，急忙凝神戒备，以精妙步法闪过了这无形无影的一掌</cyn>",
                        gj: me.gj * per / 100,
                        mz: me.mz,
                        no_weapon: true
                    });
                    if (sh) {
                        target.add_status({
                            id: "busy",
                            name: "忙乱",
                            duration: busy,
                            downside: true,
                            is_busy: true,
                            desc: "你被无影掌击中，气血翻涌，无法行动"
                        }, me);
                    }
                    me.end_attack(target);
                },
                query_desc: function(me: CHARACTER, lv: number) {
                    var per = wuyingPer(lv);
                    var busy = wuyingBusy(lv);
                    return "对敌人造成" + per + "%的伤害，命中后使敌人忙乱" + toSec(busy) + "秒。";
                },
            },
    };
}

function wuyingPer(lv: number): number {
    var per = 200 + int(lv / 10);
    if (per > 300) per = 300;
    return per;
}

function wuyingBusy(lv: number): number {
    var busy = 3000 + lv * 5;
    if (busy > 8000) busy = 8000;
    return busy;
}
