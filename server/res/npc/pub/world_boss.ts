import { NPC } from '../../../core/char/npc.js';
import type { OddsEntry } from '../../../core/item/obj.js';
import type { SkillItem } from '../../../core/skill/skill.js';

interface WorldBossTemplate {
    name: string;
    title: string;
    desc: string;
    skills: SkillItem[];
    drops: OddsEntry[];
}

const WORLD_BOSS_TEMPLATES: Readonly<Record<number, WorldBossTemplate>> = {
    3: {
        name: '宗师级首领',
        title: '<hiy>宗师级首领</hiy>',
        desc: '这是一位名震一方的宗师级首领，举手投足间自有一派大家气度。',
        skills: [
            ['force', 1000],
            ['unarmed', 1000],
            ['sword', 1000],
            ['parry', 1000],
            ['dodge', 1000],
            ['baiyunxinfa', 1000, 'force'],
            ['qishangquan', 1000, 'unarmed'],
            ['songshanjianfa', 1000, ['sword', 'parry']],
            ['anyingfuxiang', 1000, 'dodge'],
        ],
        drops: [
            { obj: 'money/silver', min: 50, max: 100 },
            {
                obj: ['eq/lv3/jinshejian', 'eq/lv3/panshihufu', 'eq/lv3/mengzhupifeng'],
                odds: 1000,
            },
            {
                obj: [
                    'book/bc#baiyunxinfa',
                    'book/bc#qishangquan',
                    'book/bc#songshanjianfa',
                    'book/bc#anyingfuxiang',
                ],
                odds: 3000,
            },
        ],
    },
    4: {
        name: '武圣级首领',
        title: '<hiz>武圣级首领</hiz>',
        desc: '这是一位武学修为已臻化境的武圣级首领，周身气机凝而不发。',
        skills: [
            ['force', 2000],
            ['unarmed', 2000],
            ['sword', 2000],
            ['parry', 2000],
            ['dodge', 2000],
            ['mingyugong', 2000, 'force'],
            ['hamagong', 2000, 'unarmed'],
            ['bianjianfa', 2000, 'sword'],
            ['yihuajiemu', 2000, 'parry'],
            ['xuanxubu', 2000, 'dodge'],
        ],
        drops: [
            { obj: 'money/silver', min: 100, max: 200 },
            {
                obj: ['eq/lv4/yuxiao', 'eq/lv4/ruanweijia', 'eq/lv4/shenghuoling'],
                odds: 500,
            },
            {
                obj: [
                    'book/bc#mingyugong',
                    'book/bc#hamagong',
                    'book/bc#bianjianfa',
                    'book/bc#yihuajiemu',
                    'book/bc#xuanxubu',
                ],
                odds: 2000,
            },
        ],
    },
    5: {
        name: '武帝级首领',
        title: '<hio>武帝级首领</hio>',
        desc: '这是一位足以雄视天下的武帝级首领，浩瀚威压令人几乎无法喘息。',
        skills: [
            ['force', 3000],
            ['unarmed', 3000],
            ['sword', 3000],
            ['parry', 3000],
            ['dodge', 3000],
            ['jiuyangshengong', 3000, 'force'],
            ['rulaishenzhang', 3000, 'unarmed'],
            ['xuantiejianfa', 3000, 'sword'],
            ['qiankundanuoyi', 3000, 'parry'],
            ['lingxibu', 3000, 'dodge'],
        ],
        drops: [
            { obj: 'money/silver', min: 200, max: 500 },
            {
                obj: ['eq/lv5/yitianjian', 'eq/lv5/tulongdao', 'eq/lv5/jingangfumozhang'],
                odds: 100,
            },
            {
                obj: [
                    'book/bc#jiuyangshengong',
                    'book/bc#rulaishenzhang',
                    'book/bc#xuantiejianfa',
                    'book/bc#qiankundanuoyi',
                    'book/bc#lingxibu',
                ],
                odds: 1000,
            },
        ],
    },
};

export default class extends NPC {
    name = '世界首领';
    desc = '这是一位来历不明的世界首领。';
    title = '<hiw>世界首领</hiw>';
    gender = 1;
    age = 50;
    per = 30;
    hp = 10000;
    max_hp = 10000;
    mp = 10000;
    max_mp = 10000;
    score = 100;

    on_create(_path: string, par?: string): void {
        const grade = Number.parseInt(par?.slice(1) ?? '');
        const template = WORLD_BOSS_TEMPLATES[grade];
        if (!template) return;
        this.name = template.name;
        this.title = template.title;
        this.desc = template.desc;
        this.set_objects(['eq/lv0/cloth', 1, 1], ['eq/lv0/jian', 1, 1]);
        this.skill_map(...template.skills);
        this.set_drop(...template.drops);
    }
}
