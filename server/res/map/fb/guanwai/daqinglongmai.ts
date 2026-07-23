import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';
import { WORLD } from '../../../../core/world.js';

export default class extends ROOM {
    name = '大清龙脉';
    desc =
        "你的眼前出现一座高耸入云的大山，两侧都是峭壁，陡峭不可攀。前方有一座<CMD cmd='look men'>石门(men)</CMD>，牢牢地关着。";
    exits = { south: 'fb/guanwai/pubuxia' };

    constructor() {
        super();
        this.set_item('men', '石门', '这是一座看起来很沉重的石门。', [
            ['push', '推开', this.push_men],
        ]);
        this.add_action('longmai', null, this.longmai);
    }

    push_men(me: USER, par: string) {
        if (par !== 'men') return;
        if (!me.find_obj_bypath('sp/bj/map')) {
            return me.notify('你不知道开启石门的机关所在。');
        }
        if (me.str + me.query_prop('str') <= 50) {
            return me.notify('你使出全身力气，石门却纹丝不动。');
        }
        me.send('你依照龙脉地图找到机关，使出全力推动石门。');
        me.send_commands('longmai over', '确认进入');
        return true;
    }

    longmai(me: USER, par?: string) {
        if (par !== 'over') return;
        if (!me.find_obj_bypath('sp/bj/map')) return me.notify('你没有龙脉地图。');
        if (me.str + me.query_prop('str') <= 50) return me.notify('你的总臂力不足以推开石门。');
        const room = WORLD.getRoom('longmai/shimen');
        if (!room) return me.notify_fail('<hir>资源加载错误：龙脉-石门 不存在</hir>');
        WORLD.COMMANDS.get('cr')!.enter(me, 'over');
        if (!me.environment || me.environment === this || me.environment.is_fb()) return;
        if (!me.find_obj_bypath('sp/bj/map')) return;
        if (me.str + me.query_prop('str') <= 50) return;
        const area = room.parent;
        if (!area) return me.notify('龙脉开启失败。');
        me.enable_area(area);
        WORLD.COMMANDS.get('cr')!.enter(me, 'longmai 0 0');
    }
}
