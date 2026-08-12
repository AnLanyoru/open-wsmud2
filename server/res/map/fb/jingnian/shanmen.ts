import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山门';
    desc = "禅院山门前放着一尊<cmd cmd='look stone'>有缘石</cmd>，上刻“佛门静地，唯度有缘”。正门通往禅院，东北山路通往崖底。";
    exits = {
        north: 'fb/jingnian/shijie',
        northeast: 'fb/jingnian/shanlu',
    };

    constructor() {
        super();
        this.set_item('stone', '有缘石', '可反复尝试正门佛渡考验，也可选择攻略明确记载的其他路线。', [
            ['sengwang', '尝试佛渡有缘人', this.sengwang],
            ['daoshuai', '选择盗帅线', this.daoshuai],
            ['shaoshuai', '选择少帅线', this.shaoshuai],
            ['xiewang', '选择邪王线', this.xiewang],
        ]);
    }

    choose(me: USER, route: string) {
        if (this.fb_query_temp('diff', me, 0) === 1 && route !== 'sengwang') return false;
        const chosen = this.fb_query_temp('jingnian_route', me, '');
        if (chosen && chosen !== route) return false;
        this.fb_set_temp('jingnian_route', route, me);
        return true;
    }

    sengwang(me: USER) {
        if (!this.choose(me, 'sengwang')) return me.notify('你已经选择其他路线，无法中途改走僧王线。');
        const count = this.fb_query_temp('jingnian_buddha', me, 0) + 1;
        this.fb_set_temp('jingnian_buddha', count, me);
        if (count < 4) return me.notify(`你第${count}次踏入正门，佛光一卷，又将你送回山门。`);
        this.fb_set_temp('jingnian_entered', true, me);
        me.notify('第四次踏入正门时，佛渡提示终于改变，下一步可进入白石广场等候僧人调动。');
    }

    daoshuai(me: USER) {
        if (this.fb_query_temp('diff', me, 0) === 1) return me.notify('困难净念禅宗只开放僧王路线。');
        if (!this.choose(me, 'daoshuai')) return me.notify('你已经选择其他路线，无法中途改走盗帅线。');
        me.notify('你选择盗帅线，须沿东北山路下崖，击败崖底三人组后跳回禅院。');
    }

    shaoshuai(me: USER) {
        if (this.fb_query_temp('diff', me, 0) === 1) return me.notify('困难净念禅宗只开放僧王路线。');
        if (!this.choose(me, 'shaoshuai')) return me.notify('你已经选择其他路线，无法中途改走少帅线。');
        me.notify('你选择少帅线，须先进入钟楼等待黑影奔往后山，再到崖底击败寇仲并伪装。');
    }

    xiewang(me: USER) {
        if (this.fb_query_temp('diff', me, 0) === 1) return me.notify('困难净念禅宗只开放僧王路线。');
        if (!this.choose(me, 'xiewang')) return me.notify('你已经选择其他路线，无法中途改走邪王线。');
        me.notify('你选择攻略所载邪王线，须由主殿闯入白石广场，击败拦路僧人后推开铜殿。');
    }

    on_leave(me: USER, dir: string) {
        const route = this.fb_query_temp('jingnian_route', me, '');
        if (!route) return me.notify_fail('须先在有缘石前选择一条路线。');
        if (this.fb_query_temp('diff', me, 0) === 1 && route !== 'sengwang') return me.notify_fail('困难净念禅宗只允许进入僧王路线。');
        if (dir === 'northeast' && route !== 'daoshuai') return me.notify_fail('只有盗帅线可由东北山路下崖。');
        if (dir === 'north' && !this.fb_query_temp('jingnian_entered', me, false) && this.fb_query_temp('jingnian_route', me, '') === 'sengwang') {
            return me.notify_fail('佛光将你送回山门，还需完成四次正门进出考验。');
        }
    }
}
