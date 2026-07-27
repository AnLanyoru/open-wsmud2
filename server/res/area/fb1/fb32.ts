import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'xiake';
    name = '侠客岛';
    desc = '一处神秘的小岛，因为神秘的石壁武功而名声大震。据说里面存有各大门派失传的武功。';
    score = 100;
    is_show = true;
    is_copy = true;
    expend = 10;
    exp = 4100;
    pot = 4100;
    is_diffi = false;
    is_multi = true;
    drops = [
        'book/bc#xuanxubu',
        'book/bc#taixuangong',
        'eq/lv5/tianlongzhurixue',
        'eq/lv5/nilinshouhuan',
    ];
    first = 'fb/xiake/shibi';
    room_path = 'fb/xiake/';
    map = [
        { n: '石壁', id: 'fb/xiake/shibi', p: [0, 0], exits: ['e', 's'] },
        { n: '岛主石门', id: 'fb/xiake/shimen', p: [1, 0] },
        { n: '内厅', id: 'fb/xiake/neiting', p: [0, 1] },
        { n: '石洞', id: 'fb/xiake/hole', p: [2, 2], exits: ['e', 's', 'n', 'w', 'nw'] },
        { n: '剑痕石室', id: 'fb/xiake/room_1', p: [3, 2] },
        { n: '掌影石室', id: 'fb/xiake/room_2', p: [2, 3] },
        { n: '身法石室', id: 'fb/xiake/room_3', p: [1, 2] },
        { n: '经脉石室', id: 'fb/xiake/room_4', p: [2, 1] },
    ];
}
