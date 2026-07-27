import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '书房';
    desc = '书架上尽是经史术数与奇门典籍，案头摊着一幅桃林阵图，墨迹尚未完全干透。';
    exits = {
        west: 'fb/taohua/dating',
    };
}
