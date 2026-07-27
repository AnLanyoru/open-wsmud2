import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小院';
    desc = '小院四面封闭，温家五老早已守候在此，棍影掌风交织成一张严密罗网。';
    exits = {
        north: 'fb/wenfu/xiaolou',
    };

    constructor() {
        super();
        this.set_npc('fb/wenfu/wenlaoer');
        this.set_npc('fb/wenfu/wenlaosan');
        this.set_npc('fb/wenfu/wenlaosi');
        this.set_npc('fb/wenfu/wenlaowu');
        this.set_npc('fb/wenfu/wenlaoliu');
    }

    on_leave(me, dir) {
        if (
            dir === 'north' &&
            ['wenlaoer', 'wenlaosan', 'wenlaosi', 'wenlaowu', 'wenlaoliu'].some(id =>
                this.is_here(`fb/wenfu/${id}`),
            )
        ) {
            me.notify('温家五老联手封住了通往小楼的道路。');
            return false;
        }
    }
}
