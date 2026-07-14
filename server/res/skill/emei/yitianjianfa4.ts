import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';
import { NPC } from '../../../core/char/npc.js';

export default class extends SKILL {
    name = '诸天剑诀';
    id = 'yitianjianfa4';
    grade = 6;
    family = FAMILIES.EMEI;
    is_ultimate = true;
    desc = '上古梵门绝技，灭神魔渡天下';
    can_enables = ['sword'];
    attack_actions = [
        '$N口宣佛号，$W上梵光流转，一剑挥出如佛光普照，直指$n的$l',
        '$N面露慈悲，手中$W却裹挟着渡魔之力，剑锋过处虚空震颤，斩向$n的$l',
        '$N双手举剑过顶，$W上浮现诸天梵文，一道金色剑罡轰然劈向$n的$l',
        '$N低吟密咒，$W化作漫天金光，每一道光芒都是一道剑气，笼罩$n的$l',
        '$N身与剑合，$W上绽放无量佛光，如金刚怒目般斩向$n的$l',
        '$N剑指苍穹，$W引动九天梵音，一道贯穿天地的剑柱直落$n的$l',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: lv * 3,
                mz: lv * 3,
                mz_per: 5 + Math.floor(lv / 200),
                diff_fy_per: 5 + Math.floor(lv / 200),
                add_bjsh_per: 10 + Math.floor(lv / 300),
                desc: '超渡：战斗中击杀敌人后恢复自己的全部血量，清理异常状态',
            },
        };
    }

    /**
     * 超渡 — 击杀敌人时恢复全部气血、清理异常状态
     */
    on_enemy_die(me: CHARACTER, target: CHARACTER): void {
        me.add_hp(me.max_hp - me.hp);
        me.clear_downside(true);
        me.send_room('<ord>$N超渡了$n的亡魂，周身佛光普照，伤势痊愈。</ord>', target);
    }

    pfm_set: PerformData = {
        du: {
            name: '渡魔',
            distime: 15000,
            enable_skill: 'sword',
            mp: 1190,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const per = 20 + Math.floor(lv / 400);
                const heavens = [
                    '<ord>-----自在天！-----</ord>\n$N心无挂碍，$W得大自在，第一重天魔劫降临！',
                    '<ord>-----善见天！-----</ord>\n$N慧眼洞开，$W善见诸法实相，第二重天魔劫破空而至！',
                    '<ord>-----琉璃天！-----</ord>\n$N内外明澈，$W如琉璃净无瑕秽，第三重天魔劫光耀十方！',
                    '<ord>-----清净天！-----</ord>\n$N涤尽尘垢，$W清净无染，第四重天魔劫荡涤乾坤！',
                    '<ord>-----婆罗天！-----</ord>\n$N威仪具足，$W婆罗神力灌注，第五重天魔劫降伏万魔！',
                    '<ord>-----帝释天！-----</ord>\n$N帝释威严，$W执金刚杵破魔障，第六重天魔劫镇伏三界！',
                    '<ord>-----大梵天！-----</ord>\n$N大梵圣光，$W显化创世之威，第七重天魔劫灭神渡魔！',
                ];
                const damageMsgs = [
                    '<ord>$n被自在天之力镇压，心神俱震！</ord>',
                    '<ord>$n被善见天之力照彻，无处遁形！</ord>',
                    '<ord>$n被琉璃天之力澄澈，五内如焚！</ord>',
                    '<ord>$n被清净天之力净化，灵肉分离！</ord>',
                    '<ord>$n被婆罗天之力降伏，法力溃散！</ord>',
                    '<ord>$n被帝释天之力镇伏，金刚碎甲！</ord>',
                    '<ord>$n被大梵天之力渡化，堕入无间！</ord>',
                ];

                let gj = me.gj;
                let mz = me.mz;
                let slain = false;

                for (let i = 0; i < 7; i++) {
                    const nowTarget = me.query_enemy() || target;
                    if (!nowTarget || slain) break;

                    if (
                        me.do_attack({
                            target: nowTarget,
                            attack_msg: heavens[i],
                            damage_msg: damageMsgs[i],
                            gj: gj,
                            mz: mz,
                        })
                    ) {
                        // 每命中一重天，下一击的倍率翻升
                        gj = Math.floor((gj * (100 + per)) / 100);
                        mz = Math.floor((mz * (100 + per)) / 100);
                        // 若此击毙敌，记录并终止后续攻击
                        if (!nowTarget.is_living()) {
                            slain = true;
                        }
                    }
                }

                if (slain) {
                    me.clear_distime('sword/du');
                    me.send_room(
                        '<ord>$n于七重梵光中化作梦幻泡影，渡尽劫波，剑光复锐！</ord>',
                        target,
                    );
                }

                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const per = 20 + Math.floor(lv / 400);
                return '魔渡七重天，每层增加' + per + '%伤害和命中，超度敌人后重置绝招CD';
            },
        },
        fo: {
            name: '渡佛',
            distime: 60000,
            enable_skill: 'sword',
            mp: 1390,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const ratio = (30 + Math.floor(lv / 200)) / 100;
                // 清除敌人的正面状态
                target.clear_downside(false);
                me.send_room(
                    '<ord>$N高举$W，口诵佛号：魔易渡，佛难超！佛光普照之下，$n的护体真气如冰雪消融。</ord>',
                    target,
                );
                if (
                    me.do_attack({
                        attack_msg: '<ord>$N手中$W佛光大盛，一剑斩向$n！</ord>',
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                    })
                ) {
                    // 唤出心魔 — 对NPC造成伤害后召唤具有敌人大部分属性和技能的心魔
                    if (!target.is_player && me.environment) {
                        try {
                            const demon = Object.create(target) as NPC;
                            demon.clone();

                            // 清除从目标继承的运行时状态
                            demon.environment = undefined;
                            demon.enemy = null;
                            demon.fight_type = 0;
                            demon.attack_handler = null;
                            demon.follow_target = null;
                            demon.follow_targets = null;
                            demon.team = null;

                            // 使用玩家 ratio 比例的气血内力上限
                            demon.max_hp = Math.floor(me.max_hp * ratio);
                            demon.max_mp = Math.floor(me.max_mp * ratio);
                            demon.hp = demon.max_hp;
                            demon.mp = demon.max_mp;
                            demon.name = target.name + '「<hir>心魔</hir>」';
                            demon.recount();

                            // 加入房间
                            me.environment!.item_changed(demon, true);
                            // 多主体消息含 me($N) + demon($n)，item_changed 仅支持 $N，改用 send_room 单独发送
                            me.send_room('<ord>$n的心魔被$N的佛光剥离而出，化作$N的护法！</ord>', demon);

                            // 攻击召唤者的当前敌人
                            const enemy = me.query_enemy() || target;
                            if (enemy && enemy.is_living()) {
                                demon.do_kill(enemy);
                            }

                            // 30秒后消散
                            me.call_out(() => {
                                if (demon.environment) {
                                    demon.destroy(
                                        '<ord>' +
                                            demon.name +
                                            '发出一声不甘的嘶吼，消散于天地之间。</ord>',
                                    );
                                }
                            }, 30000);
                        } catch (_e) {
                            // 克隆失败时静默处理
                        }
                    }
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const ratio = 30 + Math.floor(lv / 200);
                return (
                    '魔易渡，佛难超，清除敌人的正面状态，对敌人(NPC)造成伤害后唤出对方心魔替自己战斗，心魔具有敌人的大部分属性和技能，使用你' +
                    ratio +
                    '%的气血内力上限(每分钟可召唤一个，最多存在30秒)'
                );
            },
        },
    };
}
