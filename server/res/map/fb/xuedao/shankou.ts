import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山口';
    desc =
        '这里群山环绕，四周积雪终年不化。冰天雪地，寒风刺骨。如果不是内力高深的人，已然经受不住冻了；前方血刀弟子正守着入谷山路。';
    exits = {
        south: 'fb/xuedao/shangu',
    };

    constructor() {
        super();
        this.set_npc('fb/xuedao/dizi');
    }
}
