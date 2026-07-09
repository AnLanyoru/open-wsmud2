import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PERFORM, PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER } from '../../../core/char/character.js';

/**
 * 纵横术 — 六扇门招架功法（普通技能）
 * 以纵横之术为基础发展而来，对其研究的越深入则越强
 * 完善度：50%
 */
export default class extends SKILL {
    name = '纵横术';
    id = 'zonghengshu';
    grade = 1;
    family = FAMILIES.LIUSHAN;
    desc = '六扇门的招架功法，以纵横之术为基础发展而来，对其研究的越深入则越强';
    can_enables = ['parry'];

    parry_actions = [
        '却见$n双手忽张忽合，正是纵横术中的「开合之道」，不慌不忙地将$N的攻势化解于无形。\n',
        '$n脚踏奇步，身形忽横忽纵，一招之间已封住$N所有去路。\n',
        '$n双臂圈转，如关门打狗般将$N的攻势尽数格开。\n',
        '$n施展纵横术，身形进退有度，$N的招式仿佛落入罗网，难以寸进。\n',
    ];

    weapon_vs_weapon_actions = [
        '只听见「锵」一声，被$p以纵横术格开了。',
        '结果「当」地一声被$p以纵横术挡开了。',
    ];

    unarmed_vs_weapon_actions = ['但是$p横掌一推，$w失了准头，和$p的$l偏了几寸。'];

    slots = [
        {
            prop: 'zhs_kh_count',
            value: (_lv: number) => 1,
            format: (_val: number) => '开合之道格挡次数增加1次',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: 200 + Math.floor(lv * 1.1),
            },
        };
    }

    pfm_set: PerformData = {
        kai: {
            name: '开合之道',
            distime: 60000,
            enable_skill: 'parry',
            mp: 130,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const time = query_zhs_duration(lv);
                const blockCount = query_zhs_block_count(lv) + me.query_prop('zhs_kh_count');

                me.send_room(
                    '<HIC>$N气沉丹田，双臂一张一合，摆出纵横术「开合之道」的起手式，周身气势凝而不发，严阵以待。</HIC>',
                    target,
                );

                me.add_status({
                    id: 'zhs_kh',
                    name: '开合之道',
                    duration: time,
                    desc: '抵挡即将到来的' + blockCount + '次攻击',
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp('zhs_kh', blockCount, time);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp('zhs_kh');
                    },
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const time = query_zhs_duration(lv);
                const blockCount = query_zhs_block_count(lv);
                return toSec(time) + '秒内你将抵挡即将到来的' + blockCount + '次攻击。';
            },
        },
    };

    /** 以开合之道格挡敌人的绝招 */
    on_parry_pfm(
        me: CHARACTER,
        target: CHARACTER,
        pfm: PERFORM,
        level: number,
        sk?: string,
    ): boolean {
        const remain = me.query_temp('zhs_kh', 0);
        if (remain <= 0) return false;

        me.set_temp('zhs_kh', remain - 1);
        me.send_room(
            '<HIC>$N双臂开合，以纵横术「开合之道」将$n的' +
                pfm.name +
                '尽数化解，攻势如泥牛入海，杳无踪迹。</HIC>',
            target,
        );

        if (remain <= 1) {
            me.remove_temp('zhs_kh');
            me.remove_status('zhs_kh', true);
        }
        return true;
    }
}

// ============================================================
// 纵横术 — 公共计算函数
// ============================================================

/** 开合之道：持续时间（毫秒） */
function query_zhs_duration(lv: number): number {
    return 20000 + lv * 20;
}

/** 开合之道：抵挡次数 */
function query_zhs_block_count(lv: number): number {
    return Math.min(1 + Math.floor((lv - 100) / 1500), 3);
}
