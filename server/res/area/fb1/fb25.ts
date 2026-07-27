import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'heimu';
    name = '黑木崖';
    desc = '日月神教的总坛所在地，威震江湖的东方不败就坐镇此处，守卫众多，戒备森严。';
    score = 100;
    is_show = true;
    is_copy = true;
    expend = 10;
    exp = 3400;
    pot = 3400;
    is_diffi = true;
    is_multi = true;
    drops = [
        'eq/lv3/shangguanyundepifeng',
        'eq/lv3/tongbaixiongdejiezhi',
        'eq/lv3/yangliantingdexiangquan',
        'eq/lv3/jiabudehuyaosuo',
        'book/bc#bixiejianfa',
        'book/bc#kuihuashengong',
        'eq/lv4/dongfangbubaidexiuhuazhen',
    ];
    first = 'fb/heimu/shangu';
    room_path = 'fb/heimu/';
    map = [
        { n: '山谷', id: 'fb/heimu/shangu', p: [0, 0], exits: ['n', 's'] },
        { n: '白虎堂', id: 'fb/heimu/bh_tang', p: [0, -1] },
        { n: '走廊', id: 'fb/heimu/bh_lang', p: [0, -2], exits: ['n', 's'] },
        { n: '大厅', id: 'fb/heimu/bh_ting', p: [0, -3] },
        { n: '青龙堂', id: 'fb/heimu/ql_tang', p: [0, 1] },
        { n: '走廊', id: 'fb/heimu/ql_lang', p: [0, 2], exits: ['n', 's'] },
        { n: '大厅', id: 'fb/heimu/ql_ting', p: [0, 3] },
        {
            n: '密林',
            id: 'fb/heimu/shulin',
            p: [1, 0],
            exits: ['n', 's', 'w', 'e'],
        },
        { n: '风雷堂', id: 'fb/heimu/fl_tang', p: [1, -1] },
        { n: '走廊', id: 'fb/heimu/fl_lang', p: [1, -2], exits: ['n', 's'] },
        { n: '大厅', id: 'fb/heimu/fl_ting', p: [1, -3] },
        { n: '天香堂', id: 'fb/heimu/tx_tang', p: [1, 1] },
        { n: '悬崖', id: 'fb/heimu/up1', p: [2, 0] },
        { n: '悬崖', id: 'fb/heimu/up2', p: [2, -1], exits: ['n', 's'] },
        { n: '悬崖', id: 'fb/heimu/up3', p: [2, -2] },
        { n: '大门', id: 'fb/heimu/damen', p: [3, -2] },
        { n: '承德殿', id: 'fb/heimu/chengdedian', p: [4, -2], exits: ['w', 'e'] },
        { n: '后殿', id: 'fb/heimu/houdian', p: [5, -2] },
        { n: '密道', id: 'fb/heimu/midao1', p: [5, -1] },
        { n: '小花园', id: 'fb/heimu/huayuan', p: [5, 0], exits: ['e'] },
        { n: '闺房', id: 'fb/heimu/guifang', p: [6, 0] },
    ];
}
