import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '平台';
    desc =
        "狭窄平台悬在绝壁中央，一块<cmd cmd='look stone'>松动巨石</cmd>正对暗河，东侧石门后剑气隐隐透出。";
    exits = {
        down: 'fb/gumu/qiaobi',
    };

    constructor() {
        super();
        this.set_item('stone', '巨石', '巨石下方有明显撬动痕迹，似乎能引来暗河另一端的人。', [
            ['gumu_stone', '推动巨石', this.pushStone],
            ['gumu_ready', '我准备好了', this.ready],
        ]);
    }

    pushStone(me: USER) {
        if (!this.fb_query_temp('gumu_yangguo', me, false))
            return me.notify('你尚未制住杨过，贸然推动巨石不会有任何作用。');
        if (this.fb_query_temp('gumu_stone', me, false))
            return me.notify('杨过已经来到暗河对岸，正等你准备接下海潮掌力。');
        this.fb_set_temp('gumu_stone', true, me);
        me.notify('巨石滚入暗河，杨过循声赶到对岸，示意你准备好后接他一记海潮掌力。');
    }

    ready(me: USER) {
        if (!this.fb_query_temp('gumu_stone', me, false))
            return me.notify('你需要先推动巨石引杨过前来。');
        if (!this.fb_query_temp('gumu_wave', me, false)) {
            this.fb_set_temp('gumu_wave', true, me);
            me.add_hp(-Math.max(1, Math.floor(me.max_hp / 2)));
            me.notify('杨过隔空击出海潮般的掌力，你硬受一击，气血损失一半。');
        }
        this.add_exit('east', 'fb/gumu/jianzhong');
        me.notify('掌力震开东侧石门，尘封已久的剑冢终于显露出来。');
    }
}
