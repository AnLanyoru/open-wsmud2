import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends ROOM {
    name = '悬崖';
    desc = "最后一段悬崖直通黑木崖总坛，风雷纹<cmd cmd='look basket'>铁匣</cmd>嵌在石壁上，对岸大门依稀可见。";
    exits = {
        south: 'fb/heimu/up2',
    };

    constructor() {
        super();
        this.set_item('basket', '铁匣', '最后的机关需要风雷堂令牌才能启动。', [
            ['cross', '插入令牌', this.cross],
        ]);
    }

    cross(me: USER) {
        if (!this.fb_query_temp('heimu_fenglei', me, false)) return me.notify('你缺少风雷堂令牌。');
        if (this.fb_query_temp('diff', me, 0) === 1 && !this.fb_query_temp('heimu_hard_lords', me, false)) {
            const destination = this.query('fb/heimu/damen');
            for (const path of ['fb/heimu/shangguanyun', 'fb/heimu/jiabu', 'fb/heimu/tongbaixiong']) {
                const sourcePath = path.endsWith('shangguanyun') ? 'fb/heimu/bh_ting' : path.endsWith('jiabu') ? 'fb/heimu/ql_ting' : 'fb/heimu/fl_ting';
                const lord = this.query(sourcePath)?.find_by_path(path) as CHARACTER | undefined;
                if (destination && lord) lord.moveto(destination);
            }
            this.fb_set_temp('heimu_hard_lords', true, me);
        }
        this.add_exit('east', 'fb/heimu/damen');
        me.notify(this.fb_query_temp('diff', me, 0) === 1 ? '三枚令牌齐备，吊篮将你送到崖顶，三位堂主已在那里联手等候。' : '三枚令牌齐备，吊篮将你送到黑木崖大门前。');
    }
}
