import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练武场';
    desc = '宽阔练武场连接五旗营地，地上刀剑痕迹纵横，四面战旗迎风招展。';
    exits = {
        north: 'fb/guangming/juyiting',
        south: 'fb/guangming/qi_houtu',
        west: 'fb/guangming/qi_ruijin',
        east: 'fb/guangming/qi_liehuo',
    };
}
