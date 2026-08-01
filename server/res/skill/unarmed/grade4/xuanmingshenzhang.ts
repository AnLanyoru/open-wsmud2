import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '玄冥神掌';
    id = 'xuanmingshenzhang';
    grade = 4;

    // 原始描述：玄冥二老鹿杖客、鹤笔翁的独门绝学，掌力阴寒歹毒，中者经脉尽冻，血肉凝冰。掌出寒风起，百丈之内如坠冰窟。
    desc = '玄冥二老鹿杖客、鹤笔翁的独门绝学，掌力阴寒歹毒，中者经脉尽冻，血肉凝冰';
    can_enables = ['unarmed'];
    attack_actions = [
        '$N双掌一错，掌心泛起一层玄冰般的幽蓝光芒，寒气四溢，一招「<HIC>玄冥冰魄</HIC>」直拍$n的$l',
        '$N身形欺近，一掌当胸拍出，掌风中裹挟着刺骨的寒意，正是「<HIC>寒冰蚀骨</HIC>」的起手式',
        '$N双掌连环拍击，每一掌都带着凛冽的寒气，空气都似被冻结，正是「<HIC>冰封万里</HIC>」',
        '$N左掌虚按，右掌实拍，一阴一阳两道寒气交缠而出，正是「<HIC>玄冥双行</HIC>」的精妙招数',
        '$N双掌齐出，两道寒冰掌力交错成网，罩向$n周身，正是「<HIC>天罗地网</HIC>」的玄冥变式',
        '$N掌势忽变，由阳刚转为阴柔，一掌拍出无声无息，寒气内敛，正是「<HIC>暗冰潜行</HIC>」',
        '$N深吸一口气，双掌缓缓推出，掌力所过之处，地面凝结起一层薄冰，正是「<HIC>玄冥冰狱</HIC>」',
        '$N身形疾转，双掌如穿花蝴蝶般上下翻飞，寒气四溢，正是「<HIC>冰蝶乱舞</HIC>」',
        '$N怒喝一声，一掌当空劈下，掌风如刀，寒气如刃，正是玄冥神掌的「<HIC>寒冰斩</HIC>」',
        '$N双掌在胸前一合，猛然推出，一道冰蓝色的掌力如巨龙般咆哮而出，正是「<HIC>玄冥龙啸</HIC>」',
    ];
    parry_actions = [
        '$n双掌交错，掌心泛起一层玄冰般的幽蓝光芒，以玄冥神掌的寒气格挡$P的攻击\n',
        '$n双掌一错，寒冰掌力吞吐不定，将$P的攻势消弭于无形\n',
    ];
    slots = [
        {
            prop: 'xmsz_hd_sh',
            value: (lv: number) => 10,
            format: (val: number) => '寒毒造成的伤害每跳附加100%攻击力的伤害',
        },
        {
            prop: 'xmsz_hd_time',
            value: (lv: number) => 10,
            format: (val: number) => '寒毒持续时间延长5秒',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 20 + Math.floor(lv * 2.3),
                mz: 20 + Math.floor(lv * 2.2),
                add_sh_per: 5,
                diff_fy_per: 5,
            },
        };
    }

    pfm_set: PerformData = {
        du: {
            name: '寒毒',
            distime: 5000,
            enable_skill: 'unarmed',
            mp: 40,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var per = handuPer(lv);
                var dot_time = 15000;
                var extra = me.query_prop('xmsz_hd_time');
                if (extra) dot_time += extra * 1000;
                me.send_room(
                    '<HIB>$N双掌一翻，掌心凝结起一层幽蓝色的冰晶，周围温度骤降，$n只觉一股刺骨寒意扑面而来</HIB>',
                    target,
                );
                var sh = me.do_attack({
                    target: target,
                    attack_msg:
                        '<hib>$N一掌拍出，掌中寒气如潮，一道幽蓝色的掌力裹挟着玄冥寒毒直取$n的$l</hib>',
                    damage_msg:
                        '<hir>$n被$N一掌拍中，只觉得一股极寒之力侵入体内，血液都似要凝固</hir>',
                    miss_msg: '<cyn>$n只觉得一股刺骨寒意袭来，急忙运气护体，险险避开了这一掌</cyn>',
                    gj: (me.gj * per) / 100,
                    mz: me.mz,
                    no_weapon: true,
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'xuanming_handu',
                            name: '玄冥寒毒',
                            duration: 5000,
                            duration_count: 3,
                            downside: true,
                            desc: '你中了玄冥寒毒，每5秒受到阴寒伤害',
                            on_interval: function (p: CHARACTER) {
                                var dot_sh = (me.gj * 30) / 100;
                                p.from_attack(
                                    dot_sh,
                                    999999,
                                    '',
                                    '<hir>$N体内的玄冥寒毒发作，阴寒之力在经脉中肆虐！</hir>',
                                );
                            },
                            prop: {
                                gjsd_per: -20,
                                ds_per: -20,
                            },
                            finish_msg: '<hiy>$N终于将玄冥寒毒逼出体外，浑身一轻。</hiy>',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var per = handuPer(lv);
                return '对敌人造成' + per + '%的伤害，附加玄冥寒毒状态：每5秒受到阴寒伤害';
            },
        },
    };
}

function handuPer(lv: number): number {
    var per = 100 + int(lv / 10);
    if (per > 200) per = 200;
    return per;
}
