import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '持国天王殿';
    desc = '殿中持国天王怀抱琵琶，彩塑威严怒目，琴弦在穿堂风中微颤，仿佛随时会发出雷音。';
    exits = {
        northwest: 'fb/jingnian/daxiong',
    };
}
