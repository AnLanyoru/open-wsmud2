import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER } from '../../../../core/char/character.js';

// ============================================================
// 踏歌行 — 青城派高级轻功
// 青城天下幽，道门修真之地。踏歌一脉，取意太白诗仙「忽闻岸上踏歌声」，
// 于刀光剑影中吟咏而行，歌未尽而身已远，诗未绝而敌已溃。
// ============================================================

export default class extends SKILL {
    name = '踏歌行';
    id = 'tagexing';
    grade = 2;

    desc =
        '青城派的轻功身法，相传创自青城山一位嗜酒如命、好诗成痴的前辈。每于月下独酌，醉后踏歌而行，身形随诗意流转，倏忽来去，踏遍青城三十六峰而不倦。';
    can_enables = ['dodge'];
    dodge_actions = [
        '$n朗声长吟「<HIY>我本楚狂人，凤歌笑孔丘</HIY>」，足下踏歌而行，身形随诗句流转，$N眼前一花，$n已飘然在数丈之外。\n',
        '却听$n曼声吟道「<HIC>桃花潭水深千尺，不及汪伦送我情</HIC>」，音犹在耳，人已如轻舟过万重山般从$N身侧掠过。\n',
        '$n仰天一笑，歌声乍起：「<HIG>人生得意须尽欢，莫使金樽空对月</HIG>」——歌未毕，身形已随酒意飘摇，$N一击落空。\n',
        '只闻$n扣剑而歌「<HIM>白日放歌须纵酒，青春作伴好还乡</HIM>」，脚下步履看似凌乱，实则暗合音律，竟从$N的招式缝隙间穿了过去。\n',
        '$n引吭高歌「<HIW>莫听穿林打叶声，何妨吟啸且徐行</HIW>」，袍袖翻飞间整个人如乘风归去，$N的攻势尽数落空。\n',
        '忽闻$n一声清啸「<HIC>仰天大笑出门去，我辈岂是蓬蒿人</HIC>」，身形随啸声冲天而起，宛若诗仙乘鹤，飘飘然不可方物。\n',
        '$n以指叩节，口中吟道「<HIY>青城天下幽，三十六峰青云收</HIY>」，步履如踏云而行，$N但觉眼前青影一闪，$n已杳然无踪。\n',
        '$n长袖一挥，且行且歌：「<GRN>问余何意栖碧山，笑而不答心自闲</GRN>」，身形如碧山闲云，$N只觉攻势如泥牛入海，浑然不知$n身在何处。\n',
    ];

    slots = [
        {
            prop: 'tgx_gj',
            value: (lv: number) => lv,
            format: (val: number) => `踏歌行额外提升自身攻击${val}点`,
        },
        {
            prop: 'tgx_ds',
            value: (lv: number) => lv,
            format: (val: number) => `踏歌行额外提升自身躲闪${val}点`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: 40 + Math.floor((lv * 13) / 10),
                dex: Math.floor(lv / 8) + 1,
            },
        };
    }

    pfm_set: PerformData = {
        tage: {
            name: '踏歌行',
            distime: 30000,
            enable_skill: 'dodge',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = query_tgx_buff_duration(lv);
                const gjBonus = query_tgx_gj_bonus(lv) + me.query_prop('tgx_gj');
                const dsBonus = query_tgx_ds_bonus(lv) + me.query_prop('tgx_ds');

                me.send_room(
                    '<hiy>$N仰天大笑，解剑入鞘，竟于刀光剑影中纵声长歌——「<HIC>我歌月徘徊，我舞影零乱</HIC>」！霎时身形如太白醉月，步履踏歌，风雷隐隐，$N整个人与诗意融为一体，剑影刀光中独行如入无人之境！</hiy>',
                    target,
                );

                me.add_status({
                    id: 'dodge',
                    name: '踏歌',
                    desc: '踏歌而行，诗中有剑，歌中有气，攻击与躲闪大幅提升。',
                    duration: duration,
                    prop: {
                        gj: gjBonus,
                        ds: dsBonus,
                    },
                    finish_msg:
                        '<hic>$N一曲踏歌终了，长袖一拂，仰天笑道：「兴尽悲来，识盈虚之有数。」身形缓缓落下，诗韵犹在风中回荡。</hic>',
                });
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const duration = query_tgx_buff_duration(lv);
                const gjBonus = query_tgx_gj_bonus(lv);
                const dsBonus = query_tgx_ds_bonus(lv);
                return `${toSec(duration)}秒内，提升自身攻击力${gjBonus}点，躲闪${dsBonus}点。`;
            },
        },
    };
}

// ============================================================
// 踏歌行 — 公共计算函数
// ============================================================

/** 踏歌行：持续时间（毫秒） */
function query_tgx_buff_duration(lv: number): number {
    return 10000 + lv * 10;
}

/** 踏歌行：攻击力加成（固定值） */
function query_tgx_gj_bonus(lv: number): number {
    return lv * 2;
}

/** 踏歌行：躲闪加成（固定值） */
function query_tgx_ds_bonus(lv: number): number {
    return 500 + lv * 2;
}
