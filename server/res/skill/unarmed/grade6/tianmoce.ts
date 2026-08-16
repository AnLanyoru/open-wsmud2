import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 70 */
export default class extends SKILL {
    name = '天魔策';
    id = 'tianmoce';
    grade = 6;

    force_rad = 1.35;

    // 原始描述：魔门一系最高深的功法，乃魔门历代圣君集百家魔功之大成，融天魔妙相、道心种魔、补天道心法于一炉，修至化境可窥破天道，逆转生死
    desc = '魔门一系最高深的功法';
    can_enables = ['unarmed', 'dodge', 'force', 'parry'];
    attack_actions = [
        '$N周身魔气翻涌，双目如电，一式「<MAG>天魔裂空</MAG>」撕裂虚空直取$n的$l',
        '$N身形鬼魅般一闪，掌中魔气凝聚，「<MAG>魔焰滔天</MAG>」带着焚尽万物之势卷向$n的$l',
        '$N仰天长啸，魔气冲天而起，一招「<MAG>天地魔劫</MAG>」令风云变色，轰向$n的$l',
        '$N双手结天魔印，魔气化作万道黑芒，「<MAG>万魔朝宗</MAG>」铺天盖地射向$n的$l',
        '$N身影一化为三，从不同方位同时攻向$n，正是「<MAG>天魔解体</MAG>」大法！',
        '$N眼中闪过诡异红光，掌势如天魔降临，「<MAG>魔临天下</MAG>」带着无上威压罩向$n的$l',
        '$N周身魔气凝为实质，一招「<MAG>魔贯光杀</MAG>」化作一道黑色光柱直刺$n的$l',
    ];
    dodge_actions = [
        '$n身形如鬼影般一闪，魔气涌动间已移至数丈之外，$N的攻击落了个空。\n',
        '$n脚下踏出玄奥魔步，身形忽左忽右，$N只觉得眼前一花，便失去了$n的身影。\n',
        '$n的身形在魔气中若隐若现，如镜花水月般不可捉摸，$N的攻击穿过残影落空。\n',
        '$n施展天魔妙相，身形如烟似雾，$N的攻击竟穿体而过，却无一丝鲜血溅出。\n',
    ];
    parry_actions = [
        '$n双手结印，一道黑色魔气屏障骤然浮现，将$P的攻势尽数挡下。\n',
        '$n冷哼一声，周身魔气翻涌如潮，$P的攻击如泥牛入海，被魔气吞噬殆尽。\n',
        '$n身形不动，魔气却自动凝成一面黑色气墙，$P只觉得一股巨大的反震力传来。\n',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: lv * 3,
                mz: lv * 3,
                add_sh_per: 4,
                diff_sh_per: 4,
                desc: '唯一：将你内力的135%转化为气血',
            },
            dodge: {
                ds: lv * 3,
                dex: 100 + Math.floor(lv / 2),
                ds_per: 4,
                mz_per: 4,
            },
            parry: {
                zj: lv * 3,
                hp_per: 6,
                con: 100 + Math.floor(lv / 2),
                str: 100 + Math.floor(lv / 2),
            },
            unarmed: {
                gj: lv * 3,
                mz: lv * 3,
                con: 100 + Math.floor(lv / 2),
                str: 100 + Math.floor(lv / 2),
            },
        };
    }

    pfm_set: PerformData = {
        zhong: {
            name: '种魔',
            distime: 45000,
            enable_skill: 'unarmed',
            mp: 1940,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var reduce_pct = 11 + Math.floor(lv / 100);
                if (reduce_pct > 20) reduce_pct = 20;
                me.send_room(
                    '<mag>$N双眸转为深黑，周身魔气翻腾，一道无形魔气悄然没入$n体内！</mag>',
                    target,
                );
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: '<mag>$N一掌拍出，魔气凝成一道黑色符印，直印$n丹田！</mag>',
                    miss_msg:
                        '<cyn>$n察觉到$N这一掌暗藏诡异，强行提气后撤，避开了这夺命一击。</cyn>',
                    damage_msg:
                        '<hir>$n被魔印击中丹田，只觉一股阴寒冷冽的魔气侵入经脉，内力运转顿时滞涩！</hir>',
                });
                if (sh) {
                    if (target.force_skill && target.force_skill.id) {
                        target.send_room('<hir>$n的内功被魔种侵蚀，气息陡然紊乱！</hir>', target);
                    }
                    target.add_status(
                        {
                            id: 'force',
                            name: '种魔',
                            duration: 15000,
                            override: 2,
                            downside: true,
                            prop: {
                                gj_per: -reduce_pct,
                                add_sh_per: -reduce_pct,
                            },
                            desc: '伤害和免伤降低' + reduce_pct + '%',
                            start_msg: '<mag>$N丹田处浮现出一道诡异的黑色魔纹！</mag>',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var reduce_pct = 11 + Math.floor(lv / 100);
                if (reduce_pct > 20) reduce_pct = 20;
                return '消除对方的内功，压制敌方使对方降低' + reduce_pct + '%的伤害和免伤';
            },
        },
        dao: {
            name: '道心',
            distime: 45000,
            enable_skill: 'force',
            mp: 1880,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 8000 + lv * 4;
                if (time > 15000) time = 15000;
                var add_sh = 20 + Math.floor(lv / 100);
                me.send_room(
                    '<mag>$N双目微阖，体内魔功逆转，竟在无边魔气中悟得一丝「<MAG>道心</MAG>」，魔道相济，战力暴涨！</mag>',
                    target,
                );
                me.add_status({
                    id: 'force',
                    name: '道心',
                    duration: time,
                    prop: {
                        add_sh_per: add_sh,
                        gj_per: add_sh,
                        mz_per: add_sh,
                    },
                    desc: '大幅提升战斗力',
                    start_msg: '<mag>$N周身魔气与道意交织，气势陡然攀升至巅峰！</mag>',
                    finish_msg: '<cyn>$N体内魔气渐渐平复，道心状态缓缓消散。</cyn>',
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '大幅提升战斗力';
            },
        },
        ying: {
            name: '鬼影',
            distime: 40000,
            enable_skill: 'dodge',
            mp: 1560,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 5000 + int(lv / 2000) * 1000;
                me.send_room(
                    '<mag>$N身形一散，化作无数道鬼影在空间中穿梭不定，真身与残影已无从分辨</mag>',
                    target,
                );
                me.add_status({
                    id: 'gui',
                    name: '鬼影',
                    duration: time,
                    is_shadow: true,
                    desc: '鬼影相随，攻击必中',
                    start_msg: '<mag>$N的身形变得若隐若现，鬼影幢幢，仿佛与虚空融为一体！</mag>',
                    finish_msg: '<cyn>$N的鬼影渐渐敛去，身形重新凝实。</cyn>',
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var time = 5000 + int(lv / 2000) * 1000;
                return `${toSec(time)}秒内鬼影相随，攻击必中`;
            },
        },
        gang: {
            name: '拳罡',
            distime: 10000,
            enable_skill: 'unarmed',
            mp: 970,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var diff_fy_per_stack = 3 + Math.floor(lv / 500);
                if (diff_fy_per_stack > 8) diff_fy_per_stack = 8;
                me.send_room(
                    '<mag>$N沉声怒喝，右拳凝聚滔天魔气，一拳轰向$n！刚猛无铸，仿若能粉碎虚空！</mag>',
                    target,
                );
                var sh = me.do_attack({
                    target: target,
                    gj: Math.floor(me.gj * (1 + lv / 1000)),
                    mz: me.mz,
                    no_weapon: true,
                    attack_msg: '<mag>$N拳罡化作一道黑色光柱，带着毁天灭地之势轰向$n！</mag>',
                    miss_msg: '<cyn>$n被这惊天一拳所慑，拼尽全力向旁闪开！</cyn>',
                    damage_msg:
                        '<hir>$n被$N一拳轰中，整个人如断线风筝般倒飞出去，口中鲜血狂喷！</hir>',
                });
                if (sh) {
                    me.add_status({
                        id: 'unarmed',
                        name: '拳罡',
                        duration: 10000,
                        override: 1,
                        prop: {
                            add_sh_per: diff_fy_per_stack,
                            diff_fy_per: diff_fy_per_stack,
                        },
                        desc: '拳势增强',
                        start_msg: '<hiz>$N的拳势在命中后变得更加狂暴凶猛，战意节节攀升！</hiz>',
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '刚猛威烈的一拳，命中后会增加自己的伤害和破防，可叠加';
            },
        },
        tian: {
            name: '补天道',
            distime: 45000,
            enable_skill: 'parry',
            mp: 1980,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 15000 + lv * 5;
                if (time > 25000) time = 25000;
                var zj_bonus = 10 + Math.floor(lv / 100);
                me.send_room(
                    '<mag>$N双手结出玄奥法印，魔气与天地元气共鸣，一道无形的天道法则环绕周身！</mag>',
                    target,
                );
                me.add_status({
                    id: 'parry',
                    name: '补天道',
                    duration: time,
                    prop: {
                        zj_per: zj_bonus,
                    },
                    desc: '增加招架几率，招架成功后吸收对方功力转为自身气血',
                    on_attach: (p: CHARACTER) => p.set_temp('sk_tm_bt', 1, time),
                    on_expire: (p: CHARACTER) => p.remove_temp('sk_tm_bt'),
                    start_msg:
                        '<mag>$N周身被一道玄奥的天道法则笼罩，任何攻击都会被法则之力牵引！</mag>',
                    finish_msg: '<cyn>$N周身的补天道法则缓缓消散，恢复了常态。</cyn>',
                });
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '增加你的招架几率，招架成功后吸收对方功力转为自身气血';
            },
        },
    };
    on_before_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (me.query_status('gui')) {
            par.no_dodge = true;
            par.no_parry = true;
        }
    }
    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (par.is_parried && me.query_temp('sk_tm_bt', 0)) {
            var heal = Math.floor(target.gj * 0.3);
            if (heal > 0) {
                me.add_hp(heal);
                me.send_room(
                    '<mag>$N运转补天道法则，在招架$n攻击的同时，将$n的功力化为己用，伤势以肉眼可见的速度愈合！</mag>',
                    target,
                );
            }
        }
    }
}
