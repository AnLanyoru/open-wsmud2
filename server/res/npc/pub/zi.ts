import { NPC } from '../../../core/char/npc.js';
import { WORLD } from '../../../core/world.js';
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
        this.add_action('makeac', '我要定制首饰或暗器', (me: USER): void => {
            WORLD.COMMANDS.get('duanzao')?.enter(me, 'accessory');
        });
    }

    query_duanzao_message(stage: string, typeName?: string, itemName?: string): string {
        if (stage === 'choose') return '紫老板笑吟吟地说道：客官眼光不错，想定制哪样宝贝？';
        if (stage === 'name') return '紫老板说道：这' + typeName + '总得有个雅名，二至五个汉字便好。';
        if (stage === 'cancel') return '紫老板淡淡说道：无妨，客官想好了再来。';
        if (stage === 'invalid_name') return '紫老板摇头说道：名字须得是二至五个汉字。';
        if (stage === 'forbidden_name') return '紫老板皱眉说道：这样的名字，可配不上我鉴宝阁的东西。';
        if (stage === 'material_lack') return '紫老板说道：没有十块<hio>元晶</hio>，这笔买卖可做不得。';
        if (stage === 'bag_full') return '紫老板说道：客官的行囊都满了，宝贝做好又往哪里放？';
        if (stage === 'invalid_type') return '紫老板说道：这东西不归我鉴宝阁定制。';
        if (stage === 'failed') return '紫老板说道：今日火候不巧，十块元晶原数奉还。';
        if (stage === 'success') return '紫老板端详片刻，笑道：果然是件好东西，客官收好。\n紫老板给你' + itemName + '。';
        return '紫老板说道：这笔买卖做不得。';
    }
}
