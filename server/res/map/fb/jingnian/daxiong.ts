import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '主殿';
    desc = '大雄宝殿金身佛像俯视众生，四角天王殿门洞开，中央香炉青烟笔直升向高高穹顶。';
    exits = {
        northwest: 'fb/jingnian/tianwang3',
        northeast: 'fb/jingnian/tianwang4',
        southwest: 'fb/jingnian/tianwang2',
        southeast: 'fb/jingnian/tianwang1',
        north: 'fb/jingnian/baishi',
        south: 'fb/jingnian/dianmen',
    };
}
