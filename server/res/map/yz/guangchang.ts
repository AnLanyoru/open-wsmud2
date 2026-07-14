import { ROOM } from '../../../core/room/room.js';
import type { CHARACTER } from '../../../core/char/character.js';

export default class extends ROOM {
    name = '广场';
    desc =
        "这里是城市的正中心，一个很宽阔的广场，铺着青石地面。一些游手好闲的人在这里溜溜达达，经常有艺人在这里表演。中央有一棵<cmd cmd='look tree'>大榕树(tree)</cmd>，盘根错节，据传已有千年的树龄，是这座城市的历史见证。";
    exits = {
        east: 'yz/dongdajie1',
        west: 'yz/xidajie1',
        south: 'yz/nandajie1',
        north: 'yz/beidajie1',
    };

    constructor() {
        super();
        this.set_npc('yz/zhubanxian');
        this.set_item('tree', '大榕树', '一棵枝叶茂盛的大榕树，看来似乎可以爬上去', [
            ['climb', '爬', climb_tree],
        ]);
        this.add_action('climb tree', '爬树');
    }
}

function climb_tree(me: CHARACTER, par?: string) {
    if (par != 'tree') return me.notify('你要爬什么？');
    var leave_msg: string | undefined;
    var in_msg: string | undefined;
    if (me.gender == 1) {
        leave_msg = '$N战战兢兢的抓住树干往上爬去。';
        in_msg = '$N战战兢兢地从下面爬了上来。';
    } else if (me.per > 40) {
        leave_msg = '$N轻轻一跳，衣裙飘飘，犹如仙子般飞上大榕树。';
        in_msg = '一阵清香飞来，你定眼一看，$N已经婷婷玉立在你眼前。';
    } else {
        leave_msg = '$N战战兢兢地拉着大榕树的盘根，缓慢地往上爬去。';
        in_msg = '$N气喘嘘嘘地爬了上来。';
    }
    me.moveto('yz/tree1', leave_msg, in_msg);
}
