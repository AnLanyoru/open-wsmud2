import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '封禅台';
    desc = '古台历经风雨，石面刻满模糊铭文，站在此处可俯瞰嵩山层峦叠嶂。';
    exits = {
        eastup: 'fb/songshan/shandao2',
    };
}
