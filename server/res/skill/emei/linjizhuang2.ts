import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER } from '../../../core/char/character.js';

export default class extends SKILL {
    name = '临济十二庄';
    id = 'linjizhuang2';
    grade = 5;
    force_rad = 0.95;
    source_skill = 'linjizhuang';
    family = FAMILIES.EMEI;
    desc = '峨眉派内功心法';
    can_enables = ['force'];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 35,
                con: Math.floor(lv / 3) + 3,
                fy: lv * 2 + 100,
                fy_per: 3 + Math.floor(lv / 300),
                limit_mp: lv * 280,
                desc: '唯一：将你内力的95%转化为气血',
            },
        };
    }

    pfm_set: PerformData = {
        hexiang: {
            name: '鹤翔庄',
            distime: 45000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const recPer = 10 + Math.floor(lv / 100);
                const diffPer = 20 + Math.floor(lv / 200);
                me.send_room(
                    '<hiy>$N暗运龙鹤两庄，启天门，闭地户，聚精成力，顿觉气力倍增，周身真气护体。</hiy>',
                );
                me.add_status({
                    id: 'force',
                    name: '鹤翔',
                    duration: 2000,
                    duration_count: 5,
                    prop: {
                        diff_sh_per: diffPer,
                    },
                    on_interval: function (p: CHARACTER) {
                        if (p.hp > 0) {
                            const hp = p.do_recover(Math.floor((p.max_hp * recPer) / 100));
                            if (hp > 0) p.notify('<hig>你恢复了' + hp + '点气血。</hig>');
                        }
                    },
                    finish_msg: '$N的鹤翔庄运行完毕，周身真气渐渐散去。',
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const recPer = 10 + Math.floor(lv / 100);
                const diffPer = 20 + Math.floor(lv / 200);
                return (
                    '每两秒内恢复你' +
                    recPer +
                    '%点气血，持续5次，期间减少你受到的伤害' +
                    diffPer +
                    '%'
                );
            },
        },
        youlong: {
            name: '游龙庄',
            distime: 30000,
            enable_skill: 'force',
            mp: 20,
            release_time: 0,
            allow_busy: true,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                const healAmt = Math.floor((me.gj * (100 + lv / 5)) / 100);
                me.send_room('<hiy>$N宝相庄严，双手合十，天地间的真气如游龙般汇聚而来。</hiy>');
                const ts: CHARACTER[] = me.team || [me];
                for (let i = 0; i < ts.length; i++) {
                    const x = ts[i];
                    if (x.hp > 0 && me.is_here(x)) {
                        const rec = x.do_recover(healAmt);
                        if (rec > 0) x.notify('<hig>你恢复了' + rec + '点气血。</hig>');
                        const removed = x.clear_downside(true);
                        if (removed > 0) {
                            x.send_room(
                                '<hig>梵音暮鼓，真气游龙，一时间$N心如明镜，再无杂念。</hig>',
                            );
                        }
                    }
                }
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const healAmt = Math.floor((me.gj * (100 + lv / 5)) / 100);
                return '战斗中恢复自己和附近队友' + healAmt + '点气血，并消除负面状态。';
            },
        },
    };
}
