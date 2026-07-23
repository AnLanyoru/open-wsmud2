import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白河';
    desc = '清冷的河水从山间流过，河边站着一名风尘仆仆的胡家仆役。北面有一间孤零零的小屋，东面则是一片幽深密林。';
    exits = {
        north: 'fb/guanwai/xiaowu',
        east: 'fb/guanwai/milin',
        west: 'fb/guanwai/caoguduo',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/asi');
    }
}
