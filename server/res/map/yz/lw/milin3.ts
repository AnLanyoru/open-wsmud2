import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";
import { UTIL } from "../../../../core/util/util.js";
import { COMMAND } from "../../../../core/command.js";

export default class extends ROOM {
    name = "密林深处";
    desc = "这里是密林的深处，楠木参天，浓阴蔽日，再往里就没有路走了，一只大狼懒洋洋的趴着，四周散落着不少乱七八糟的物件。";
    exits = { "east": "yz/lw/milin2" };

    constructor() {
        super();
        this.set_npc("yz/lw/langwang");
        this.add_action("search", "搜索", function (me) {
            if (me.query_temp("fb/lw/search")) {
                if (!WORLD.DATA.query_temp('zq4', 0) && this.is_time()) {
                    if (me.add_temp("fb/lw/search", 1) == 6) {

                        me.notify("你不死心的继续在狼窝乱翻，又找到一块破木板，上面歪歪扭扭的写了几个大字：小月月变身");
                        return;
                    }
                }
                me.notify("你已经搜索过了，该拿的都拿了，快跑吧。");

            } else {
                me.set_temp("fb/lw/search", 1);
                var items = ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/ring", "eq/lv0/tiegun", "eq/lv0/jian", "eq/lv0/jin", "eq/lv0/shoes", "eq/lv0/duanyi", "book/book#dodge"];
                var obj = me.add_obj(items.random());
                if (obj) {
                    me.notify("你四处搜了搜发现了一" + obj.unit + obj.color_name + "。");
                }
                if (this.random(3) == 1 && !WORLD.DATA.query_temp('zq8', 0) && this.is_time()) {
                    var obj = me.add_obj('res/huang');
                    if (obj) {
                        me.notify("你发现了一" + obj.unit + obj.color_name + "。");
                    }
                }

            }

        });
        this.add_action("say", "", function (me, par) {
            if (!WORLD.DATA.query_temp('zq4', 0) && this.is_time() && me.query_temp("fb/lw/search", 1) > 3) {
                var npc = this.find_obj_bypath('yz/lw/langwang');
                if (npc && par == '小月月变身') {
                    this.create_lw(me, npc, 4, '$n对着狼王大声喊道：小月月变身\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>');
                    return true;
                }
            }
            return false;
        });
        this.add_action("drop", "", function (me, count, objid) {
            var obj = me.find_obj(objid);
            if (!obj) {
                return false;
            }
            if (obj.is('food/yuebing')) {
                //3区丢月饼，变身1
                var npc = this.find_obj_bypath('yz/lw/langwang');

                if (!npc || npc.name != '狼王' || WORLD.DATA.query_temp('zq6', 0) || !this.is_time()) {
                    me.notify("这么好吃的月饼你也乱丢？");
                } else {
                    WORLD.COMMANDS['drop'].enter(me, count, objid);
                    this.create_lw(me, npc, 6, "$N看到圆滚滚的月饼，凑上来嗅了嗅，然后一口吞下...\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>");

                }
                return true;
            }
            if (obj.is('res/langpi')) {
                //2区丢狼皮，变身2

                var npc = this.find_obj_bypath('yz/lw/langwang');
                WORLD.COMMANDS['drop'].enter(me, count, objid);
                if (npc && npc.name == '狼王' && !WORLD.DATA.query_temp('zq3', 0) && this.is_time()) {

                    this.create_lw(me, npc, 3, '$N看到你丢的狼皮，发狂似的朝$p扑了过来....\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>');
                }
                return true;
            }
            return false;
        });
        this.add_action("use", "", function (me, objid, par) {
            var obj = me.find_obj(objid);
            if (!obj) {
                return false;
            }
            //1区变身
            if (obj.is('food/yuebing')) {
                var npc = this.find_obj_bypath('yz/lw/langwang');
                if (!npc && !WORLD.DATA.query_temp('zq2', 0) && this.is_time()) {
                    if (me.query_temp('langpi')) {
                        me.notify("<hib>你披着着狼皮吞下一块月饼，幽深的密林中月光淼淼，忍不住发出一阵狼嚎：嗷……呜……</hib>");
                        me.remove_obj(obj);
                        WORLD.DATA.set_temp("zq2", 1, UTIL.diff_time());
                        COMMAND.DO("rumor", "听说" + me.name + "在小树林变身狼王，获得称号【月夜之狼】。");
                        me.add_title('月夜之狼', 'zq');
                        return true;
                    }
                }
            }
            //4区刺激变身
            if (obj.is('res/langpi')) {
                var npc = this.find_obj_bypath('yz/lw/langwang');
                if (npc && !WORLD.DATA.query_temp('zq5', 0) && this.is_time()) {
                    this.create_lw(me, npc, 5, '$n拿出一块完整的狼皮挑衅的披在身上,$N顿时双眼通红咆哮着冲了过来...\n<wht>一阵烟雾过后，狼王已经消失不见，一只巨大的银色巨狼站在你面前向你咆哮...</wht>');
                }
            }
            return false;
        });
    }

    is_time() {
    let dt = new Date();
    let hour = dt.getHours();

    return dt.getFullYear() === 2024 && dt.getMonth() === 8 && (dt.getDate() >= 15 && dt.getDate() <= 17)
        && hour >= 21 && hour <= 24;
}
    is_killlang(me) {
    var rm = ROOM.Get('yz/lw/milin2').query_copy2(me);
    if (!rm) {
        return 0;
    }
    var lang = 0;
    for (var i = 0; i < rm.items.length; i++) {
        if (rm.items[i].is('yz/lw/lang')) {
            lang++;
        }
    }
    return lang;
}
    create_lw(me, npc, type, msg) {

    if (!WORLD.is_server(me)) return;
    if (!this.is_time()) return;
    if (npc.fight_type) return;

    npc.send_room(msg, me);
    npc.name = '<wht>月夜狼王<wht>';
    npc.desc = "一只巨大的银色巨狼，是森林中的狼王吃了月饼或者见到什么不该见到的东西变成的";
    var lv = me.skill_limit();
    if (me.level < 3) {
        npc.skill_map(
            ["dodge", lv],
            ["bite", lv]);
    } else {
        npc.skill_map(
            ["dodge", lv],
            ["bite", lv],
            ["boss1", lv, "bite"]);
    }
    npc.hp = npc.max_hp = me.max_hp * 2;
    npc.mp = npc.max_mp = me.max_mp;
    npc.on_die = this.on_lwdie.bind(this, me, type);
    if (me.level >= 4) {
        npc.prop = { gj: me.gj, mz: me.mz, fy: me.fy };
    }
    npc.init();
    npc.recount();
    this.item_changed(npc, false);
    this.item_changed(npc, true);
    npc.do_kill(me);
}
    on_lwdie(me, t) {
    var type = "zq" + t;
    if (WORLD.DATA.query_temp(type)) return;
    if (t % 2 === 0)
        COMMAND.DO("rumor", "听说" + me.name + "击杀了变异的狼王，获得称号【月夜之狼】。");
    else
        COMMAND.DO("rumor", "听说" + me.name + "击杀了受到刺激的狼王，获得称号【月夜之狼】。");

    me.add_title('月夜之狼', 'zq');
    me.notify('<hig>恭喜你获得称号【月夜之狼】</hig>');
    WORLD.DATA.set_temp(type, 1, UTIL.diff_time());
}
}

