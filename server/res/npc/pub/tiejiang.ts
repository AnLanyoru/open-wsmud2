import { NPC } from '../../../core/char/npc.js';
import { WORLD } from '../../../core/world.js';

export default class extends NPC {
    name = '铁匠';
    title = '铁匠铺老板';
    desc = '铁匠正用铁钳夹住一块红热的铁块放进炉中。';
    age = 33;
    max_hp = 100;
    max_mp = 100;
    per = 10;
    gender = 1;

    constructor() {
        super();
        this.set_goods(
            'eq/lv0/jian',
            'eq/lv0/dao',
            'eq/lv0/tiegun',
            'eq/lv0/tiezhang',
            'eq/lv0/fei',
            'sp/tool/chu#0',
        );
        this.add_action('unxx', '取消镶嵌', function (me, arg) {
            WORLD.COMMANDS.get('unxiangqian')!.enter(me);
        });
        this.add_action('unjl', '取消精炼', function (me, arg) {
            WORLD.COMMANDS.get('unjinglian')!.enter(me);
        });
        this.add_action('dz', '锻造武器', function (me, arg) {
            WORLD.COMMANDS.get('duanzao')!.enter(me);
        });
    }

    query_duanzao_message(stage: string, typeName?: string, itemName?: string): string {
        if (stage === 'choose') return '铁匠点头说道：嗯，不错，你想锻造什么武器？';
        if (stage === 'name') return '铁匠说道：告诉我这' + typeName + '叫什么名字，名字得是二至五个汉字。';
        if (stage === 'cancel') return '铁匠说道：好吧，可惜了。';
        if (stage === 'invalid_name') return '铁匠说道：武器的名字需要是二至五个汉字。';
        if (stage === 'forbidden_name') return '铁匠摇头道：这个名字可用不得。';
        if (stage === 'material_lack') return '铁匠说道：材料不够就别来烦我。';
        if (stage === 'bag_full') return '铁匠说道：先把你的行囊腾出地方来。';
        if (stage === 'invalid_type') return '铁匠摇头道：我不会锻造这种武器。';
        if (stage === 'failed') return '铁匠皱眉说道：这次没打成，十块元晶还你。';
        if (stage === 'success') return '铁匠点头说道：不错，这是你要的。\n铁匠给你' + itemName + '。';
        return '铁匠说道：这活我接不了。';
    }
}
