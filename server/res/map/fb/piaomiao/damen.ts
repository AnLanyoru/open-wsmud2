import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '独尊厅大门';
    desc = '朱红大门上铸着九天九部徽记，石阶积着薄雪，门后便是灵鹫宫独尊厅。';
    exits = {
        south: 'fb/piaomiao/dadao',
        north: 'fb/piaomiao/dating',
    };
}
