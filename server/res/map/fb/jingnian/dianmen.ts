import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '殿门';
    desc = '朱漆殿门紧闭，门上铜钉映着冷光，四座天王殿分列前方，香火气息中透着肃杀。';
    exits = {
        south: 'fb/jingnian/shijie',
        northup: 'fb/jingnian/daxiong',
    };
}
