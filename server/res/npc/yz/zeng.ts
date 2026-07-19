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

    query_duanzao_message(stage: string, typeName?: string, itemName?: string): string {
        if (stage === 'choose') return '曾柔柔声说道：你想定制哪一件衣物？';
        if (stage === 'name') return '曾柔说道：请为这' + typeName + '取个名字，要二至五个汉字。';
        if (stage === 'cancel') return '曾柔轻声说道：没关系，等你想好再来。';
        if (stage === 'invalid_name') return '曾柔说道：名字要用二至五个汉字才好。';
        if (stage === 'forbidden_name') return '曾柔摇头说道：这个名字不太合适，换一个吧。';
        if (stage === 'material_lack') return '曾柔说道：定制衣物需要十块<hio>元晶</hio>，你的材料还不够。';
        if (stage === 'bag_full') return '曾柔说道：你的行囊已经满了，先腾出些地方吧。';
        if (stage === 'invalid_type') return '曾柔说道：这种东西不是成衣铺能做的。';
        if (stage === 'failed') return '曾柔歉然说道：这次没能做好，十块元晶还给你。';
        if (stage === 'success') return '曾柔微笑说道：已经做好了，你看看是否合身。\n曾柔给你' + itemName + '。';
        return '曾柔说道：这件东西我做不了。';
    }
}
