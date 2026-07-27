import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '悬天石';
    desc = '巨石凌空探出绝壁，四周云涛奔涌，站在边缘便觉山风几乎将人卷走。';
    exits = {
        west: 'fb/guangming/shanpo2',
    };
}
