import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '银索金铃';
    id = 'yinsuojinling';
    grade = 3;

    desc =
        '古墓派小龙女的独门兵器武功，以银索为鞭、金铃为缀。银索如灵蛇吐信变幻莫测，金铃作响乱人心神，索铃合一，刚柔并济，端的是武林中一门清雅绝俗的奇门武功。';

    can_enables = ['whip'];

    attack_actions = [
        '$N皓腕轻翻，手中$W带着一串清脆铃声，如灵蛇出洞般倏地点向$n的$l',
        '$N衣袂飘飘，$W一抖，金铃叮当作响，鞭梢化作一道银光劈面抽向$n的$l',
        '$N身形翩然一转，$W在半空中划出一道弧线，挟着悦耳铃声横扫$n的$l',
        '$N素手微扬，$W已如银蛇缠身般卷向$n，铃音忽远忽近扰人心神',
        '$N纤手轻挥，$W带着金铃破空而出，铃声未至，鞭梢已袭到$n的$l',
        '$N身法若仙，手中$W化作漫天鞭影，如天女散花般罩向$n周身',
        '$N手腕急抖，$W上数枚金铃齐声大作，叮当声中一道鞭影直奔$n的$l而去',
        '$N将$W凌空一抖，金铃之声忽左忽右，鞭势飘忽不定，已悄然绕向$n的$l',
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            whip: {
                gj: 10 + lv * 1,
                mz: 10 + Math.floor(lv * 1.2),
                dex: 10 + Math.floor(lv * 0.2),
                con: 10 + Math.floor(lv * 0.2),
            },
        };
    }

    pfm_set: PerformData = {
        dian: {
            name: '隔空点穴',
            distime: 30000,
            enable_skill: 'whip',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                // 银索金铃之隔空点穴：以金铃远距离击打敌人穴道
                // 命中后使敌人忙乱，时长随等级成长，最高10秒
                var time = lv * 20;
                if (time > 10000) time = 10000;
                me.send_room(
                    '<HIY>$N凝神静气，玉腕轻翻，银索上的金铃陡然脱索飞出，挟着凌厉的破空之音直取$n的周身大穴！</HIY>\n',
                    target,
                );
                var sh = me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    attack_msg:
                        '<HIY>$N手中的银索金铃化作道道银光，铃声忽远忽近飘忽不定，倏地数枚金铃已从不可思议的方位袭至$n胸前要穴！</HIY>',
                    miss_msg:
                        '<cyn>$n大惊之下，身形急转，金铃擦身而过，铃声兀自在耳畔嗡嗡作响，不由得惊出一身冷汗。</cyn>',
                    damage_msg:
                        '<hir>只听得「叮铃」一声脆响，金铃不偏不倚正中$n要穴，$n只觉半身酸麻，手足俱软，一时动弹不得！</hir>',
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'busy',
                            is_busy: true,
                            name: '点穴',
                            downside: true,
                            desc: '你被银索金铃隔空点中穴道，半身酸麻，暂时无法行动。',
                            duration: time,
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                var time = Math.round(lv / 50);
                if (time < 2) time = 2;
                else if (time > 10) time = 10;
                return (
                    '以金铃远距离击打敌人穴道，命中后使敌人' +
                    time +
                    '秒内处于忙乱状态，无法攻击与招架。'
                );
            },
        },
    };
}
