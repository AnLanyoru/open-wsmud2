import { NPC } from '../../../core/char/npc.js';
import { WORLD } from '../../../core/world.js';
import { OBJ } from '../../../core/item/obj.js';
import { UTIL } from '../../../core/util.js';
import {
    JEWEL_TYPES,
    TYPE_TO_EQTYPE,
    setCustomEqData,
    type CustomEqData,
} from '../../../core/custom_eq.js';
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
            this.on_makeac(me as USER, arg);
        });
    }

    on_makeac(me: USER, arg: string) {
        if (arg == 'ok') {
            var item = me.find_obj_bypath('st/yuanjing');
            if (!item || item.count < 10) return me.notify('紫老板说道：元晶不够的话，我可没法给你做。');

            me.notify('紫老板笑吟吟地说道：你想定制什么首饰？');
            const cmds: string[] = [];
            for (const key in JEWEL_TYPES) {
                const info = JEWEL_TYPES[key];
                cmds.push(`makeac ${key}`);
                cmds.push(info.name);
            }
            me.send_commands(...cmds);
        } else if (!arg) {
            me.notify('紫老板说道：你能找到10块<hio>元晶</hio>我就免费给你打造一件你自己的首饰。');
            var item = me.find_obj_bypath('st/yuanjing');
            if (!item || item.count < 10) return;
            me.send_commands('makeac ok', '我要定制首饰(橙)');
        } else {
            const info = JEWEL_TYPES[arg];
            const eq_type = TYPE_TO_EQTYPE[arg];
            if (!info || eq_type === undefined) return me.notify('紫老板摇头道：我不会做这种首饰。');
            me.notify(
                '紫老板说道：告诉我你要定制的首饰的名字。(使用房间频道说出(2-5个汉字)，暴力，色情，政治相关的名字将直接销毁)',
            );
            me.wait_input = this.makeac.bind(this, arg);
            me.send_commands('cancle', '我不做了');
        }
    }

    makeac(arg: string, me: USER, str: string) {
        if (str == 'cancle') {
            me.notify('紫老板说道：好说，以后想做了再来找我。');
            me.wait_input = undefined;
            return;
        }
        str = str.split(' ')[1] || str;
        if (!arg) {
            me.wait_input = undefined;
            return me.notify('紫老板说道：你要先告诉我做什么首饰。');
        }
        const info = JEWEL_TYPES[arg];
        const eq_type = TYPE_TO_EQTYPE[arg];
        if (!info || eq_type === undefined) {
            me.wait_input = undefined;
            return me.notify('紫老板摇头道：我不会做这种首饰。');
        }
        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(str)) {
            return me.send('紫老板说道：首饰的名字需要是2-5个汉字。');
        }
        if (!UTIL.check_word(str)) {
            return me.send('紫老板说道：你不能用这个名字。');
        }

        var item = me.find_obj_bypath('st/yuanjing');
        if (!item || item.count < 10) {
            me.wait_input = undefined;
            return me.notify('紫老板说道：元晶不够的话，我可没法给你做。');
        }
        me.wait_input = undefined;
        if (me.remove_obj(item, 10)) {
            var obj = OBJ.CREATE('eq/cp#' + arg) as any;

            const data: CustomEqData = {
                owner_name: me.name,
                custom_name: str,
                eq_type: eq_type,
                sub_type: arg,
                refine_count: 0,
                props: [],
            };
            setCustomEqData(obj, data);
            obj.setupActions(me);

            if (obj.on_reload) obj.on_reload(me);
            me.add_obj(obj);
            me.notify('紫老板笑道：不错，这是你要的宝贝。');
            me.notify('紫老板给你' + obj.unit_name() + '。');
        }
    }
}
