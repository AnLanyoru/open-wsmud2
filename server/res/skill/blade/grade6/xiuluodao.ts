import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '修罗刀';
    id = 'xiuluodao';
    grade = 6;

    desc = '舍刀之外，再无他物';
    can_enables = ['blade'];
    attack_actions = [
        '$N眼中掠过一抹猩红，$W无声无息自$n视线死角斜撩而上，刀路诡谲如修罗探爪',
        '$N杀意骤凝，$W挟腥风拦腰横扫，一刀断空，竟无半分余地',
        '$N踏步沉身，$W刀尖微颤，如狱火吐信般点向$n的$l',
        '$N旋身反手，$W划出一道血弧，刀光未至而杀意已刺入$n心神',
        '$N嘴角泛起一丝冷笑，$W自肘底穿出，从一个绝无可能的角度刺向$n的$l',
        '$N纵身跃起，$W凌空劈落，刀势如修罗降世，映得$n面庞一片惨白',
        '$N佯退半步，蓦地拧身突刺，$W如鬼魅般绕开$n守势直取$l',
        '$N刀交左手，右手虚引$n目光，$W已悄然无声斩至$n腰肋',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        const perVal = query_xld_per(lv);
        return {
            blade: {
                gj: lv * 3 + 200,
                mz_per: perVal,
                gj_per: perVal,
                add_sh_per: perVal,
                diff_fy_per: perVal,
                desc: '当你命中敌人后使敌人流血，更容易受到伤害',
            },
        };
    }

    /**
     * 修罗刀被动——「修罗印记」：命中敌人后，在其身上叠加一层修罗，
     * 每层降低等同于技能等级的数值伤害减免，最高 6 层。
     */
    on_attack_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar, sh: number): void {
        if (par.is_dodged || par.is_parried) return;
        const lv = me.query_skill('xiuluodao', 0);
        if (lv <= 0) return;

        if (target.query_temp('_xl_cd')) return;
        target.set_temp('_xl_cd', 1, 500);

        const dur = query_xld_xl_duration(lv);
        target.add_status(
            {
                id: 'xiuluo',
                name: '修罗',
                desc: '修罗刀气侵蚀体内，刀锋所向，无处可避',
                duration: dur,
                override: 1,
                count: 1,
                max_count: 6,
                downside: true,
                prop: {
                    diff_sh: -1000 - parseInt(lv * (lv / 120 + 1)),
                },
                finish_msg: '$N身上的修罗刀气渐散。',
            },
            me,
        );
    }

    pfm_set: PerformData = {
        yu: {
            name: '修罗炼狱',
            distime: 30000,
            enable_skill: 'blade',
            mp: 1280,
            use: function (me: CHARACTER, target: CHARACTER, lv: number, sktype: string): void {
                const hpRatio = query_xld_xl_hp_ratio(lv);
                const stacks = target.query_status('xiuluo');
                const atkCount = 1 + Math.min(stacks, 6);

                me.send_room(
                    '<hir>$N眼中血光暴射，杀意凝如实质，倏忽间，万千刀光自虚空中迸裂而出，如修罗炼狱降世，将$n生生吞没其中！</hir>',
                    target,
                );

                let killed = false;
                let extraDmg = Math.floor((target.hp * hpRatio) / 100);
                if (extraDmg < 0) extraDmg = 0;
                for (let i = 0; i < atkCount; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj + extraDmg,
                        mz: me.mz,
                        attack_before: i > 0 ? _tmpl('<hiw>紧跟着</hiw>\n') : undefined,
                    });
                    if (target.hp <= 0) {
                        killed = true;
                        me.send_room(
                            '<hir>$n在万千刀光中化作齑粉，$N眼中血光一现即隐，敌血方冷，刀意未消，$W嗡鸣不止，似已渴饮下一人之血！</hir>',
                            target,
                        );
                        break;
                    }
                }

                me.end_attack(target);

                if (killed) {
                    me.clear_distime(sktype + '.' + this.pid);
                }
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const hpRatio = query_xld_xl_hp_ratio(lv);
                return `对敌人造成的伤害附加${hpRatio}%对方当前气血，每层修罗增加出招一次，最多6次，如果敌人被击杀则重置冷却`;
            },
        },
        lun: {
            name: '六道轮回',
            distime: 60000,
            enable_skill: 'blade',
            mp: 1380,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const stacks = target.query_status('xiuluo');
                if (stacks <= 0) {
                    me.send_room('$N引六道轮转之力灌注$W，刀身泛起幽幽血光，斩向$n。', target);
                    me.do_attack({ target, gj: me.gj, mz: me.mz });
                    me.end_attack(target);
                    return;
                }

                const dmgPer = query_xld_ld_per_layer(lv);
                const dmgRatio = dmgPer / 100;

                me.send_room(
                    '<ord>$N举刀长啸，$W刀身嗡鸣，六道轮转之力自虚空中灌注而入，$n身上重重修罗印记如琉璃崩碎，化作$N刀下无边业火！</ord>',
                    target,
                );
                me.do_attack({
                    target: target,
                    gj: Math.floor(me.gj * (dmgRatio * stacks + 1)),
                    mz: me.mz,
                });

                me.end_attack(target);

                // 吸收修罗印记为自身增益
                const buffAddPer = query_xld_ld_buff(lv, stacks);
                const buffDur = query_xld_ld_buff_duration(lv);
                me.add_status({
                    id: 'weapon',
                    name: '轮回',
                    desc: '六道修罗之力尽归己身，刀势如虹',
                    duration: buffDur,
                    override: 2,
                    prop: {
                        add_sh_per: buffAddPer,
                    },
                    finish_msg: '$N身上的轮回之力缓缓消散。',
                });
                me.reauto_attack();
                target.remove_status('xiuluo', true);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const dmgPer = query_xld_ld_per_layer(lv);
                const buffAddPer = query_xld_ld_buff(lv, 6);
                return `重置敌人身上的修罗，每层修罗造成${dmgPer}%伤害，吸收为自身增益（满层提升最终伤害${buffAddPer}%）`;
            },
        },
    };
}

// ============================================================
// 修罗刀 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 百分比属性（mz_per / gj_per / add_sh_per / diff_fy_per） */
function query_xld_per(lv: number): number {
    return 5 + Math.floor(lv / 300);
}

/** 修罗印记：持续时间（毫秒） */
function query_xld_xl_duration(_lv: number): number {
    return 10000;
}

/** 修罗炼狱：附加当前气血百分比 */
function query_xld_xl_hp_ratio(lv: number): number {
    return 1 + Math.floor(lv / 2000);
}

/** 六道轮回：每层修罗造成的伤害百分比 */
function query_xld_ld_per_layer(lv: number): number {
    return 100 + Math.floor(lv / 20);
}

/** 六道轮回：吸收增益的最终伤害加成（百分比） */
function query_xld_ld_buff(lv: number, stacks: number): number {
    return stacks * (5 + Math.floor(lv / 200));
}

/** 六道轮回：吸收增益的持续时间（毫秒） */
function query_xld_ld_buff_duration(lv: number): number {
    const dur = 10000 + lv * 10;
    return dur > 30000 ? 30000 : dur;
}
