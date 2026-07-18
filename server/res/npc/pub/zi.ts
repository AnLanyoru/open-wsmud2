import { NPC } from '../../../core/char/npc.js';
import { WORLD } from '../../../core/world.js';
import { OBJ } from '../../../core/item/obj.js';
import { UTIL } from '../../../core/util.js';
import type { USER } from '../../../core/char/user.js';

export default class extends NPC {
    name = '紫老板';
    title = '鉴宝阁掌柜';
    desc =
        '一位穿着紫色锦袍的中年妇人，浑身珠光宝气，一双眼睛精光四射，显然是精通鉴赏之道。鉴宝阁内摆满了各种奇珍异宝，从首饰到项链应有尽有。';
    gender = 2;
    age = 40;
    per = 25;
    mp = 2000;
    max_mp = 2000;
    hp = 2000;
    max_hp = 2000;

    constructor() {
        super();
        this.add_action('makeac', '定制首饰', (me, arg) => {
            // todo
        });
    }

}
