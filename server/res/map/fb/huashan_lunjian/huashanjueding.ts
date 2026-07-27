import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '华山绝顶';
    desc = "这里已高过群峰，罡风卷动无边云海，一只饱经风霜的<cmd cmd='look chest'>木匣</cmd>卡在岩缝深处，隐约透出陈旧纸页。";
    exits = {
        down: 'fb/huashan_lunjian/beifeng',
    };

    constructor() {
        super();
        this.set_item('chest', '木匣', '木匣铜扣已经锈蚀，里面似乎藏着前人留下的武学手札。', [['open', '开启木匣', this.open_chest]]);
    }

    open_chest(me: USER) {
        if (this.fb_query_temp('huashan_chest', me, false)) return me.notify('木匣已经空了。');
        this.fb_set_temp('huashan_chest', true, me);
        const path = ['book/bc#duanjiajianfa', 'book/bc#quanzhenjianfa', 'book/bc#luoyingshenjian'].random();
        const obj = me.add_obj(path);
        if (obj) me.notify('你打开木匣，找到了一张' + obj.name + '。');
    }
}
