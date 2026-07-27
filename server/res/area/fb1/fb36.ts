import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'zhanshen';
    name = '战神殿';
    desc =
        '一处神秘的宫殿，据说入口会随着时间而变动，里面隐藏着武道极致的奥秘，得之更能触及天地之秘。';
    score = 100;
    is_show = true;
    is_copy = true;
    expend = 10;
    exp = 4500;
    pot = 4500;
    is_diffi = true;
    is_multi = false;
    ss_title = '<ord>武神</ord>';
    drops = [
        'eq/lv5/molongzhanjia',
        'eq/lv5/jinbiguguan',
        'eq/lv5/mufengyuxue',
        'eq/lv5/huonidoupeng',
        'st/shenqisuipian',
        'book/bc#zhanshentulu',
    ];
    first = 'fb/official/zhanshen/tiemen';
    room_path = 'fb/official/zhanshen/';
    map = [
        { n: '玄铁门', id: 'fb/official/zhanshen/tiemen', p: [0, 0] },
        { n: '幽深甬道', id: 'fb/official/zhanshen/yongdao', p: [-1, 0] },
        { n: '神石广场', id: 'fb/official/zhanshen/shenshi', p: [-2, 0] },
        { n: '守卫前殿', id: 'fb/official/zhanshen/shouwei1', p: [-1, 1] },
        { n: '守卫后殿', id: 'fb/official/zhanshen/shouwei2', p: [0, 1] },
        { n: '战神大殿', id: 'fb/official/zhanshen/dadian', p: [1, 1], exits: ['w', 'e'] },
        { n: '刀皇殿', id: 'fb/official/zhanshen/daohuang', p: [2, 1] },
        { n: '天外石阶', id: 'fb/official/zhanshen/shijie', p: [1, 2] },
        { n: '悬空神石', id: 'fb/official/zhanshen/xuankong', p: [1, 3] },
        { n: '九重天', id: 'fb/official/zhanshen/jiuchongtian', p: [1, 4] },
    ];
}
