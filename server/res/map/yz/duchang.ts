import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "赌场";
    desc = "赌桌围着黑压压的赌徒，吆喝声、惊叹声、欢呼声、咒骂声、哄笑声和噼哩啪啦的声响使你的耳朵几乎无法忍受，赌桌旁的墙上贴有一张<cmd cmd='look paper'>纸</cmd>。";
    exits = { "east": "yz/nandajie1", };
    no_fight = true;
    master: CHARACTER | null = null;
    stores = new Map<string, number>();
    rolle_handler?: ReturnType<typeof setTimeout>;

    constructor() {
        super();
        this.set_npc('pub/baodi');
        this.master = this.items[0] as CHARACTER | null;
        this.set_item("paper", "说明", "小赌怡情，大赌伤身.....");
        this.add_action("roll", "掷骰子", function (this: MapRoom, me: CHARACTER, par?: string) {
            if (!par) {
                if (!this.master) {
                    me.notify("<red>这里还没庄家，你要试着当庄家吗？</red>");
                    return me.send_commands("roll ok", '我要当庄家');
                }
                if (this.master == me) {
                    if (this.rolle_handler) return me.notify("你已经掷好了，等大家下注。");
                    par = "start";
                } else {
                    if (this.rolle_handler) return me.notify("庄家已经掷骰子了，快下注吧。");

                    for (const item of this.items) {
                        if (item.is_character) {
                            const npc = item as CHARACTER;
                            npc.do_command('roll', 'start');
                            break;
                        }
                    }
                    return;
                }
            }

            if (par == "ok") {
                if (this.master) {
                    return me.notify("<red>这里已经有庄家了，等他摇骰子吧。</red>");
                }
                this.master = me;
                me.send_room("<hig>$N现在是这里的庄家。</hig>");
                return me.send_commands("roll start", '掷骰子');
            }
            if (par == "start") {
                if (me != this.master) {
                    return me.notify("你还是等庄家先出吧。");
                }
                if (this.rolle_handler) return me.notify("你已经摇好了，等大家下注。");

                me.send_room("<mag>$N拿出一个骰盅，双手随意挥舞着，看上去颇有几分气势。</mag>\n<hic>$P" + '"啪"' + "的一声把骰盅扣在桌子上喊道：下注啦！</hic>");
                this.rolle_handler = this.call_out(this.roll_over1, 10000);
                return me.send_message('{type:"cmds",items:[{cmd:"roll b",name:"押大"},{cmd:"roll s",name:"押小"}]}');
            } else if (par == "b" || par == "s") {
                if (!this.master) return me.notify("现在没有庄家。");
                if (me == this.master) {
                    return me.notify("你是庄家压什么注。");
                }
                if (!this.rolle_handler) return me.notify("庄家还没掷骰子，别着急。");
                if (!(me.money > 1)) return me.notify(this.master.name + "瞪了你一眼：穷鬼，一边去。");
                var val = this.stores.get(me.id);
                if (val) return me.notify(this.master.name + "对你喊道：买定离手……");
                var name = par == "b" ? "大" : "小";
                me.send_room(["$N沉吟半响，拿出一个铜板沉声说道：我压" + name + "!", "$N拿着一个铜板喊道：都别动，" + me.callme() + "压" + name + "。",
                    "$N一声不吭拿出一个铜板放到【" + name + "】上面。"].random());
                this.stores.set(me.id, par == "b" ? 2 : 1);
            } else if (par == "over") {
                if (this.rolle_handler) me.notify("你需要等这局结束才可以。");
                if (this.master) {
                    this.master.send_room("<hic>$N不当庄家了，你可以点击掷骰子来当庄家。</hic>");
                    this.master = null;
                }

            }

        });
        this.add_action("say", "", function (this: MapRoom, me: CHARACTER, par?: string) {
            WORLD.COMMANDS['say'].enter(me, par ?? '');

            if (par === '我要回档') {
                for (let item of this.items) {
                    if ('query_temp' in item && typeof item.query_temp === 'function') {
                        const ch = item as CHARACTER;
                        if (ch.query_temp('admin') || ch.query_temp('wiz')) {
                            ch.send_commands('rbok ' + me.id, '同意【' + me.name + '】回档');
                        }
                    }
                }
            }

            return true;

        });
        this.add_action("rbok", "", function (this: MapRoom, me: CHARACTER, par?: string) {
            if (!par) return;
            let item = this.find_obj(par);
            if (item) {
                item.do_command('reback');
                me.send(item.name + "开始回档选项。");
            } else {
                me.send("房间没这个人。");
            }
            return true;

        });
    }

    on_leave(me: CHARACTER) {
        if (me == this.master) {
            this.master = null;
            me.send_room("由于" + me.name + "离开房间，本局作废。");
            this.stores.clear();
            if (this.rolle_handler) clearTimeout(this.rolle_handler);
            this.rolle_handler = undefined;
        }
    }
    roll_over1() {
        if (this.master) {
            this.master.send_room("$N高声喊道：来吧……赌一赌，闯王变盘古！搏一搏，云龙变成长生决！");
        }
        this.rolle_handler = this.call_out(this.roll_over, 10000);
    }
    roll_over() {
        this.rolle_handler = undefined;
        if (!this.master) return;
        if (!this.stores.size) {
            this.master.notify("没有人下注，要不要再来一局。");
            return this.master.send_commands("roll start", '掷骰子');
        }
        var num1 = this.random(6) + 1;
        var num2 = this.random(6) + 1;
        var num3 = this.random(6) + 1;
        var name = num1 + num2 + num3 > 9 ? "大" : "小";
        var res = num1 + num2 + num3 > 9 ? 2 : 1;
        this.master.send_room("<hir>$N一把掀开骰盅喊道：买定离手啦，开……" + num1 + "," + num2 + "," + num3 + "……" + name + "！！！</hir>");
        for (var i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if ('hp' in item && item.hp && item != this.master) {
                const ch = item as CHARACTER;
                var val = this.stores.get(ch.id);
                if (val) {
                    if (val == res) {
                        ch.notify("<hig>恭喜你赢了一个铜板。</hig>");
                    } else {
                        ch.notify("<red>这局你输了一个铜板。</red>");
                    }
                }
            }
        }
        this.stores.clear();
        if (this.master.is_player)
            this.master.send_commands("roll start", "再来一局", "roll over", "不当庄家了");

    }
}
