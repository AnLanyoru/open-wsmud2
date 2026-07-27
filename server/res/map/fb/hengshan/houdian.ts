import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '后殿';
    desc = '后殿供桌上香烟袅袅，窗外便是万丈深谷，冷风从半掩木窗不断灌入。';
    exits = {
        south: 'fb/hengshan/baiyunan',
    };
}
