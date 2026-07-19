import { NPC } from '../../../core/char/npc.js';
import { WORLD } from '../../../core/world.js';
import type { USER } from '../../../core/char/user.js';

export default class extends NPC {
    name = '曾柔';
    desc =
        '她是韦爵爷不知道第几房的小妾，在这里开个成衣铺，卖些不知道哪来的衣服。有人说那都是韦爵爷从宫中弄出来的禁品。话这么说，生意照样红活。';
    gender = 2;
    age = 25;
    per = 39;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.add_action('dz', '我要定制成衣', function (me: USER): void {
            WORLD.COMMANDS.get('duanzao')?.enter(me, 'clothing');
        });
    }
}
