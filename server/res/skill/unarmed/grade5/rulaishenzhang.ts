import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '如来神掌';
    id = 'rulaishenzhang';
    grade = 5;

    desc =
        '佛门至高无上的掌法绝学，相传为佛祖释迦牟尼所创，一掌出而万法随，有降妖伏魔、普渡众生之无量神通';
    can_enables = ['unarmed'];
    attack_actions = [
        '$N双掌合十，周身佛光隐现，一招「<HIC>佛光初现</HIC>」带着无边慈悲拍向$n的$l',
        '$N左掌竖立胸前，右掌缓缓推出，正是「<HIC>金顶佛灯</HIC>」，佛光点点罩向$n的$l',
        '$N口诵佛号，一掌平平拍出，看似缓慢实则迅疾，一式「<HIC>佛问迦蓝</HIC>」直取$n的$l',
        '$N身形微晃，留下道道残影，一招「<HIC>迎佛西天</HIC>」自不可思议的角度印向$n的$l',
        '$N掌势骤然浩大无匹，如佛祖震怒，一式「<HIC>佛动山河</HIC>」挟万钧之势压向$n的$l',
        '$N双掌连挥，金光万道，一招「<HIC>佛法无边</HIC>」化作漫天掌影笼罩$n的$l',
        '$N纵身而起，居高临下，一式「<HIC>天佛降世</HIC>」带着毁天灭地之威拍向$n的$l',
        '$N双手结成佛印，须臾间一掌推出，正是「<HIC>如来灭魔</HIC>」，佛光普照中暗藏无上杀机',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: 5 + Math.floor(lv * 1.6),
                mz: 5 + Math.floor(lv * 1.8),
                mz_per: 8,
                gj_per: 8,
            },
        };
    }

    pfm_set: PerformData = {
        fo: {
            name: '万佛朝宗',
            distime: 25000,
            enable_skill: 'unarmed',
            mp: 120,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                me.send_room(
                    '<hiy>$N双掌合十，宝相庄严，口中念诵佛号，霎时间金光大作，一式「<HIC>万佛朝宗</HIC>」引得漫天佛影浮动！</hiy>',
                    target,
                );
                var total_damage = 0;
                var enemies = me.get_nearby_enemies();
                if (enemies.length === 0) enemies = [target];
                for (var i = 0; i < enemies.length; i++) {
                    var enemy = enemies[i];
                    if (enemy.hp <= 0) continue;
                    var sh = me.do_attack({
                        target: enemy,
                        gj: Math.floor(me.gj * 0.5),
                        mz: me.mz,
                        attack_msg: '<hiy>一道佛影自虚空中浮现，一掌拍向$n！</hiy>',
                        miss_msg: '<cyn>$n被佛光所慑，拼命闪避。</cyn>',
                        damage_msg: '<hir>$n被佛掌击中，闷哼一声，气血翻涌！</hir>',
                    });
                    if (sh > 0) total_damage += sh;
                    me.end_attack(enemy);
                }
                if (total_damage > 0) {
                    var heal = Math.floor(total_damage * 0.5);
                    me.add_hp(heal);
                    me.send_room(
                        '<hiz>$N催动万佛朝宗之奥义，将造成的伤害转化为自身的气血，伤势以肉眼可见的速度愈合！</hiz>',
                        target,
                    );
                }
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '对附近敌人造成内力伤害，将造成的伤害转化为你的气血';
            },
        },
        mie: {
            name: '灭魔',
            distime: 48000,
            enable_skill: 'unarmed',
            mp: 120,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var time = 2000 + lv * 3;
                if (time > 6000) time = 6000;
                me.send_room(
                    '<hiy>$N纵身跃起数丈之高，周身佛光万丈，如我佛如来降临凡尘，一式「<HIC>灭魔</HIC>」从天而降！</hiy>',
                    target,
                );
                var fy_bonus = Math.floor(me.fy * 0.3);
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj + fy_bonus,
                    mz: me.mz + fy_bonus,
                    attack_msg: '<hiy>$N掌挟万钧之势，如流星坠地般朝$n当头拍下！</hiy>',
                    miss_msg: '<cyn>$n见这一掌威势无双，哪敢硬接，连滚带爬地向旁闪去！</cyn>',
                    damage_msg:
                        '<hir>只听「轰隆」一声巨响，$n被$N一掌拍入地面，方圆数丈之内龟裂如蛛网！</hir>',
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'faint',
                            name: '昏迷',
                            duration: time,
                            is_faint: true,
                            downside: true,
                            desc: '你被如来神掌灭魔式击中，昏迷不醒',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                return '一式从天而降的掌法，对敌人造成大量伤害，并昏迷，防御、伤害减免会增加最终伤害和命中';
            },
        },
    };
}
