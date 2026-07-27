import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    desc = '山路在乱石间骤然下折，前方崖壁留有僧人攀援的旧痕，谷底隐约可见一片荒凉石滩。';
    exits = {
        southwest: 'fb/jingnian/shanlu_1',
        north: 'fb/jingnian/yandi',
    };
}
