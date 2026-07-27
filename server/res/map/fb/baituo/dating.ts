import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '大厅铺着雪白毛毡，蛇杖与毒经陈列在高台之上，四周寂静得令人心中发寒。';
    exits = {
        south: 'fb/baituo/huayuan',
    };
}
