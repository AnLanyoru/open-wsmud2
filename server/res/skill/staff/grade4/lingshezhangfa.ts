import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '灵蛇杖法';
    id = 'lingshezhangfa';
    grade = 4;

    // 原始描述：白驼山的杖法绝学，杖法中暗藏蛇形，灵动诡谲，中者如遭蛇噬
    desc = '白驼山的杖法';
    can_enables = ['staff', 'parry'];
    attack_actions = [
        '$N手中$W一抖，杖头幻出数道蛇影，分噬$n的$l',
        '$N身形游走，$W如灵蛇出洞般毒辣地戳向$n的$l',
        '$N$W横抡，劲风中夹着嘶嘶蛇鸣之声，扫向$n下盘',
        '$N$W高举过顶，倏地如毒蛇扑食般劈向$n的$l',
        '$N杖法一变，$W贴地飞出，如蛇行草上般卷向$n的足踝',
        '$N手腕疾翻，$W化作千百条蛇影，铺天盖地罩向$n',
    ];
    parry_actions = [
        '$N$W一抖，杖影化作数条灵蛇缠向$P的兵器，以柔克刚化解攻势\n',
        '$N手腕疾转，$W如蛇盘般绕上$P的兵器，借力打力卸开攻击\n',
        '$N身形游走，$W贴着$P的兵器滑过，杖头如毒蛇回首反噬$P\n',
    ];
    slots = [
        {
            prop: 'lingshe_poison',
            value: (lv: number) => 10,
            format: (val: number) => '你的每次出招必定出现毒蛇攻击',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            staff: {
                gj: 10 + Math.floor(lv * 1.2),
                mz: lv * 1,
                dex: Math.floor(lv / 10),
                zj: lv * 1,
                desc: '你的攻击会使敌人受到3356点蛇毒伤害',
            },
            parry: {
                zj: 5 + Math.floor(lv * 1.6),
                fy: 10 + lv * 2,
            },
        };
    }

    pfm_set: PerformData = {
        dong: {
            name: '灵蛇出洞',
            distime: 10000,
            enable_skill: 'staff',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var hitCount = 1 + Math.floor(lv / 500);

                me.send_room(
                    '<HIG>$N手中$W一挥，杖影化作数条毒蛇，从四面八方噬向$n！</HIG>',
                    target,
                );
                for (var i = 0; i < hitCount; i++) {
                    me.do_attack({ target, gj: me.gj, mz: me.mz });
                    if (target.hp > 0 && Math.random() < 0.3) {
                        target.add_status(
                            {
                                id: 'shedu_shang',
                                name: '蛇毒',
                                desc: '被灵蛇杖法所伤，身中蛇毒',
                                duration: 8000,
                                duration_count: 3,
                                downside: true,
                                override: 1,
                                on_interval: function (t, count) {
                                    t.from_attack(
                                        Math.floor((3356 * count) / 3),
                                        999999,
                                        '',
                                        '<HIR>$n伤口处的蛇毒发作，痛彻心扉！</HIR>',
                                    );
                                },
                            },
                            me,
                        );
                    }
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '灵蛇出洞，瞬间攻击3次，攻击中必定触发毒蛇攻击';
            },
        },
    };
}
