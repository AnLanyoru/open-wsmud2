import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '茶园';
    desc = '层层茶垄沿山势铺开，嫩叶被晨露洗得碧绿，桃源小径从茶树间蜿蜒伸向后山隐秘石窟。';
    exits = {
        north2: 'fb/cihang/xiaolu3',
        south: 'fb/cihang/shiku',
    };
}
