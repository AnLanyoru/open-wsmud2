import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '松风剑法';
    id = 'songfengjianfa';
    grade = 3;

    desc = '青城派绝学：如松之劲，如风之迅。剑法讲究快且劲，走的是灵巧一脉的剑法。';
    can_enables = ['sword', 'parry'];
    attack_actions = [
        '$N手中$W一振，剑势如<HIG>青松</HIG>挺拔，劲力暗蓄，直刺$n的$l',
        '$N$W疾挥，剑风<HIG>呼啸</HIG>，如疾风骤雨般连绵不绝地攻向$n',
        '$N身形如风，$W化作<HIG>数道青光</HIG>，虚实相生，令$n难以分辨',
        '$N$W一抖，剑光如<HIG>松涛</HIG>阵阵，层层叠叠涌向$n周身',
        '$N足尖轻点，$W顺势斜劈，剑势如<HIG>风卷残云</HIG>，转瞬间已攻至$n面前',
    ];
    parry_actions = [
        '$n$W一圈，剑势如<HIG>青松迎客</HIG>，以柔克刚将$P的攻势引偏\n',
        '$n身法如风，$W疾点$P手腕，以快制快迫使其变招\n',
        '$n$W横胸一立，剑势如<HIG>松涛壁立</HIG>，稳稳架住$P的进攻\n',
    ];
    slots = [
        {
            prop: 'sywx_sf',
            value: (lv: number) => 1,
            format: (val: number) => '松月无影出招后保留松风状态，脱战后消失',
        },
        {
            prop: 'sywx_mz',
            value: (lv: number) => 10,
            format: (val: number) => '每层松风额外增加松月无影10%命中',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 20 + Math.floor(lv * 1.5),
                mz: 20 + Math.floor(lv * 1.4),
                dex: Math.floor(lv * 0.127),
                desc: "你的每次攻击都会增加攻速"
            },
            parry: {
                zj: 10 + Math.floor(lv * 1.4),
                max_hp: 10 + lv * 5,
                dex: Math.floor(lv * 0.127),
            },
        };
    }

    /**
     * 松风被动 —— 命中叠加：每次命中积累一层「松风」，
     * 每层增加1%攻击速度；上限初始5层，每100级增加一层。
     * 松风为战斗状态，脱战后消失。
     */
    on_attack(me: CHARACTER, _target: CHARACTER, _par: DoAttackPar): number {
        const lv = me.query_skill('songfengjianfa', 0);
        if (lv <= 0) return 0;
        const firstLayer = me.query_status('weapon') === 0;
        me.add_status({
            id: 'weapon',
            name: '松风',
            desc: '松风鼓荡，出招愈发迅捷',
            duration: 0,
            only_combat: me.query_prop('sywx_sf') > 0,
            override: 1,
            max_count: query_songfeng_max_layers(lv),
            prop: { gjsd_per: 1 },
        });
        if (firstLayer) {
            me.send_room('<HIG>$N剑势如松间清风拂过，身形愈发迅捷。</HIG>');
        }
        return 0;
    }

    pfm_set: PerformData = {
        ying: {
            name: '松月无影',
            distime: 20000,
            enable_skill: 'sword',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                let count: number = me.query_status('weapon');
                if (!count) count = 1;
                if (count > 13) count = 13;
                me.send_room(
                    '<HIG>$N深吸一口气，$W倏然刺出，剑影如松间明月，<HIG>无声无息</HIG>却又迅疾无伦！</HIG>',
                    target,
                );
                const mz = me.mz + (me.mz * count * me.query_prop('sywx_mz') / 100)
                for (let i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz,
                        attack_before: i > 0 ? _tmpl('<HIG>松风未止，紧跟着又是一剑</HIG>\n') : undefined,
                    });
                }
                me.end_attack(target);
                if (!me.query_prop('sywx_sf')) 
                    me.remove_status('weapon', true);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '消耗你积累的速度，瞬间出剑，每层松风增加你一次攻击次数';
            },
        },
    };
}

/** 松风叠加层数上限：初始5层，每100级增加一层 */
function query_songfeng_max_layers(lv: number): number {
    return 5 + Math.floor(lv / 100);
}
