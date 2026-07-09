import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'tianlong';
    name = '天龙寺';
    desc =
        '大理段家的皇家寺院，据说有一门神奇的武功六脉神剑，以指为剑，命中极高，更可隔空点穴，制敌于数米之外';
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3700;
    pot = 3700;
    is_diffi = true;
    is_multi = false;
    drops = [
        'book/bc#tiannanbu',
        'book/bc#duanjiajianfa',
        'book/bc#kumushengong',
        'book/bc#liumaishenjian',
        'eq/lv5/longgusheli',
    ];
    first = 'fb/tianlong/damen';
    room_path = 'fb/tianlong/';
    map = [
        { n: '大门', id: 'fb/tianlong/damen', p: [0, 0], exits: ['s'] },
        { n: '塔林', id: 'fb/tianlong/talin', p: [0, 1] },
        {
            n: '舍利塔',
            id: 'fb/tianlong/ta',
            p: [0, 2],
            exits: ['sw', 'se', 'n', 's'],
        },
        { n: '崇圣宝殿', id: 'fb/tianlong/baodian', p: [0, 3] },
        { n: '无乐阁', id: 'fb/tianlong/wule', p: [1, 3] },
        { n: '无我阁', id: 'fb/tianlong/wuwo', p: [-1, 3] },
        { n: '无常阁', id: 'fb/tianlong/wuchang', p: [-1, 4], exits: ['n', 'e'] },
        { n: '无净阁', id: 'fb/tianlong/wujing', p: [1, 4], exits: ['n', 'w'] },
        { n: '般若台', id: 'fb/tianlong/banruo', p: [0, 4] },
        { n: '牟尼堂', id: 'fb/tianlong/munitang', p: [0, 5], exits: ['n'] },
    ];
}
