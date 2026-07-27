import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小花园';
    desc = '崖顶小花园种满红梅与秋菊，东侧精致闺房灯影摇曳，隐约有人低声吟唱。';
    exits = {
        east: 'fb/heimu/guifang',
    };
}
