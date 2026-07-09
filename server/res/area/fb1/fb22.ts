import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'binghuo';
    name = '冰火岛';
    desc = '一处无人小岛，因为一半冰山一半火山所以叫做冰火岛，据说金毛狮王谢逊就流落到这里。';
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3100;
    pot = 3100;
    is_diffi = true;
    is_multi = true;
    drops = [
        'st/xuanjing',
        'st/st_blu',
        'st/st_red',
        'st/st_yel',
        'st/st_gre',
        'st/st_red',
        'book/bc#qingfushenfa',
        'st/st_blu',
        'st/st_yel',
        'st/st_gre',
        'drug/huoyan',
        'book/bc#qishangquan',
        'eq/lv4/lihuozhu',
        'eq/lv5/tulongdao',
    ];
    first = 'fb/binghuo/haibian';
    room_path = 'fb/binghuo/';
    map = [
        { n: '海边岩石', id: 'fb/binghuo/haibian', p: [0, 0], exits: ['w', 'n'] },
        { n: '岩石路', id: 'fb/binghuo/yslu1', p: [-1, 0] },
        { n: '岩石路', id: 'fb/binghuo/yslu2', p: [-2, 0], exits: ['w', 'e'] },
        { n: '火山脚下', id: 'fb/binghuo/huoshanjiao', p: [-3, 0] },
        { n: '火山', id: 'fb/binghuo/huoshan1', p: [-4, 0], exits: ['e'] },
        { n: '丛林', id: 'fb/binghuo/conglin1', p: [0, -1] },
        { n: '丛林', id: 'fb/binghuo/conglin2', p: [0, -2], exits: ['s', 'n'] },
        { n: '石山', id: 'fb/binghuo/shishan', p: [0, -3] },
        { n: '石山', id: 'fb/binghuo/shishan2', p: [-1, -3], exits: ['e'] },
        { n: '熊洞', id: 'fb/binghuo/xiongdong', p: [0, -4] },
        { n: '小洞', id: 'fb/binghuo/xiaodong', p: [-1, -4] },
    ];
}
