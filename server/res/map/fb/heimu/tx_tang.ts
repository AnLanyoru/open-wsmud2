import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '天香堂';
    desc = '天香堂内香烟缭绕，彩衣教众早已散去，只余空荡坐席和几盏长明灯。';
    exits = {
        north: 'fb/heimu/shulin',
    };
}
