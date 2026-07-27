import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '果老岭';
    desc = '岭上怪石嶙峋，相传张果老曾倒骑毛驴经过此地，三条山径在云雾中分开。';
    exits = {
        northwest: 'fb/hengshan/shandao',
        north: 'fb/hengshan/tongyuangu',
        southeast: 'fb/hengshan/hufengkou',
    };
}
