import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '林间小路';
    desc = '松林遮住天光，狭窄小路直通峰顶，周颠正高声喝骂来犯之人。';
    exits = {
        south: 'fb/guangming/banshanyao',
        north: 'fb/guangming/guangmingding',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/zhoudian');
    }
}
