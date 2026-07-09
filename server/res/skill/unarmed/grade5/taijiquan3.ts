import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '太极拳';
    id = 'taijiquan3';
    grade = 5;

    is_hidden = true;

    desc = '武当派镇派绝学，以柔克刚、以静制动，后发先至，四两拨千斤，乃道家武学之巅';
    can_enables = ['unarmed', 'parry'];
    attack_actions = [
        '$N双手划圆，一式「<HIC>揽雀尾</HIC>」似慢实快，绵绵不绝地缠向$n的$l',
        '$N左掌上撩，右掌下按，一招「<HIC>如封似闭</HIC>」封死$n的所有退路',
        '$N身形一转，使出一招「<HIC>单鞭</HIC>」，右掌如鞭般抽向$n的$l',
        '$N双掌交错运起云手，一式「<HIC>云手</HIC>」圆转如意地卷向$n的$l',
        '$N左揽右划，右掌猛地穿出，一招「<HIC>野马分鬃</HIC>」直插$n的$l',
        '$N沉肩坠肘，一招「<HIC>白鹤亮翅</HIC>」双掌上下分错，击向$n的$l',
        '$N双掌画弧，如抱太极，一式「<HIC>抱虎归山</HIC>」将$n的$l尽数笼罩',
        '$N脚踏九宫，一招「<HIC>手挥琵琶</HIC>」弹拨间暗藏杀机，袭向$n的$l',
    ];
    parry_actions = [
        '$N双手划圆，以太极「<HIC>揽雀尾</HIC>」之势将$P的攻势引偏\n',
        '$N双掌画弧，如抱太极，以柔克刚化解了$P的攻击\n',
    ];
    slots = [
        {
            prop: 'taiji_zhen',
            value: (lv: number) => 10,
            format: (val: number) => '震字决额外附加10%内力',
        },
        {
            prop: 'taiji_ming',
            value: (lv: number) => 10,
            format: (val: number) => '震字决命中增加10%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + Math.floor(lv * 2.6),
                mz: 5 + Math.floor(lv * 2.6),
                str: Math.floor(lv / 2),
                con: Math.floor(lv / 2),
            },
            parry: {
                zj: 20 + lv * 2,
                fy: 10 + lv * 2,
                max_hp: lv * 20,
                desc: '当你成功招架后会使敌人的攻击更加强力的转向自己，无法躲闪',
            },
        };
    }

    pfm_set: PerformData = {
        zhen: {
            name: '震字决',
            distime: 20000,
            enable_skill: 'unarmed',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var mp_pct = zhenzijueMpPct(me);
                var mz_bonus_pct = me.query_prop('taiji_ming');
                var mp_damage = Math.floor((me.max_mp * mp_pct) / 100);
                me.send_room(
                    '<hiy>$N脚踏阴阳，双掌缓缓画出一个太极圆，一式「<HIC>震字决</HIC>」以内力为引，隔空震向$n！</hiy>',
                    target,
                );
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj + mp_damage,
                    mz: Math.floor((me.mz * (100 + mz_bonus_pct)) / 100),
                    attack_msg: '<hiy>$N掌力一吐，一股醇厚无比的太极内劲透过虚空直击$n！</hiy>',
                    miss_msg: '<cyn>$n察觉到这股暗劲袭来，急忙侧身闪避。</cyn>',
                    damage_msg: '<hir>$n被太极震劲透体而入，五脏六腑如遭重锤，一口鲜血喷出！</hir>',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var mp_pct = zhenzijueMpPct(me);
                return '以内力震伤敌人，造成你攻击力附加你最大内力' + mp_pct + '%的伤害。';
            },
        },
    };
}

function zhenzijueMpPct(me: CHARACTER): number {
    var mp_pct = 20 + (me.query_prop('taiji_zhen') || 0);
    if (mp_pct > 50) mp_pct = 50;
    return mp_pct;
}
