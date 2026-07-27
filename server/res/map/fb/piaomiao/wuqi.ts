import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '蓼风轩';
    desc = '轩内兵刃架层层叠叠，刀剑在灯下泛着寒光，窗外云海翻涌不息。';
    exits = {
        west: 'fb/piaomiao/changlang',
    };
}
