import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '青石大道';
    desc = '青石大道笔直伸向峰顶，路旁雪松挂满冰凌，云层间已能望见灵鹫宫檐角。';
    exits = {
        north: 'fb/piaomiao/damen',
        south: 'fb/piaomiao/xianchou',
    };
}
