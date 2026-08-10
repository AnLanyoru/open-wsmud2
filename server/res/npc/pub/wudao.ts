import { NPC } from '../../../core/char/npc.js';
import { USER } from '../../../core/char/user.js';
import type { SkillItem } from '../../../core/skill/skill.js';
import { UTIL } from '../../../core/util/util.js';

interface WuDaoGrowthPoint {
    level: number;
    hp: number;
    panel: number;
}

/** 六十层起采用分段成长；相邻锚点之间按层数线性插值。 */
const WUDAO_GROWTH: readonly WuDaoGrowthPoint[] = [
    { level: 60, hp: 600_000, panel: 10_000 },
    { level: 70, hp: 1_800_000, panel: 25_000 },
    { level: 80, hp: 5_000_000, panel: 50_000 },
    { level: 89, hp: 9_500_000, panel: 77_000 },
    { level: 90, hp: 11_500_000, panel: 80_000 },
    { level: 99, hp: 25_000_000, panel: 150_000 },
];

export function query_wudao_growth(level: number): { hp: number; panel: number } | undefined {
    const first = WUDAO_GROWTH[0];
    const last = WUDAO_GROWTH[WUDAO_GROWTH.length - 1];
    if (level < first.level || level > last.level) return;

    for (let i = 0; i < WUDAO_GROWTH.length - 1; i++) {
        const start = WUDAO_GROWTH[i];
        const end = WUDAO_GROWTH[i + 1];
        if (level > end.level) continue;

        const progress = (level - start.level) / (end.level - start.level);
        return {
            hp: Math.round(start.hp + (end.hp - start.hp) * progress),
            panel: Math.round(start.panel + (end.panel - start.panel) * progress),
        };
    }

    return { hp: last.hp, panel: last.panel };
}

export default class WuDaoShouHu extends NPC {
    name = '';
    desc = '他是武道塔的神秘守护者';
    title = '武道塔守护者';
    gender = 1;
    age = 25;
    per = this.random(44);
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    no_refresh = true;
    no_fight = true;
    skills_def: SkillItem[][] = [
        [
            ['force', 100],
            ['unarmed', 100],
            ['sword', 100],
            ['parry', 100],
            ['dodge', 100],
            ['hunyuanyiqi', 100, 'force'],
            ['wudangchangquan', 100, 'unarmed'],
            ['feiyanhuixiang', 100, 'dodge'],
            ['wudangjianfa', 100, 'sword'],
            ['zhemeishou', 100, 'parry'],
        ],
        [
            ['force', 300],
            ['unarmed', 300],
            ['sword', 300],
            ['parry', 300],
            ['dodge', 300],
            ['zixiashengong', 300, 'force'],
            ['taizuchangquan', 300, 'unarmed'],
            ['yunlongjian', 300, 'sword'],
            ['taijiquan', 300, 'parry'],
            ['sixiangbu', 300, 'dodge'],
        ],
        [
            ['force', 500],
            ['unarmed', 500],
            ['sword', 500],
            ['parry', 500],
            ['dodge', 500],
            ['taijishengong', 500, 'force'],
            ['qishangquan', 500, 'unarmed'],
            ['kuangfengkuaijian', 500, 'sword'],
            ['taijiquan', 500, 'parry'],
            ['tiyunzong', 500, 'dodge'],
        ],
        [
            ['force', 800],
            ['unarmed', 800],
            ['sword', 800],
            ['parry', 800],
            ['dodge', 800],
            ['yijinjing', 800, 'force'],
            ['yiyangzhi', 800, 'unarmed'],
            ['taijijian', 800, 'sword'],
            ['dugujiujian', 800, 'parry'],
            ['wuduyanluobu', 800, 'dodge'],
        ],
        [
            ['force', 1100],
            ['unarmed', 1100],
            ['sword', 1100],
            ['parry', 1100],
            ['dodge', 1100],
            ['mingyugong', 1100, ['force', 'dodge']],
            ['yiyangzhi', 1100, 'unarmed'],
            ['yitianjianfa', 1100, 'sword'],
            ['yihuajiemu', 1100, 'parry'],
        ],
        [
            ['force', 1400],
            ['unarmed', 1400],
            ['sword', 1400],
            ['parry', 1400],
            ['dodge', 1400],
            ['hamagong', 1400, 'force'],
            ['tanzhishengong', 1400, 'unarmed'],
            ['kuangfengkuaijian2', 1400, 'sword'],
            ['taijiquan', 1400, 'parry'],
            ['kuihuashengong', 1400, 'dodge'],
        ],
        [
            ['force', 1700],
            ['unarmed', 1700],
            ['sword', 1700],
            ['parry', 1700],
            ['dodge', 1700],
            ['kuihuashengong', 1700, ['force', 'dodge']],
            ['cuixinzhang', 1700, 'unarmed'],
            ['bixiejianfa', 1700, ['sword', 'parry']],
        ],
        [
            ['force', 2000],
            ['unarmed', 2000],
            ['sword', 2000],
            ['parry', 2000],
            ['dodge', 2000],
            ['jiuyangshengong', 2000, 'force'],
            ['chuanxinzhang2', 2000, 'unarmed'],
            ['dugujiujian', 2000, 'sword'],
            ['taijiquan', 2000, 'parry'],
            ['kuihuashengong', 2000, 'dodge'],
        ],
        [
            ['force', 2500],
            ['unarmed', 2500],
            ['sword', 2500],
            ['parry', 2500],
            ['dodge', 2500],
            ['taixuangong', 2500, 'force'],
            ['xianglongzhang2', 2500, 'unarmed'],
            ['qixianwuxingjian', 2500, 'sword'],
            ['taijiquan', 2500, 'parry'],
            ['xuanxubu', 2500, 'dodge'],
        ],
        [
            ['force', 3000],
            ['unarmed', 3000],
            ['sword', 3000],
            ['parry', 3000],
            ['dodge', 3000],
            ['jiuyinshengong', 3000, 'force'],
            ['jiuyinbaiguzhao2', 3000, 'unarmed'],
            ['taijijian', 3000, 'sword'],
            ['qiankundanuoyi', 3000, 'parry'],
            ['lingboweibu2', 3000, 'dodge'],
        ],
        [
            ['force', 4000],
            ['unarmed', 4000],
            ['sword', 4000],
            ['parry', 4000],
            ['dodge  ', 4000],
            ['jiuyangshengong', 5000, 'force'],
            ['liumaishenjian', 5000, 'unarmed'],
            ['xuantiejianfa', 5000, 'sword'],
            ['qiankundanuoyi', 5000, 'parry'],
            ['lingboweibu2', 5000, 'dodge'],
        ],
    ];

    init_from(this: WuDaoShouHu, player: USER, level: number) {
        if (level > 100) level = 100;
        const grade1 = Math.floor(level / 10);
        this.name = UTIL.random_name(this.gender);
        this.skill_map(...this.skills_def[grade1]);
        var color = ['hig', 'hic', 'hiy', 'hiz', 'hio', 'ora'][parseInt(level / 20)];
        this.title = '<' + color + '>武道塔守护者</' + color + '>';
        this.set_objects(['eq/lv0/cloth', 1, 1], ['eq/lv0/jian', 1, 1]);

        this.hp = this.max_hp = 1000 + level * level * 150;
        this.mp = this.max_mp = parseInt(this.hp / 2);
        this.con = this.dex = this.int = this.str = 20 + parseInt(level / 3);
        this.init();
        this.recount();

        const growth = query_wudao_growth(level);
        if (growth) {
            this.hp = this.max_hp = growth.hp;
            this.mp = this.max_mp = Math.floor(growth.hp / 2);
            this.calibrate_panel(growth.panel);
        }
    }

    /**
     * 把技能和装备形成的永久属性校准到指定五维。
     * 补偿写入原始平值通道，后续 recount 及百分比状态仍会以新面板为基础生效。
     */
    private calibrate_panel(target: number): void {
        this.calibrate_combat_prop('gj', 'gj_per', target);
        this.calibrate_combat_prop('mz', 'mz_per', target);
        this.calibrate_combat_prop('zj', 'zj_per', target);
        this.calibrate_combat_prop('ds', 'ds_per', target);
        this.calibrate_combat_prop('fy', 'fy_per', target);
    }

    private calibrate_combat_prop(
        prop: 'gj' | 'mz' | 'zj' | 'ds' | 'fy',
        percentageProp: 'gj_per' | 'mz_per' | 'zj_per' | 'ds_per' | 'fy_per',
        target: number,
    ): void {
        // recount 最终取整，浮点边界可能残留 1 点误差，重复校准可将其消除。
        for (let i = 0; i < 3 && this[prop] !== target; i++) {
            const multiplier = Math.max((100 + this.query_prop(percentageProp)) / 100, 0.01);
            this.add_prop(prop, (target - this[prop]) / multiplier);
            this.recount();
        }
    }
}
