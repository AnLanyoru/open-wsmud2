import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'baituo';
    name = '白驼山';
    desc = '西毒欧阳锋的大本营，在西域大漠深处';
    score = 100;
    is_show = true;
    is_copy = true;
    expend = 10;
    exp = 2900;
    pot = 2900;
    is_diffi = false;
    is_multi = true;
    drops = [
        'book/bc#lingshezhangfa',
        'book/bc#chanchubufa',
        'book/bc#hamagong',
        'eq/lv4/lingshezhang',
    ];
    first = 'fb/baituo/damen';
    room_path = 'fb/baituo/';
    map = [
        { n: '大门', id: 'fb/baituo/damen', p: [0, 0] },
        {
            n: '练武场',
            id: 'fb/baituo/liangong',
            p: [0, -1],
            exits: ['w', 'n', 's'],
        },
        {
            n: '长廊',
            id: 'fb/baituo/changlang',
            p: [-1, -1],
            exits: ['w', 'e', 's'],
        },
        { n: '药房', id: 'fb/baituo/yaofang', p: [-1, 0] },
        { n: '西门', id: 'fb/baituo/ximen', p: [-2, -1] },
        { n: '草丛', id: 'fb/baituo/cao1', p: [-3, -1] },
        { n: '草丛', id: 'fb/baituo/cao2', p: [-3, -2] },
        { n: '竹林', id: 'fb/baituo/zhulin', p: [-3, -3], exits: ['n'] },
        { n: '石洞', id: 'fb/baituo/dong', p: [-3, -4] },
        { n: '门廊', id: 'fb/baituo/menlang', p: [0, -2] },
        { n: '花园', id: 'fb/baituo/huayuan', p: [0, -3], exits: ['s', 'n'] },
        { n: '大厅', id: 'fb/baituo/dating', p: [0, -4] },
    ];
}
