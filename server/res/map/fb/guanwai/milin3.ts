import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '密林';
    desc = '这里的树干上留着深深的爪痕，灌木被庞然大物压倒一片。东面传来黑风口呼啸的风声。';
    exits = {
        south: 'fb/guanwai/milin2',
        east: 'fb/guanwai/heifengkou',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/xiong');
    }
}
