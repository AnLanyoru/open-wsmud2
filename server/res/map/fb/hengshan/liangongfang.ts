import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练功房';
    desc = '房内兵器架上长剑排列整齐，地面剑痕纵横，一名恒山师太持剑严阵以待。';
    exits = {
        south: 'fb/hengshan/donglang',
    };

    constructor() {
        super();
        this.set_npc('fb/hengshan/shitai');
    }
}
