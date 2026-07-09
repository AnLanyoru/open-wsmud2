import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'gumu';
    name = '古墓派';
    desc = '古墓派身处终南山下活死人墓中，派中多为女子';
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3900;
    pot = 3900;
    is_diffi = true;
    is_multi = false;
    drops = [
        'book/bc#yunvxinjing',
        'book/bc#yinsuojinling',
        'eq/lv4/bingpoyinzhen',
        'eq/lv4/jinlingsuo',
        'book/bc#anranxiaohun',
        'book/bc#xuantiejianfa',
        'eq/lv5/panlongzan',
        'eq/lv5/longguhuan',
    ];
    first = 'fb/gumu/gumukou';
    room_path = 'fb/gumu/';
    map = [
        { n: '古墓入口', id: 'fb/gumu/gumukou', p: [0, 0], exits: ['e'] },
        { n: '前厅', id: 'fb/gumu/qianting', p: [1, 0] },
        { n: '后堂', id: 'fb/gumu/houtang', p: [2, 0], exits: ['w', 'n', 'e'] },
        { n: '卧室', id: 'fb/gumu/woshi', p: [2, -1] },
        { n: '琴室', id: 'fb/gumu/qinshi', p: [3, 0] },
        { n: '暗河', id: 'fb/gumu/anhe', p: [4, 0] },
        { n: '峭壁', id: 'fb/gumu/qiaobi', p: [4, -1] },
        { n: '平台', id: 'fb/gumu/pingtai', p: [4, -2] },
        { n: '剑冢', id: 'fb/gumu/jianzhong', p: [5, -2] },
    ];
}
