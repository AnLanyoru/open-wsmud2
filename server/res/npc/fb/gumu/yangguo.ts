import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '杨过';
    title = '<hiy>神雕大侠</hiy>';
    desc = '杨过神情恍惚地守在琴旁，似乎正沉浸在久远的回忆中。';
    hp = 240000;
    max_hp = 240000;
    mp = 90000;
    max_mp = 90000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 1320], ['dodge', 1300], ['parry', 1320], ['unarmed', 1340]);
        this.add_action('gumu_dianxue', '点穴', function (this: NPC, me) {
            const room = this.environment;
            if (!room) return;
            if (room.is_here('fb/gumu/xiaolongnv')) return me.notify('小龙女护在杨过身旁，你无法近身点穴。');
            if (room.fb_query_temp('gumu_yangguo', me, false)) return me.notify('杨过穴道已被制住。');
            room.fb_set_temp('gumu_yangguo', true, me);
            me.notify('你趁杨过心神恍惚点中他的穴道，暗河方向传来隐约水声。');
        });
    }

    on_kill() {
        return false;
    }
}
