import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西厢房';
    desc = '房中陈设素雅，桌上茶水尚温，主人却已匆忙离去，只余帘幕随风轻摆。';
    exits = {
        east: 'fb/hengshan2/liufudating',
    };
}
