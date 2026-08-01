import { NPC } from '../../../core/char/npc.js';

export default class extends NPC {
    name = '蒙古兵';
    desc = '蒙古兵的万夫长，狡勇善战';
    title = '<hio>万夫长</hio>';
    gender = 1;
    age = 65;
    per = 27;
    max_mp = 4000000;
    max_hp = 4000000;
    level = 3;
    no_refresh = true;
    pfm_rate = 1;
    prop = {
        gj: 15000,
        fy: 15000,
        mz: 15000,
        zj: 10000,
        ds: 15000,
        diff_sh: 10000,
    };

    constructor() {
        super();
        this.set_objects(
            ['eq/xiangyang/menggujunqiang#5', 1, 1],
            ['eq/xiangyang/menggujunfu#5', 1, 1],
            ['eq/xiangyang/lizimao#5', 1, 1],
            ['eq/xiangyang/menggujunxue#5', 1, 1],
        );
        this.skill_map(
            ['dodge', 1500],
            ['parry', 1500],
            ['force', 1500],
            ['unarmed', 1500],
            ['club', 1500],
            ['mengguqiangfa', 1500, ['club', 'parry']],
            ['longxianggong', 1500, ['unarmed', 'force']],
            ['feiyanzoubi', 1500, 'dodge'],
        );
    }
}
