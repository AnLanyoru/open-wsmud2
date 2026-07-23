import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山神庙';
    desc = '这座山神庙早已荒废，神像蒙着厚厚的尘土。一个面色阴沉的江湖医生守在供桌旁，怀中似乎藏着什么东西。';
    exits = {
        south: 'fb/guanwai/chuanchang',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/yanji');
    }
}
