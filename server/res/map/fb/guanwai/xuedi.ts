import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '雪地';
    desc = '白茫茫的雪地一直延伸到远处，凛冽的北风卷起雪粉，地上几串巨大的兽爪印通向西边。';
    exits = {
        north: 'fb/guanwai/chuanchang',
        west: 'fb/guanwai/huangdi',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/hu');
    }
}
