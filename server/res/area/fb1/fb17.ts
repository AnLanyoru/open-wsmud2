import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'songshan';
    name = '嵩山';
    desc = '中岳嵩山，也是五岳剑派嵩山派的所在地';
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2600;
    pot = 2600;
    is_diffi = false;
    is_multi = false;
    drops = [
        'book/bc#dasongyangshenzhang',
        'book/bc#songshanjianfa',
        'eq/lv3/wuyuelingqi',
        'eq/lv3/mengzhupifeng',
        'book/bc#hanbingzhenqi',
    ];
    first = 'fb/songshan/taishi';
    room_path = 'fb/songshan/';
    map = [
        { n: '太室阙', id: 'fb/songshan/taishi', p: [0, 0] },
        {
            n: '天中阁',
            id: 'fb/songshan/tianzhongge',
            p: [0, -1],
            exits: ['s', 'n'],
        },
        { n: '中岳大殿', id: 'fb/songshan/dadian', p: [0, -2] },
        {
            n: '险峻山道',
            id: 'fb/songshan/shandao',
            p: [0, -3],
            exits: ['s1d', 'ne'],
        },
        { n: '铁梁峡', id: 'fb/songshan/tieliang', p: [1, -4] },
        { n: '朝天门', id: 'fb/songshan/chaotianmen', p: [1, -5] },
        {
            n: '峻极山门',
            id: 'fb/songshan/shanmen',
            p: [1, -5],
            exits: ['s1d', 'n1d', 'w1d'],
        },
        { n: '极顶山道', id: 'fb/songshan/shandao2', p: [0, -5], exits: ['w1d'] },
        { n: '封禅台', id: 'fb/songshan/fengshantai', p: [-1, -5] },
        { n: '前庭', id: 'fb/songshan/qianting', p: [1, -6] },
        { n: '峻极禅院', id: 'fb/songshan/chanyuan', p: [1, -7] },
        { n: '中门', id: 'fb/songshan/zhongmen', p: [1, -8], exits: ['s'] },
        {
            n: '会盟堂',
            id: 'fb/songshan/huimengtang',
            p: [1, -9],
            exits: ['s', 'n', 'w', 'e'],
        },
        { n: '西廊', id: 'fb/songshan/xilang', p: [0, -9] },
        { n: '东廊', id: 'fb/songshan/donglang', p: [2, -9] },
        { n: '剑池', id: 'fb/songshan/jianchi', p: [1, -10] },
    ];
}
