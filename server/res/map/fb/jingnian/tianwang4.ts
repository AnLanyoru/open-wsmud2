import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '多闻天王殿';
    desc = '多闻天王托着宝伞镇守殿中，穹顶绘满风雨雷云，脚步声在空旷石殿里久久回荡。';
    exits = {
        southwest: 'fb/jingnian/daxiong',
    };
}
