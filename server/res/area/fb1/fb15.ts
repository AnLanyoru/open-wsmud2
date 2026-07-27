import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'hengshan2';
    name = '衡山';
    desc = '衡山派的所在地';
    score = 100;
    is_show = true;
    is_copy = true;
    expend = 10;
    exp = 2400;
    pot = 2400;
    is_diffi = false;
    is_multi = false;
    drops = [
        'eq/lv2/hs_qin',
        'eq/lv3/quyangdeqinhuan',
        'eq/lv3/liuzhengfengdejianchoupao',
        'book/bc#chuanyunzong',
        'book/bc#liuyunzhang',
        'book/bc#zhenyuejue',
        'book/bc#hengshanwushenjian',
    ];
    first = 'fb/hengshan2/hengyang';
    room_path = 'fb/hengshan2/';
    map = [
        { n: '衡阳城', id: 'fb/hengshan2/hengyang', p: [0, 0], exits: ['w'] },
        { n: '衡阳西街', id: 'fb/hengshan2/jiedao', p: [-1, 0] },
        {
            n: '刘府大门',
            id: 'fb/hengshan2/liufumen',
            p: [-1, -1],
            exits: ['s', 'n'],
        },
        { n: '刘府大院', id: 'fb/hengshan2/liufudayuan', p: [-1, -2] },
        {
            n: '刘府大厅',
            id: 'fb/hengshan2/liufudating',
            p: [-1, -3],
            exits: ['e', 's', 'w'],
        },
        { n: '东厢房', id: 'fb/hengshan2/dongxiangfang', p: [0, -3] },
        { n: '西厢房', id: 'fb/hengshan2/xixiangfang', p: [-2, -3] },
        { n: '山路', id: 'fb/hengshan2/shanlu', p: [1, 0], exits: ['w', 'se'] },
        { n: '南天门', id: 'fb/hengshan2/nantianmen', p: [2, 1] },
        { n: '狮子岩', id: 'fb/hengshan2/shiziyan', p: [2, 2] },
        { n: '望日台', id: 'fb/hengshan2/wangritai', p: [3, 2], exits: ['w', 's'] },
        { n: '祝融殿', id: 'fb/hengshan2/zhurongdian', p: [3, 3] },
        { n: '祝融峰', id: 'fb/hengshan2/zhurongfeng', p: [3, 4], exits: ['n'] },
    ];
}
