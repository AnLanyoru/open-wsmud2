import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小屋';
    desc = '屋内陈设简朴，墙边靠着一柄旧刀。一个白衣青年坐在桌旁，眉宇间英气逼人，正是人称雪山飞狐的胡斐。';
    exits = {
        south: 'fb/guanwai/baihe',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/hufei');
    }
}
