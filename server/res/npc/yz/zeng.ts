import { NPC } from '../../../core/char/npc.js';
import { WORLD } from '../../../core/world.js';
import { OBJ } from '../../../core/item/obj.js';
import { UTIL } from '../../../core/util/util.js';
import DuanZaoCommand from '../../cmd/obj/duanzao.js';
import { CLOTH_TYPES } from '../../../core/custom_eq.js';

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
        this.add_action('dz', '定制衣服', function (me: any, arg) {
            WORLD.COMMANDS.get('duanzao')!.enter(me);
        });
    }

    on_duanzao(me: any, arg: string) {
        if (arg == 'ok') {
            var item = me.find_obj_bypath('st/yuanjing');
            if (!item || item.count < 10) return me.notify('曾柔微微一笑："材料不够呢，凑够了再来吧。"');

            me.notify('曾柔微笑着说道："客官来的正好！我这有衣服、鞋、帽子、披风、护手和腰带，你要哪种？"');
            const commands: string[] = [];
            for (const [key, info] of Object.entries(CLOTH_TYPES)) {
                commands.push('duanzao ' + key);
                commands.push(info.name);
            }
            commands.push('duanzao cancel');
            commands.push('我不做了');
            me.send_commands.apply(me, commands);
        } else if (!arg) {
            me.notify('曾柔柔声说道："你能找到10块<hio>元晶</hio>我就免费给你制作一件你自己的衣服。"');
            var item = me.find_obj_bypath('st/yuanjing');
            if (!item || item.count < 10) return;
            me.send_commands('duanzao ok', '我要定制成衣');
        } else if (arg === 'cancel') {
            me.notify('曾柔温婉一笑，又继续飞针走线了。');
            me.wait_input = undefined;
        } else {
            const subType = CLOTH_TYPES[arg];
            if (!subType) return me.notify('曾柔摇头道："我不会做这个！"');
            me.notify('曾柔微笑着点了点头...');
            me.notify('曾柔说道："告诉我你要定制的衣服的名字。(使用房间频道说出(2-5个汉字)，暴力，色情，政治相关的名字将直接销毁)"');
            me.wait_input = this.dzyf.bind(this, arg);
            me.send_commands('cancle', '我不定制了');
        }
    }

    dzyf(subType: string, me: any, str: string) {
        if (str == 'cancle') {
            me.notify('曾柔说道："好吧，可惜了。"');
            me.wait_input = undefined;
            return;
        }
        str = str.split(' ')[1];
        if (!subType) {
            me.wait_input = undefined;
            return me.notify('曾柔说道："你要先告诉我定制的衣服类型。"');
        }
        const typeInfo = CLOTH_TYPES[subType];
        if (!typeInfo) {
            me.wait_input = undefined;
            return me.notify('曾柔摇头道："我不会做这个！"');
        }
        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(str)) {
            return me.send('曾柔说道："衣服的名字需要是2-5个汉字。"');
        }

        if (!UTIL.check_word(str)) {
            return me.send('曾柔说道："你不能用这个名字。"');
        }

        var item = me.find_obj_bypath('st/yuanjing');
        if (!item || item.count < 10) {
            me.wait_input = undefined;
            return me.notify('曾柔说道："材料不够呢，凑够了再来吧。"');
        }
        me.wait_input = undefined;
        if (me.remove_obj(item, 10)) {
            var obj = OBJ.CREATE('eq/cp#' + subType) as any;
            obj.set_temp('name', str);

            let duanzao_command = WORLD.COMMANDS.get('duanzao') as DuanZaoCommand | undefined;
            if (!duanzao_command) {
                me.send('<hir>发生了一个错误，请联系管理员。错误详情：锻造指令未加载</hir>');
                return;
            }
            duanzao_command.default_template(obj, typeInfo.eq_type, subType);
            if (obj.on_reload) obj.on_reload(me);
            me.add_obj(obj);
            me.notify('曾柔拿起尺子给你量了量身材，然后飞针走线，不一会儿便将' + obj.unit_name() + '递给你："做好啦，拿好咯~"');
        }
    }
}
