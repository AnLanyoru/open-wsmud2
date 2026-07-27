import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'hengshan';
    name = '恒山';
    desc = '北岳恒山，也是五岳剑派恒山派的所在地';
    score = 100;
    is_show = true;
    is_copy = true;
    expend = 10;
    exp = 2200;
    pot = 2200;
    is_diffi = false;
    is_multi = false;
    drops = [
        'book/bc#hengshanshenfa',
        'book/bc#baiyunxinfa',
        'book/bc#hengshanjianfa',
        'book/bc#tianchangzhang',
        'book/bc#kuangfengkuaidao',
        'eq/lv3/kuangfengdao',
        'eq/lv3/tianboguangdemianzhao',
    ];
    first = 'fb/hengshan/daziling';
    room_path = 'fb/hengshan/';
    map = [
        { n: '见性峰', id: 'fb/hengshan/jianxingfeng', p: [0, 0] },
        {
            n: '白云庵',
            id: 'fb/hengshan/baiyunan',
            p: [0, -1],
            exits: ['w', 'e', 's', 'n'],
        },
        { n: '后殿', id: 'fb/hengshan/houdian', p: [0, -2] },
        { n: '东廊', id: 'fb/hengshan/donglang', p: [1, -1] },
        { n: '西廊', id: 'fb/hengshan/xilang', p: [-1, -1] },
        { n: '练功房', id: 'fb/hengshan/liangongfang', p: [1, -2], exits: ['s'] },
        { n: '斋堂', id: 'fb/hengshan/zaitang', p: [-1, -2], exits: ['s'] },
        {
            n: '北岳殿',
            id: 'fb/hengshan/beiyuedian',
            p: [-1, 0],
            exits: ['e', 's'],
        },
        { n: '山道', id: 'fb/hengshan/shandao', p: [-1, 1] },
        {
            n: '果老岭',
            id: 'fb/hengshan/guolaoling',
            p: [0, 2],
            exits: ['nw', 'n', 'se'],
        },
        { n: '通元谷', id: 'fb/hengshan/tongyuangu', p: [0, 1] },
        { n: '虎风口', id: 'fb/hengshan/hufengkou', p: [1, 3] },
        { n: '大字岭', id: 'fb/hengshan/daziling', p: [1, 4], exits: ['n'] },
    ];
}
