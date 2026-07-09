import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'taohua';
    name = '桃花岛';
    desc = '此处名为桃花岛，乃是天下“五绝”之一“东邪”黄药师的隐居之所。';
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2800;
    pot = 2800;
    is_diffi = true;
    is_multi = false;
    drops = [
        'book/bc#jinyangong',
        'book/bc#biboshengong',
        'book/bc#anyingfuxiang',
        'book/bc#luoyingshenjian',
        'book/bc#tanzhishengong',
        'book/bc#kongmingquan',
        'eq/lv4/yuxiao',
        'eq/lv4/ruanweijia',
    ];
    first = 'fb/taohua/haitan';
    room_path = 'fb/taohua/';
    map = [
        { n: '海滩', id: 'fb/taohua/haitan', p: [0, 0] },
        { n: '桃花林', id: 'fb/taohua/taohualin', p: [0, 1] },
        { n: '桃林出口', id: 'fb/taohua/taolinchukou', p: [0, 2] },
        { n: '小路', id: 'fb/taohua/xiaolu', p: [0, 3], exits: ['s', 'n'] },
        { n: '试剑亭', id: 'fb/taohua/shijianting', p: [0, 4] },
        { n: '大门', id: 'fb/taohua/damen', p: [1, 4], exits: ['w', 'e'] },
        { n: '前院', id: 'fb/taohua/qianyuan', p: [2, 4] },
        { n: '大厅', id: 'fb/taohua/dating', p: [3, 4], exits: ['w', 'n', 'e'] },
        { n: '书房', id: 'fb/taohua/shufang', p: [4, 4] },
        { n: '卧室', id: 'fb/taohua/woshi', p: [3, 3] },
    ];
}
