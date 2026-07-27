import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '东峰';
    desc = '朝阳从云海尽头升起，东峰松涛如潮，黄药师负手立于崖边，碧色长衫迎风猎猎作响。';
    exits = {
        west: 'fb/huashan_lunjian/tai',
    };

    constructor() {
        super();
        this.set_npc('fb/huashan_lunjian/huangyaoshi');
    }

    on_leave(me: USER) {
        if (this.find_by_path('fb/huashan_lunjian/huangyaoshi')) {
            return me.notify_fail('黄药师箫声封住退路，论剑结束前不可离开。');
        }
    }
}
