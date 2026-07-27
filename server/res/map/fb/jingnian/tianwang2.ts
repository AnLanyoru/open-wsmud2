import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '增长天王殿';
    desc = '增长天王手执宝剑立于彩云之上，殿内剑气般的冷风盘旋不散，石砖留着深浅剑痕。';
    exits = {
        northeast: 'fb/jingnian/daxiong',
    };
}
