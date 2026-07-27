import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石壁';
    desc = "高大石壁刻满蝌蚪般的古怪文字，交错的<cmd cmd='look inscription'>石壁刻图</cmd>似有内息运行之理，南面通往罚恶使者的内厅。";
    exits = {
        east: 'fb/xiake/shimen',
        south: 'fb/xiake/neiting',
    };

    constructor() {
        super();
        this.set_item('inscription', '石壁刻图', '壁上诗句与人体经脉图交错。可留在石破天身边研习，也可选择罚恶一路杀入岛中。', [
            ['reward', '随石破天研习', this.reward],
            ['punish', '闯入内厅罚恶', this.punish],
        ]);
        this.set_npc('fb/xiake/shitian');
    }

    reward(me: USER) {
        const route = this.fb_query_temp('xiake_route', me, '');
        if (route && route !== 'reward') return me.notify('你已经选择罚恶一途，无法再改走赏善路线。');
        this.fb_set_temp('xiake_route', 'reward', me);
        me.notify('你决定留在石破天身边，等他提出诗句疑问后前往对应石室领悟。');
    }

    punish(me: USER) {
        const route = this.fb_query_temp('xiake_route', me, '');
        if (route && route !== 'punish') return me.notify('你已经选择赏善一途，无法再改走罚恶路线。');
        this.fb_set_temp('xiake_route', 'punish', me);
        me.notify('你推门闯入内厅，罚恶守卫纷纷拔刀。');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'south' && this.fb_query_temp('xiake_route', me, '') !== 'punish') {
            return me.notify_fail('若要进入内厅，须先在石壁处明确选择罚恶路线。');
        }
    }
}
