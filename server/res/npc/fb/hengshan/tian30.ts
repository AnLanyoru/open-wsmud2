import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '田伯光';
    desc = '万里独行田伯光提着快刀，眼神轻佻，脚下却随时准备远遁。';
    title = '万里独行';
    gender = 1;
    age = 38;
    hp = 21000;
    max_hp = 21000;
    mp = 9000;
    max_mp = 9000;
    pfm_rate = 1;
    score = 30;

    constructor() {
        super();
        this.set_objects(['eq/lv3/kuangfengdao', 1, 1]);
        this.skill_map(['dodge', 560], ['parry', 540], ['force', 520], ['blade', 580], ['kuangfengkuaidao', 620, ['blade', 'parry']]);
    }

    on_died(killer) {
        if (!killer || !this.die_room) return;
        const count = this.die_room.fb_add_temp('tian_count', 1, killer);
        const rooms = ['fb/hengshan/guolaoling', 'fb/hengshan/beiyuedian', 'fb/hengshan/houdian'];
        const room = this.die_room.query(rooms[count - 1]);
        if (!room) return;
        const path = count === 3 ? 'fb/hengshan/tian10' : 'fb/hengshan/tian30';
        const npc = NPC.CLONE(path);
        room.item_changed(npc, true);
        killer.notify('田伯光虚晃一刀，借着山势又向恒山深处逃去。');
    }
}
