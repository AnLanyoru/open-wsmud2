import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '聚议厅';
    desc = '厅内长案倾倒，明教议事席位环列四周，北面圣火堂透出赤红光芒。';
    exits = {
        south: 'fb/guangming/lianwu',
        north: 'fb/guangming/shenghuotang',
    };
}
