import { TASK } from "../../os/task/task.js";

export default class extends TASK {
    id = "xiangyang";
    is_start = false;
    guards = [];
    boss = null;
    guard = null;
    allow_commands = {
    bm: true,
    reward: true,
    juanxian: true
};
    step = 0;
    count = 0;
    create_index = 0;
    gate_states = [
    { step: 0, bing: [], dir: "north", enter: "xiangyang/northgate2", name: "北门", wall_count: 0, wall_index: [4, 5, 6, 7, 8, 9, 10, 11] },
    { step: 0, bing: [], dir: "west", enter: "xiangyang/westgate2", name: "西门", wall_count: 0, wall_index: [11, 1, 2, 13, 14, 15, 16, 17, 18] },
    { step: 0, bing: [], dir: "south", enter: "xiangyang/southgate2", name: "南门", wall_count: 0, wall_index: [18, 19, 20, 21, 22, 23, 24, 25] },
    { step: 0, bing: [], dir: "east", enter: "xiangyang/eastgate2", name: "东门", wall_count: 0, wall_index: [25, 26, 27, 28, 1, 2, 3, 4] }
];

    startup() {
    if (this.start_handler) clearTimeout(this.start_handler);
    var date = new Date();
    var week = date.getDay();
    this.xy_area = AREA.Get('xiangyang');
    var next_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (week > 0 ? (7 - week) : 0), 20, 30);
    if (next_date < date) next_date = new Date(next_date.getFullYear(), next_date.getMonth(), next_date.getDate() + 7, 20, 30);

    this.next_date = next_date;
    //this.start_handler = this.call_out(this.run, next_date - date + 10);
}
    can_battle() {
    return Date.now() > 1756674000000;
}
    on_mihan() {
    if (!this.can_battle()) return;
    COMMAND.DO("rumor", "听说郭大侠收到线报蒙古大军近日将会进攻襄阳！");
    WORLD.DATA.set_temp("xy_status", 1);
    this.xy_area.notify_update();
    this.call_out(this.run, 300000);
}
    clear_player() {
    let msg =
        JSON.stringify({
            type: "msg", ch: "chat",
            content: "襄阳战事将起，无关人士请即刻离开。", lv: (3), name: "指挥使"
        });
    for (var i = 0; i < WORLD.USERS.length; i++) {
        if (!WORLD.USERS[i].query_setting("off_chat"))
            WORLD.USERS[i].send(msg);
    }
    let area = this.xy_area;
    for (let room of area.rooms) {
        for (let i = 0; i < room.items.length; i++) {
            let item = room.items[i];
            if (!item.is_player) continue;
            if (item.query_temp('xy_bm'))
                continue;
            if (item.moveto('yz/beimen') !== 'false') {
                item.send('<yel>你离开襄阳一路赶到扬州。</yel>');
                i--;
            }
        }
    }
}
    stop() {
    if (this.start_handler) clearTimeout(this.start_handler);

    if (this.check_handler) clearTimeout(this.check_handler);
}
    run() {
    this.start_handler = null;
    if (this.is_start) return;
    var index = WORLD.DATA.add_temp("xiangyang", 1) + 20;
    COMMAND.DO("sys", "武神历" + UTIL.to_c(index) + "年蒙古大军挥军南下，襄阳城告急！");

    this.clear_player();
    this.guards.length = 0;
    this.step = 0;
    this.count = 0;
    this.is_start = true;
    this.create_guards();
    this.call_out(this.create_enemy, 10000);
}
    create_guards() {
    this.guard = ROOM.Get("xiangyang/guangchang").find_obj_bypath("xiangyang/guo");
    if (!this.guard) {
        this.guard = NPC.CLONE("xiangyang/guo");
        ROOM.Get("xiangyang/guangchang").item_changed(this.guard, true);
    }

    this.guard.on_die = this.on_guard_die.bind(this, this.guard);
    this.guard.on_enter = this.check_enemy;

    var rooms = ["xiangyang/eastjie", "xiangyang/westjie", "xiangyang/northjie", "xiangyang/southjie"];
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < rooms.length; j++) {
            var npc = NPC.CLONE("xiangyang/shouwei" + i);
            npc.name = UTIL.random_name(1);
            npc.on_enter = this.check_enemy;
            npc.is_dasong = true;
            var rm = ROOM.Get(rooms[j] + i.toString());
            npc.on_die = this.on_guard_die.bind(this, npc);

            rm.item_changed(npc, true);
            this.guards.push(npc);
        }
    }
    rooms = ["xiangyang/northgate", "xiangyang/westgate", "xiangyang/southgate", "xiangyang/eastgate"];
    for (var i = 1; i < 3; i++) {
        for (var j = 0; j < rooms.length; j++) {
            for (var k = 0; k < i + 1; k++) {
                var npc = NPC.CLONE("xiangyang/shouwei" + (3 + i));

                npc.name = UTIL.random_name(1);
                var rm = ROOM.Get(rooms[j] + i.toString());
                npc.on_enter = this.check_enemy;
                npc.is_dasong = true;
                npc.on_die = this.on_guard_die.bind(this, npc);

                rm.item_changed(npc, true);
                this.guards.push(npc);
            }
        }
    }
}
    create_enemy(par) {
    if (!this.is_start) return;
    this.create_handler = null;

    for (var i = 0; i < this.gate_states.length; i++) {
        var gate = this.gate_states[i];
        if (!gate.enter_room) {
            gate.enter_room = ROOM.Get(gate.enter);
        }
        if (!gate.enter_room) continue;
        this.create_index = i;
        var func = this["create_enemy" + this.step];
        func && func.call(this, gate);
        if (gate.step > 1) {

            if (!gate.walls) {
                gate.walls = [];
                for (var j = 0; j < gate.wall_index.length; j++) {
                    gate.walls.push(ROOM.Get("xiangyang/walle" + gate.wall_index[j]));
                }
            }
            for (var j = gate.wall_count; j < 10 + gate.step; j++) {
                this.create_one(5, gate.walls.random(), true);
            }
            gate.wall_count = 10 + gate.step;
        }
    }
    this.count++;
    if (this.step < 6 && this.count == 10) {
        this.count = 0;
        this.step++;
        for (var i = 0; i < this.gate_states.length; i++) {
            var gate = this.gate_states[i];
            if (gate.boss) {
                gate.bing.push(gate.boss);
                gate.boss = null;
            }
        }
    }
    if (this.step == 6 && !this.boss) {
        //第六波出蒙哥
        this.show_boss();
    } else {
        this.create_handler = this.call_out(this.create_enemy, 30000);
    }

}
    create_enemy0(par) {
    for (var i = par.bing.length; i < 5; i++) {
        par.bing.push(this.create_one(5, par.enter_room));
    }
}
    create_enemy1(par) {
    if (!par.boss) {
        par.boss = this.create_one(4, par.enter_room);
    }
    for (var i = par.bing.length; i < 4; i++) {
        par.bing.push(this.create_one(5, par.enter_room));
    }
}
    create_enemy2(par) {
    if (!par.boss) {
        par.boss = this.create_one(3, par.enter_room);
    }
    for (var i = par.bing.length; i < 4; i++) {
        par.bing.push(this.create_one(i == 3 ? 4 : 5, par.enter_room));
    }
}
    create_enemy3(par) {
    if (!par.boss) {
        par.boss = this.create_one(2, par.enter_room);
    }
    for (var i = par.bing.length; i < 4; i++) {
        par.bing.push(this.create_one(i == 3 ? 3 : 4, par.enter_room));
    }
}
    create_enemy4(par) {
    if (!par.boss) {
        par.boss = this.create_one(1, par.enter_room);
    }
    for (var i = par.bing.length; i < 4; i++) {
        par.bing.push(this.create_one(i == 0 ? 2 : 4, par.enter_room));
    }
}
    create_enemy5(par) {
    if (!par.boss) {
        par.boss = this.create_one(1, par.enter_room);
    }
    for (var i = par.bing.length; i < 4; i++) {
        par.bing.push(this.create_one(i < 2 ? 2 : 3, par.enter_room));
    }
}
    create_one(index, rm, iswall) {
    var npc = NPC.CLONE("xiangyang/menggu" + index);
    npc.name = this.create_mgname();
    npc.diff_level = 5 - index;
    // if (index < 4) npc.record_damage = true;
    // else {

    // }
    npc.record_damage = true;
    npc.gate_index = this.create_index;
    npc.iswall = iswall;
    if (!iswall) {
        npc.on_heart_beat = this.check_move.bind(this, npc);
    }
    npc.on_die = this.on_bing_die.bind(this, npc);
    npc.on_died = this.on_bing_died;
    npc.on_enter = this.check_enemy2;
    npc.per = npc.random(40) + 1;

    npc.is_menggubing = true;
    rm.item_changed(npc, true, "一个" + npc.title + "冲了过来。");
    var item = rm.items.random();
    if (item && item.is_player) {
        npc.do_kill(item);
    }
    return npc;
}
    create_mgname() {
    var str = ["完颜", "纥石烈", "兀颜", "纳兰", "阿迭"].random();
    str += UTIL.name2[parseInt(Math.random() * UTIL.name2.length)];
    if (this.random(4) == 1) {
        str += UTIL.name2[parseInt(Math.random() * UTIL.name2.length)];
    }
    return str;
}
    check_enemy(me) {
    if (me.is_menggubing) {
        this.do_kill(me);
    }
}
    check_enemy2(me) {
    if (!this.fight_type && me.is_player) {
        this.do_kill(me);
    }
}
    on_guard_die(npc, killer, corpse) {
    if (killer.is_player) {
        // var count = [1, 2, 3, 4, 5, 5][5 - parseInt(npc.path.replace('xiangyang/shouwei', ''))];
        // if (count > 0) {
        //     killer.add_temp('jg_week', -count, UTIL.diff_week_time());
        //     killer.add_temp('jg', -count);
        //     killer.notify('<red>你击杀了襄阳守军，军功减少' + count + '。</red>');
        // }
        killer.add_temp('jg', -1);
        killer.notify('<red>你击杀了襄阳守军，军功减少1。</red>');
    }
    if (npc == this.guard) {
        this.finish(0);
        return;
    }
    this.guards.remove(npc);
    var rm = npc.environment;
    for (var i = 0; i < rm.items.length; i++) {
        if (rm.items[i] != npc && rm.items[i].path == npc.path) return;
    }
    var isover = true;
    for (var i = 0; i < this.gate_states.length; i++) {
        var gate = this.gate_states[i];
        if (rm.path.indexOf(gate.dir) > -1) {
            gate.step++;
            if (gate.step == 2) {
                this.send_message("襄阳城告急，" + gate.name + "被攻破，望各路英雄鼎力相助！");
            }
            if (gate.step == 5 && !this.boss) {
                this.show_boss(gate);
            }
        }
    }
}
    show_boss(gate) {
    if (this.boss) return;
    if (gate)
        this.send_message("襄阳城" + gate.name + "被攻破，蒙古各路大军长驱直入，蒙古大汗蒙哥出现在战场中央。");
    else
        this.send_message("蒙古各路大军长驱直入，蒙古大汗蒙哥出现在战场中央。");
    var npc = NPC.CLONE("xiangyang/ge");
    this.boss = npc;
    this.boss.add_status({
        id: "boss",
        name: "号令",
        prop: {
            gj_per: 2,
            fy_per: 5,
            ds_per: 5,
            mz_per: 5,
            zj_per: 5
        },
        no_clear: true,
        override: 1,
        count: this.query_enemycount(),
        max_count: 100,
        duration: 0,
        desc: "增加你的属性"
    });
    npc.is_menggubing = true;
    npc.diff_level = 5;
    this.step = 6;
    if (this.create_handler) clearTimeout(this.create_handler);
    npc.on_die = this.on_bing_die.bind(this, npc);
    npc.on_died = this.on_bing_died;

    ROOM.Get("xiangyang/guangchang").item_changed(npc, true, npc.name + "出现了。");
    this.check_handler = this.call_out(this.finish.bind(this, 2), 600000);
}
    query_enemycount() {
    var sum = 0;
    for (var i = 0; i < this.gate_states.length; i++) {
        var gate = this.gate_states[i];
        sum += gate.bing.length;
        sum += gate.wall_count;
        if (gate.boss) sum++;
    }
    return sum;
}
    on_bing_die(npc, killer) {
    if (!this.is_start) return;
    if (npc == this.boss) {
        this.finish(1);
        return;
    }
    if (this.boss) {
        this.boss.remove_status("boss");
    }
    var gate = this.gate_states[npc.gate_index];
    if (npc.iswall) {
        gate.wall_count--;
        return;
    }
    if (!gate) return;
    if (npc == gate.boss) {
        gate.boss = null;
    } else {
        gate.bing.remove(npc);
    }

}
    check_move(npc) {
    if (npc.environment.is("xiangyang/guangchang")) return;
    for (var i = 0; i < npc.environment.items.length; i++) {
        if (npc.environment.items[i].is_dasong) return;
    }
    switch (npc.gate_index) {
        case 0:
            npc.do_command("go", "south");
            break;
        case 1:
            npc.do_command("go", "east");
            break;
        case 2:
            npc.do_command("go", "north");
            break;
        case 3:
            npc.do_command("go", "west");
            break;
    }
}
    finish(issuc) {
    if (!this.is_start) return;
    if (this.check_handler) clearTimeout(this.check_handler);
    for (var i = 0; i < this.gate_states.length; i++) {
        var gate = this.gate_states[i];
        if (gate.boss) {
            gate.boss.destroy();
        }
        for (var j = 0; j < gate.bing.length; j++) {
            gate.bing[j].destroy();
        }
        gate.bing = [];
        gate.boss = null;
        gate.wall_count = 0;
        gate.step = 0;
    }
    for (var i = 0; i < this.guards.length; i++) {
        this.guards[i].destroy();
    }
    this.guards.length = 0;
    this.is_start = false;
    var index = WORLD.DATA.query_temp("xiangyang") + 20;
    if (issuc == 1) {
        this.send_message("武神历" + UTIL.to_c(index) + "年蒙古可汗蒙哥被击杀于襄阳城下，襄阳城大获全胜！", true);
        this.send_message("郭大侠犒赏全军，前往襄阳城领取！", true);
        WORLD.DATA.set_temp("xy_status", 12, 3600000);
        WORLD.DATA.set_temp("xy_sc", 2, 3600000);
    } else if (issuc == 0) {

        this.send_message("武神历" + UTIL.to_c(index) + "年郭大侠战死襄阳，襄阳城失守！", true);
        if (this.boss)
            this.boss.destroy();
        WORLD.DATA.set_temp("xy_status", 10, 3600000);
        WORLD.DATA.set_temp("xy_sc", 0, 3600000);
    } else {
        this.send_message("武神历" + UTIL.to_c(index) + "年蒙古大军久攻不下从襄阳城撤退，襄阳危机解除！", true);
        this.send_message("郭大侠犒赏全军，前往襄阳城领取！", true);
        WORLD.DATA.set_temp("xy_status", 11, 3600000);

        WORLD.DATA.set_temp("xy_sc", 1, 3600000);
        if (this.boss)
            this.boss.destroy();
    }
    this.create_event(issuc);
    if (this.create_handler) clearTimeout(this.create_handler);
    this.boss = null;
    this.guard = null;
    this.startup();
    this.xy_area.notify_update();
    WORLD.DATA.remove_temp('xy_party');

    WORLD.DATA.remove_temp("xy_users");
    this.call_out(this.reset, 3600000);
}
    send_message(str, sendall) {
    COMMAND.DO("sys", str);
}
    create_event(issuc) {
    let desc = null, command = null;
    if (issuc === 1) {
        desc = "襄阳守城活动结束，襄阳城大获全胜，可直接领取犒赏军功！";
        command = "领取军功";
    } else if (issuc === 0) {
        desc = "襄阳守城活动结束，襄阳城失守！";
        command = "";
    } else {
        desc = "襄阳守城活动结束，襄阳危机解除，可直接领取犒赏军功！";
        command = "领取军功";
    }
    EVENTS.add({
        id: 'xiangyang',
        name: "襄阳守城",
        desc: desc,
        time: WORLD.DATA.temp.xy_status.e,
        grade: 3,
        command: command,
        check: (me) => {
            if (!this.is_jgmax(me) || me.query_temp('xy_hd', 0) < 2)
                return true;
            return false;
        },
        on_command: (me) => {
            this.reward(me);
        }
    });
}
    reset() {
    this.xy_area.notify_update();
}
    jg_limit(me) {
    return JUNGONG_LIMITS[me.level];
}
    is_jgmax(me) {
    return me.query_temp('jg_week', 0) >= JUNGONG_LIMITS[me.level];
}
    reward(me, msg = "") {
    var status = WORLD.DATA.query_temp("xy_status", 0);
    if (!status) {
        return me.notify(msg + "最近没什么战事，你可以使用你累积的军功兑换物资！");
    }
    if (status == 1) {
        return me.notify(msg + "襄阳城战事正紧，等击退蒙古大军再说！");
    }
    let reward = me.query_temp("xy_hd", 0);
    if (reward > 1) {
        return me.notify(msg + "你本周内的奖励军功已经领取过了！");
    }
    var count = WORLD.DATA.query_temp("xy_sc", 0);
    if (!(count > 0 && count < 5))
        return me.notify(msg + "最近并没有军功奖励可领取。");
    let limit = REWARDS_LIMIT[me.level];
    if (!(limit > 0))
        return me.notify(msg + "你还是先历练历练再来领取犒赏军功吧。");
    if (reward >= count)
        return me.notify(msg + "最近并没有更高等级的军功奖励可领取。");



    me.set_temp('xy_hd', count, UTIL.diff_week_time());
    let added = (count - reward) * limit;
    let max = me.add_temp('jg', added);

    return me.notify("<hiy>你领取了" + added + "点军功，目前" + max + "。</hiy>");

}
    bm(me, msg = "") {
    if (me.query_temp("xy_bm")) {
        return me.notify_fail(msg + "你已经报名守城了。");
    }
    const status = WORLD.DATA.query_temp("xy_status", 0);
    if (status != 1) {
        return me.notify_fail(msg + "最近没什么战事，不用报名！");
    }

    if (this.is_jgmax(me))
        return me.notify_fail(msg + "你本周的军功已经达到到上限。");

    const pt = WORLD.DATA.query_temp('xy_party');
    if (pt) {
        if (pt != me.query_temp('pt'))
            return me.notify_fail(msg + "目前" + pt + "正在协助守城，你就不要去添乱了。");
    }
    if (me.query_temp('xy_bm2')) {
        return me.notify_fail(msg + "你最近刚刚战斗过，休息一天再来报名吧。");
    }
    const user_count = WORLD.DATA.query_temp("xy_users", 0);
    if (user_count >= 40) return me.notify(msg + "参与守城的人已经够了，你就不要去添乱了。");

    me.set_temp('xy_bm', 1, 3600000);
    me.set_temp('xy_bm2', 1, UTIL.diff_time());
    WORLD.DATA.add_temp("xy_users", 1);
    this.xy_area.notify_update();
    me.notify("<hic>你已经报名参与守城，一周内所获军功未到上限前可重复报名。</hic>");
    return true;
}
    on_bing_died(killer, corpse) {
    if (!killer) return;
    corpse.no_alloc = true;
    corpse.clear_items = clear_items.bind(this, corpse);
    corpse.query_items = query_items.bind(this);
    this.drops_count = 0;
    if (this.diff_level < 2) {
        let room = this.die_room;

        let min_damage = this.max_hp * 0.03;
        for (let key in this.damages) {
            if (this.damages[key] >= min_damage) {
                let item = room.find_obj(key);
                if (!item || item.is_player) {
                    this.drops_count++;
                }
            }
        }
        if (this.drops_count === 0)
            corpse.disappear();
    }
}
}

const WORLD = globalThis.WORLD;
const OBJ = globalThis.OBJ;
const UTIL = globalThis.UTIL;
const NPC = globalThis.NPC;
const AREA = globalThis.AREA;
const ROOM = globalThis.ROOM;
const EVENTS = globalThis.EVENTS;
const COMMAND = globalThis.COMMAND;
const REWARDS_LIMIT = [0, 10, 20, 30, 40, 50, 60];
const JUNGONG_LIMITS = [10, 50, 100, 200, 300, 400, 500];
function add_jungong(me, count) {
    let max = JUNGONG_LIMITS[me.level];
    if (me.query_temp('jg_week', 0) >= max) return false;
    let value = me.add_temp('jg_week', count, UTIL.diff_week_time());
    if (value > max) {
        me.add_temp('jg_week', max - value, UTIL.diff_week_time());
        count = count + max - value;
        me.add_temp('jg', count);
        value = max;
    } else {
        me.add_temp('jg', count);
    }
    me.notify("<hiy>你获得了" + count + "点军功，本周已获得"
        + value + "/" + max + "。</hiy>");
}
const JUNGONGS = [1, 5, 10, 15, 20, 25, 30];
const EQ_ODDS = [1500, 2500, 3100, 4050, 5001, 5005];
function is_bm(user) {
    var bm = user.query_temp('xy_bm');
    if (!bm) return false;
    if (user.query_temp('jg_week', 0)
        >= JUNGONG_LIMITS[user.level]) return false;
    return true;
}
function query_items(me) {
    if (!this.damages) return;
    var sh = this.damages[me.id];
    if (!(sh > 0)) return;
    if (!this.user_items) this.user_items = {};
    if (this.user_items[me.id]) return this.user_items[me.id];
    if (!is_bm(me)) return;
    sh = parseInt(sh * 100 / this.max_hp);
    if (sh < 3) {
        this.user_items[me.id] = [OBJ.CREATE('money/silver', 1 + me.random(3))];
        return this.user_items[me.id];
    }
    if (sh > 100) sh = 80;
    const diff_level = this.diff_level;
    const drops = [
        {
            obj: "money/silver",
            min: 1,
            max: 1 + 5 * diff_level
        }
    ];

    if (diff_level > 3) {
        drops.push({
            obj: ["book/bc#zhongpingqiang", "book/bc#longxianggong", "book/bc#mengguqiangfa"],
            odds: 10 + sh * 50
        });
    } else if (diff_level > 1) {
        drops.push({
            obj: ["book/bc#zhongpingqiang", "book/bc#mengguqiangfa"],
            odds: 10 + sh * 50
        });
    }
    var items = OBJ.create_by_odds(drops);

    this.user_items[me.id] = items;

    if (diff_level < 1) {
        add_jungong(me, 1);
    } else {
        add_jungong(me, parseInt(JUNGONGS[diff_level]
            * Math.max(sh, 50) / 50));
    }

    return items;
}
function clear_items(corpse, me) {
    if (this.user_items && this.user_items[me.id]) {
        this.user_items[me.id].length = 0;
        if (this.drops_count > 0) {
            this.drops_count--;
            if (this.drops_count <= 0) {
                corpse.disappear();
            }
        }
    }
}
