import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '百丈涧';
    desc = '百丈深涧横断山路，雾气从谷底翻涌而上，卓不凡横剑守在唯一落脚处。';
    exits = {
        north: 'fb/piaomiao/xianchou',
        south: 'fb/piaomiao/yan',
    };

    constructor() {
        super();
        this.set_npc('fb/piaomiao/zhuobufan');
    }
}
