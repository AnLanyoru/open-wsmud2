import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '山谷';
    desc =
        '这里是一处山谷，上面种植着草坪。南下是『日月神教』的青龙堂。北面是白虎堂，东面是个树林，据说『日月神教』总部就在那里面。';
    exits = {
        north: 'fb/heimu/bh_tang',
        south: 'fb/heimu/ql_tang',
        east: 'fb/heimu/shulin',
    };
    difficulty = 0;

    on_set_difficulty = (type: number) => {
        this.difficulty = type;
    };

    on_enter(me: USER) {
        if (!me.is_player || this.difficulty !== 1 || this.fb_query_temp('heimu_hard_tokens', me, false)) return;
        this.fb_set_temp('heimu_hard_tokens', true, me);
        this.fb_set_temp('heimu_baihu', true, me);
        this.fb_set_temp('heimu_qinglong', true, me);
        this.fb_set_temp('heimu_fenglei', true, me);
        me.notify('你带着普通黑木崖取得的三堂令牌进入困难路线，可直接前往悬崖。');
    }

    on_leave(me: USER, dir: string) {
        if (this.difficulty === 1 && (dir === 'north' || dir === 'south')) return me.notify_fail('困难模式的三位堂主已撤往崖顶，须持三枚令牌上崖迎战。');
    }
}
