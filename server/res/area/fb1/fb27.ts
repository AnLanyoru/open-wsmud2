import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'guangming';
    name = '光明顶';
    desc = '明教总坛所在地。';
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3600;
    pot = 3600;
    is_diffi = false;
    is_multi = true;
    drops = [
        'book/bc#shenghuoshengong',
        'book/bc#qingfushenfa',
        'book/bc#yingzhuagong',
        'book/bc#shenghuojianfa',
        'eq/lv4/shenghuoling',
        'eq/lv4/zhouzhiruodeshouzhuo',
        'eq/lv4/yangbuhuidexianglian',
        'eq/lv4/zhaomindejiezhi',
        'eq/lv4/weiyixiaodetaomingxie',
        'book/bc#jiuyangshengong',
        'book/bc#qiankundanuoyi',
        'eq/lv5/yitianjian',
    ];
    first = 'fb/guangming/shanmen';
    room_path = 'fb/guangming/';
    map = [
        { n: '山门', id: 'fb/guangming/shanmen', p: [2, 5] },
        { n: '栈道', id: 'fb/guangming/zhandao', p: [2, 4], exits: ['w', 's'] },
        { n: '山路', id: 'fb/guangming/shanlu', p: [1, 4] },
        { n: '半山亭', id: 'fb/guangming/banshanting', p: [0, 3], exits: ['se'] },
        {
            n: '半山腰',
            id: 'fb/guangming/banshanyao',
            p: [0, 2],
            exits: ['n', 's', 'e'],
        },
        { n: '山坡', id: 'fb/guangming/shanpo1', p: [1, 2] },
        { n: '山坡', id: 'fb/guangming/shanpo2', p: [2, 2], exits: ['w', 'e'] },
        { n: '悬天石', id: 'fb/guangming/xuantianshi', p: [3, 2] },
        { n: '林间小路', id: 'fb/guangming/xiaolu1', p: [0, 1] },
        {
            n: '光明顶',
            id: 'fb/guangming/guangmingding',
            p: [0, 0],
            exits: ['n', 's'],
        },
        { n: '厚土旗', id: 'fb/guangming/qi_houtu', p: [0, -1] },
        {
            n: '洪水旗',
            id: 'fb/guangming/qi_hongshui',
            p: [1, -1],
            exits: ['w', 'e'],
        },
        {
            n: '烈火期',
            id: 'fb/guangming/qi_liehuo',
            p: [1, -2],
            exits: ['s', 'w', 'e'],
        },
        { n: '锐金旗', id: 'fb/guangming/qi_ruijin', p: [-1, -2] },
        { n: '巨木旗', id: 'fb/guangming/qi_jumu', p: [-1, -1], exits: ['n', 'e'] },
        {
            n: '练武场',
            id: 'fb/guangming/lianwu',
            p: [0, -2],
            exits: ['n', 's', 'w', 'e'],
        },
        { n: '山崖', id: 'fb/guangming/shanya', p: [2, -1] },
        { n: '断崖', id: 'fb/guangming/duanya', p: [2, -2] },
        { n: '聚议厅', id: 'fb/guangming/juyiting', p: [0, -3] },
        {
            n: '圣火堂',
            id: 'fb/guangming/shenghuotang',
            p: [0, -4],
            exits: ['s', 'w'],
        },
        { n: '小厅', id: 'fb/guangming/xiaoting', p: [-1, -4] },
        {
            n: '后院',
            id: 'fb/guangming/houyuan',
            p: [-1, -5],
            exits: ['n', 's', 'w'],
        },
        { n: '西厢', id: 'fb/guangming/xixiang', p: [-2, -5] },
        { n: '北厢', id: 'fb/guangming/bexiang', p: [-1, -6] },
    ];
}
