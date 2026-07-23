import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '满天星';
    desc = '山坡上长满一种细碎的白花，远远看去如同繁星落地。一只金雕停在枯树枝头，锐利的目光紧盯着来客。';
    exits = {
        west: 'fb/guanwai/ermenkan',
        southeast: 'fb/guanwai/caoguduo',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/diao');
    }
}
