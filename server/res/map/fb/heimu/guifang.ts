import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '闺房';
    desc = '闺房中胭脂香气浓郁，绣架上红线未断，东方不败正拈着银针回首望来。';
    exits = {
        west: 'fb/heimu/huayuan',
    };

    constructor() {
        super();
        this.set_npc('fb/heimu/dongfang');
    }
}
