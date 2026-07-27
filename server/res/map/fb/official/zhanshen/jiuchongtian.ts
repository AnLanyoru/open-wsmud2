import { ROOM } from '../../../../../core/room/room.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '九重天';
    desc = "九层天台悬于星河之间，脚下众山皆如尘芥。尽头<cmd cmd='look tablet'>武神碑</cmd>无字无痕，却映出挑战者一路走来的每场战斗。";
    exits = {
        south: 'fb/official/zhanshen/xuankong',
    };
    difficulty = 0;

    constructor() {
        super();
        this.set_item('tablet', '武神碑', '碑面映着无尽星河，仿佛在等待后来者留下自己的武道。', [
            ['touch', '触摸武神碑', this.touch],
        ]);
    }

    on_set_difficulty = (type: number) => {
        this.difficulty = type;
    };

    touch(me: USER) {
        if (this.fb_query_temp('zhanshen_title', me, false)) return me.notify('武神碑上已经留下了你的武道印记。');
        if (this.difficulty === 0) {
            if (!this.fb_query_temp('zhanshen_wood', me, false) || !this.fb_query_temp('zhanshen_water', me, false)) return me.notify('木凤与魔龙的试炼尚未完成。');
            this.fb_set_temp('zhanshen_title', true, me);
            me.add_title('<hic>战神殿传人</hic>', 'fb_zhanshen_normal');
            me.notify('<hic>浩荡声音自九天传来：胜人者有力，胜己者方为强者。你获得称号【战神殿传人】。</hic>');
            return;
        }
        if (!this.fb_query_temp('zhanshen_chiyou', me, false)) return me.notify('兵主蚩尤尚未伏诛。');
        this.fb_set_temp('zhanshen_title', true, me);
        me.add_title('<ord>武神</ord>', 'fb_zhanshen_difficult');
        if (me.level === 5) me.level_up();
        me.notify('<ord>九重天星河倒卷，武神碑留下你的姓名。恭喜你踏入武神行列，获得称号【武神】。</ord>');
    }
}
