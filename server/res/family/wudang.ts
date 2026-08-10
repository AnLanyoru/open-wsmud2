import { FAMILY } from '../../core/skill/family.js';
import type { SkillSet } from '../../core/skill/skill.js';
import type { NPC } from '../../core/char/npc.js';
import type { USER } from '../../core/char/user.js';

export default class extends FAMILY {
    id = 'WUDANG';
    boss_path = 'wudang/zhangsanfeng';
    name = '武当派';
    top_name = '武当派首席弟子';
    top_family = '道宗';
    can_battle = true;
    def_npcs = [
        ['wudang/daotong', 'wd/guangchang'],
        ['wudang/song', 'wd/sanqing'],
        ['wudang/guxu', 'wd/sanqing'],
        ['pub/mpguanli#WUDANG', 'wd/shijie1'],
        ['pub/dadizi#WUDANG', 'wd/taiziyan'],
        ['wudang/zhangsanfeng', 'wd/xiaoyuan'],
    ];
    boss_guard = ['wd/xiaoyuan', 'wd/xiaolu2', 'wd/xiaolu'];
    battle_config = {
        battle_mode: 'family' as const,
        boss_path: this.boss_path,
        boss_room: 'wd/xiaoyuan',
        elder_rooms: ['wd/xiaoyuan', 'wd/xiaoyuan'] as [string, string],
        purple_rooms: ['wd/xiaolu2', 'wd/xiaolu'] as [string, string],
        random_rooms: [],
        titles: { green: '武当派道童', blue: '武当派第三代弟子', yellow: '武当派第二代弟子', purple: '武当派第一代弟子', elder: '武当派长老', boss: '武当派掌门' },
        reinforce_count: 26,
        random_grade_weights: [1, 1, 1] as [number, number, number],
    };
    guard_rooms = ['wd/zijin', 'wd/santian', 'wd/chaotian', 'wd/hutou'];
    npc_skills: SkillSet = [
        ['dodge', 800],
        ['parry', 800],
        ['force', 800],
        ['unarmed', 800],
        ['sword', 800],
        ['literate', 800],
        ['wudangxinfa', 800],
        ['wudangjianfa', 800],
        ['wudangchangquan', 800],
        ['taijishengong', 800, 'force'],
        ['tiyunzong', 800, 'dodge'],
        ['taijijian', 800, 'sword'],
        ['taijiquan', 800, ['unarmed', 'parry']],
    ];
    boss_skills: SkillSet = [
        ['dodge', 800],
        ['parry', 800],
        ['force', 800],
        ['unarmed', 800],
        ['sword', 800],
        ['taijishengong2', 800, 'force'],
        ['tiyunzong2', 800, 'dodge'],
        ['taijijian2', 800, 'sword'],
        ['taijiquan2', 800, ['unarmed', 'parry']],
    ];
    boss_skills2 = [
        ['dodge', 5000],
        ['parry', 5000],
        ['force', 5000],
        ['unarmed', 5000],
        ['sword', 5000],
        ['taijishengong2', 5000, 'force'],
        ['tiyunzong2', 5000, 'dodge'],
        ['taijijian3', 5000, 'sword'],
        ['taijiquan3', 5000, ['unarmed', 'parry']],
    ];

    constructor() {
        super();
        this.set_titles(
            '武当派长老',
            '武当派第一代弟子',
            '武当派第二代弟子',
            '武当派第三代弟子',
            '武当派道童',
        );
    }

    call(player: USER, isbad: boolean) {
        var age = player.query_age();
        if (player.gender == 2) {
            if (age < 30) return isbad ? '小妖女' : '小仙姑';
            else return isbad ? '妖女' : '仙姑';
        } else {
            if (age < 30) return isbad ? '死牛鼻子' : '道兄';
            else return isbad ? '死牛鼻子' : '道长';
        }
    }

    call_me(player: USER, isbad: boolean) {
        if (player.gender == 2) {
            return '贫道';
        } else {
            return isbad ? '本山人' : '贫道';
        }
    }

    on_kill(npc: NPC, me: USER) {
        if (this.query_battle_speaker()) {
            this.battle_chat(
                me.family.name +
                    '门下弟子' +
                    me.name +
                    '击杀我派弟子' +
                    npc.name +
                    '，武当派众弟子听令，对' +
                    me.family.name +
                    '弟子格杀勿论！',
            );
        }
    }

    on_battle(fam) {
        this.battle_chat('无量天尊！');
    }
}
