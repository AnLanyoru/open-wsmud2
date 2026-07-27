import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    desc = '山路绕开正门向东北盘旋，碎石间长满青苔，远处绝壁与禅院飞檐在林隙间时隐时现。';
    exits = {
        southwest: 'fb/jingnian/shanmen',
        northeast: 'fb/jingnian/shanlu_1',
    };
}
