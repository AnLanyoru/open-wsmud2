import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '刘府大院';
    desc = '院中寿宴桌椅翻倒一地，宾客早已逃散，北面大厅中传来急促的叱喝与剑鸣。';
    exits = {
        south: 'fb/hengshan2/liufumen',
        north: 'fb/hengshan2/liufudating',
    };
}
