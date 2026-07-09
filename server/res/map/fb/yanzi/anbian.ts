import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '岸边';
    desc =
        '你踏上了小岛的岸边，这里就是慕容世家的领地，武林中的英雄豪杰们都十分仰慕闻名天下的燕子坞，只见三面全是花的世界。落第秀才，十八学士，十三太保，八仙过海，风尘三侠等数种名贵的茶花萦绕在你的周围。';
    exits = {
        east: 'fb/yanzi/hc1',
    };
}
