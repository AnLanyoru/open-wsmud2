import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    desc = '狭窄山路贴着峭壁延伸，左侧云雾深不见底，几根老藤从高处垂落，在风中不断摇摆。';
    exits = {
        southwest: 'fb/jingnian/shanlu',
        northeast: 'fb/jingnian/shanlu_2',
    };
}
