import { SKILL } from '../../../../core/skill/skill.js';
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
            no_copy: true,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): boolean {
                const lastPfmId = target.query_temp('used_pfm', '') as string;
                if (!lastPfmId) {
                    return me.notify_fail(
                        `<cyn>${target.name}最近没有使用武器或拳脚绝招，你无法施展斗转。</cyn>`,
                    );
                }
                const [skillId, pfmKey] = lastPfmId.split('/');
                const skill = SKILL.get(skillId);
                const pfm = skill?.get_pfm(pfmKey);
                if (!pfm?.use) {
                    return me.notify_fail('<cyn>对方刚才的绝招无迹可循，你无法施展斗转。</cyn>');
                }
                if (pfm.no_copy) {
                    return me.notify_fail(`<cyn>「${pfm.name}」无法被斗转星移。</cyn>`);
                }
                if (pfm.enable_skill !== 'unarmed' && !pfm.is_weapon) {
                    return me.notify_fail(
                        `<cyn>「${pfm.name}」并非武器或拳脚绝招，你无法施展斗转。</cyn>`,
                    );
                }

                me.send_room(
                    `<HIO>$N眸光一闪，已窥破$n武学关窍，竟以彼之道还施彼身——「${pfm.name}」之势反卷而回！</HIO>`,
                    target,
                );
                const effectLv = int((lv * get_douzhuan_effect_per(lv)) / 100);
                return me.use_pfm(target, pfm, effectLv, pfm.enable_skill!);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return `使用前一个攻击你的武器或拳脚绝招攻击敌人，效果是你斗转星移等级的${get_douzhuan_effect_per(lv)}%`;
            },
        },
    };

    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (!par.is_parried) return;
        if (!me.query_temp('sk/dz/xingyi', 0)) return;
        // 星移状态：招架成功后将伤害反震给敌人
        const lv = me.query_skill('douzhuanxingyi', 0);
        if (lv <= 0) return;
        const reflectPer: number = get_xingyi_reflect_per(lv);
        const reflectDmg: number = int((me.gj * reflectPer) / 100);
        const sh = target.damage(reflectDmg, me);
        me.send_room(
            `<HIO>$N斗转星移，$n的劲力莫名转向，对$n造成${sh}点伤害！</HIO>`,
            target,
        );
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
