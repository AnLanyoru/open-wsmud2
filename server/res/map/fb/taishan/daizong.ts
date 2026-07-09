import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '岱宗坊';
    desc =
        '位于泰安县城以北约一里，此处是登泰山的入口。相传当年碧霞元君被姜子牙戏弄，诱她投掷绣花鞋以定泰山地界，结果碧霞元君只能把绣花鞋从山顶掷到此处。从此泰山便以此为起点。';
    exits = {
        north: 'fb/taishan/yitian',
    };
}
