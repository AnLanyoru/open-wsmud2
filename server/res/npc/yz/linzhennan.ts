import { NPC } from '../../../core/char/npc.js';
import { USER } from '../../../core/char/user.js';
import { USERTASK } from '../../../core/task/playertask.js';

export default class extends NPC {
    name = '林震南';
    desc = '他就是「福威镖局」的总镖头－－林震南。';
    title = '福威镖局当家的';
    gender = 1;
    age = 45;
    per = 34;
    mp = 3000;
    max_mp = 3000;
    hp = 3000;
    max_hp = 3000;

    constructor() {
        super();
        this.skill_map(['unarmed', 150], ['dodge', 150], ['parry', 150]);
        this.add_action('biao', '运镖', function (me: USER) {
            let yunbiao_task = USERTASK.GET('yunbiao');
            if (!yunbiao_task) return me.send('运镖系统暂未开放！');
            yunbiao_task.on_start?.(me);
        });
        this.add_action('ksyb', '雇佣镖师', function (me) {
            let yunbiao_task = USERTASK.GET('yunbiao');
            if (!yunbiao_task) return me.send('运镖系统暂未开放！');
            yunbiao_task.quick_start?.(me);
        });
    }
}
