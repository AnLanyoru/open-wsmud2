import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小径';
    desc = '密道外的小径沿莲池蜿蜒，青石上覆着薄苔，四周寂静得只剩虫鸣水响。';
    exits = {
        west: 'fb/yihua/lianhuachi',
        east: 'fb/yihua/midao2',
    };
}
