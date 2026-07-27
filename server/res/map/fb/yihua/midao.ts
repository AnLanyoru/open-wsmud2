import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '暗道';
    desc = '玉床后的暗道阴冷狭窄，石阶一路向下，墙缝中透出密室微弱的灯光。';
    exits = {
        north: 'fb/yihua/woshi',
        west: 'fb/yihua/midao2',
    };
}
