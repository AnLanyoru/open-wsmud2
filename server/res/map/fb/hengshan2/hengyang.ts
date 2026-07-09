import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '衡阳城';
    desc = '这里就是衡阳县城。衡阳地处偏远，显见远不如中原繁华了。';
    exits = {
        west: 'fb/hengshan2/jiedao',
        east: 'fb/hengshan2/shanlu',
    };
}
