import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '斗转星移';
    id = 'douzhuanxingyi';
    grade = 5;

    desc = '姑苏慕容的绝技，以彼之道还施彼身';
    can_enables = ['parry'];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: int(lv * 2.2),
                fy: int(lv * 2.2),
                diff_bj: 4,
                dex: 3 + int(lv * 0.33),
            },
        };
    }

    pfm_set: PerformData = {
        xing: {
            name: '星移',
            distime: 30000,
            enable_skill: 'parry',
            mp: 50,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration: number = get_xingyi_duration(lv);
                const zjPer: number = get_xingyi_zj_per(lv);
                me.send_room(
                    '<HIO>$N双掌虚抱，劲力暗转，周身真气如星河倒悬，已将斗转星移之势布于四方。</HIO>',
                    target,
                );
                me.add_status({
                    id: 'xingyi',
                    name: '星移',
                    duration: duration,
                    desc: `招架提升${zjPer}%，招架成功后将伤害反震给敌人。`,
                    prop: {
                        zj_per: zjPer,
                    },
                    on_attach: function (p: CHARACTER): void {
                        p.set_temp('sk/dz/xingyi', 1);
                    },
                    on_expire: function (p: CHARACTER): void {
                        p.remove_temp('sk/dz/xingyi');
                    },
                    finish_msg: '<HIO>$N周身星河虚影渐渐消散，斗转星移之势已收入丹田。</HIO>',
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const sec = toSec(get_xingyi_duration(lv));
                return `${sec}秒内，增加你${get_xingyi_zj_per(lv)}%的招架，招架成功后将伤害的${get_xingyi_reflect_per(lv)}%转移给敌人`;
            },
        },
        dou: {
            name: '斗转',
            distime: 30000,
            enable_skill: 'parry',
            mp: 90,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const effectPer: number = get_douzhuan_effect_per(lv);
                const lastInfo = me.query_temp('sk/dz/last_pfm', null) as {
                    name: string;
                    level: number;
                } | null;
                const pfmName: string = lastInfo ? lastInfo.name : '绝招';
                me.send_room(
                    `<HIO>$N眸光一闪，已窥破$n武学关窍，竟以彼之道还施彼身——「${pfmName}」之势反卷而回！</HIO>`,
                    target,
                );
                const gj: number = int((me.gj * effectPer) / 100);
                me.do_attack({
                    target: target,
                    gj: gj,
                    mz: me.mz,
                    attack_msg: `<HIO>$N双臂圈转，将$n方才那招「${pfmName}」的劲力尽数逆转，以其人之道还治其人之身！</HIO>`,
                    damage_msg:
                        '<hir>$n只觉一股雄浑劲力倒灌而回，竟是自家招数的路数，避无可避，被震得气血翻涌！</hir>',
                    miss_msg: `<cyn>$n识得这招「${pfmName}」的来路，匆忙间急闪躲避。</cyn>`,
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return `使用前一个攻击你的武器或拳脚绝招攻击敌人，效果是你斗转星移等级的${get_douzhuan_effect_per(lv)}%`;
            },
        },
    };

    on_parry_pfm(
        me: CHARACTER,
        target: CHARACTER,
        pfm: PERFORM,
        level: number,
        _sk?: string,
    ): boolean {
        // 记录敌人使用的绝招信息，供斗转使用
        if (pfm.name) {
            me.set_temp('sk/dz/last_pfm', { name: pfm.name, level: level }, 30000);
        }
        return false; // 不阻止绝招
    }

    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (!par.is_parried) return;
        if (!me.query_temp('sk/dz/xingyi', 0)) return;
        // 星移状态：招架成功后将伤害反震给敌人
        const lv = me.query_skill('douzhuanxingyi', 0);
        if (lv <= 0) return;
        const reflectPer: number = get_xingyi_reflect_per(lv);
        const reflectDmg: number = int((me.gj * reflectPer) / 100);
        me.send_room(
            '<HIO>$N借力打力，将$n的攻势尽数逆转，斗转星移之下，劲力反噬而回！</HIO>',
            target,
        );
        target.damage(reflectDmg, me);
        me.end_attack(target);
    }
}

// ========== 公共计算函数 ==========

export function get_xingyi_duration(lv: number): number {
    return 5000 + lv * 5;
}

export function get_xingyi_zj_per(lv: number): number {
    return 30 + int(lv / 100);
}

export function get_xingyi_reflect_per(lv: number): number {
    return 100 + int(lv / 20);
}

export function get_douzhuan_effect_per(lv: number): number {
    return Math.min(100, 80 + int(lv / 40));
}
