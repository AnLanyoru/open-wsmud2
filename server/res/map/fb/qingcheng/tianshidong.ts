import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '天师洞';
    desc = '洞内供奉天师神像，石壁上刻满道家符箓，东下方通往山路，北面便是古龙桥。';
    exits = {
        eastdown: 'fb/qingcheng/shanlu',
        north: 'fb/qingcheng/gulongqiao',
    };
}
