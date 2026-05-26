
this.inherits(TASK);
this.id = "boss";
const BOSSTASK = this;
this.startup = function () {
    // this.call_out(this.run, this.random(100000));//this.random(600000)+600000
    this.check_time();
}

this.stop = function () {
    if (this.time_handler) clearTimeout(this.time_handler);
    if (this.boss && this.boss.length) {
        for (var i = 0; i < this.boss.length; i++) {

            this.boss[i].destroy(this.boss[i].name + "离开了。");
        }
        this.boss.length = 0;
        this.boss = null;
    }
    this.time_handler = null;
}
this.check_time = function () {
    var dt = new Date();
    var week = dt.getDay();
    var hour = dt.getHours();
    if (hour == 21) {
        var min = dt.getMinutes();
        this.next_time = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), hour, (parseInt((min + 5) / 5)) * 5, 20);

    } else if (hour == 20) {
        this.next_time = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 21, 0, 20);
    } else {
        this.next_time = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), hour + 1, 6 + this.random(50), 20);
    }

    this.time_handler = this.call_out(this.run, this.next_time - dt);
}
this.quickly = false;
this.boss = null;
this.boss_count = 1;
this.quick = function () {
    if (this.quickly) this.quickly = false;
    else this.quickly = true;
    this.stop();
    this.check_time();
}
const BOSS_LEVELS = ["", "武士", "武师", "宗师", "武圣", "武帝", "武神"];
this.run = function () {
    this.stop();
    this.check_time();
    const list = this.check_users();
    this.boss = [];
    for (var i = 0; i < list.length; i++) {
        if (!list[i]) continue;
        let level = i + 1;
        let bs = this.create_boss(level);
        if (!bs) return console.log("boss 创建失败");
        this.boss.push(bs);
        bs.event_id = 'boss' + level;
        var rm = ROOM.RANDOM(); //ROOM.Get("yz/nanmen");
        rm.item_changed(bs, true);
        let desc = '听说' + bs.name + '出现在' + rm.long_name + '一带';
        let msg = '{"type":"msg","ch":"rumor","content":"' + desc + '。"}';
        for (var j = 0; j < list[i].length; j++) {
            list[i][j].send(msg);
        }
        EVENTS.add(this.create_event(bs.event_id, level, desc, rm));
    }
}
this.create_event = function (evtid, level, desc, rm) {
    return {
        id: evtid,
        name: BOSS_LEVELS[level] + "BOSS挑战",
        desc: desc + "，你可以前往尝试挑战，根据你造成的伤害可获得丰厚奖励。",
        time: 0,
        grade: level,
        command: "前往挑战",
        check: (me) => me.level === level,
        on_command: function (me) {
            if (me.state) return me.send('你正在' + me.state.title + "。");
            if (me.query_temp("bcc", 0) >= 5)
                return me.send('你今日的BOSS挑战次数已满。');
            if (!me.can_trans()) return;
            if (rm.is_full(1))
                return me.send('那里人太多了，你过不去。');
            me.moveto(rm.path, me.name + "离开了。", me.name + "走了过来。");
            return true;
        }
    }
}

this.check_users = function () {
    var list = [];
    for (var i = 0; i < WORLD.USERS.length; i++) {
        var user = WORLD.USERS[i];
        if (!user.level) continue;
        if (user.level > 5 && this.create_boss2(user)) continue;
        if (!user.socket) continue;
        if (user.query_temp("bcc", 0) >= 5) continue;
        var lv = user.level - 1;
        if (lv > 4) {
            lv = 4;
        }
        if (!list[lv]) list[lv] = [];
        list[lv].push(user);

    }
    return list;
}
this.create_boss = function (player_level) {
    var max_level = this.boss_levels[WORLD.DATA.query_temp("fb_index", 0)];
    if (player_level) {
        var boss_max = this.level_max[player_level][1];
        var boss_min = this.level_max[player_level][0];
        if (max_level > boss_max) max_level = boss_max;
    } else {
        boss_max = 0;
        boss_min = 0;
    }

    var level = this.random(max_level - boss_min) + boss_min;

    if (!this.paths[level]) return console.log(level, max_level, " boss 创建失败");
    var diff_level = this.levels[level];
    var boss = NPC.CLONE(this.paths[level]);
    if (!boss) return;
    boss.boss_index = level;
    boss.min_fbindex = this.boss_min_fb[level];
    var sk_level = (level + 1) * 100;
    if (diff_level > 300) {
        sk_level = (level + 1) * 130;
    }
    for (var item in boss.skills) {
        boss.skills[item].level = sk_level;
    }
    boss.diff_level = diff_level;
    boss.hp = boss.max_hp = diff_level * diff_level * 500;

    boss.mp = boss.max_mp = boss.max_hp / 2;
    boss.prop = {};
    boss.level = player_level || this.player_levels[level];
    if (diff_level >= 500) boss.level = 5;
    boss.init();
    boss.recount();
    boss.pfm_rate = 1;
    boss.recount();
    boss.record_damage = true;
    boss.on_died = this.on_died;
    boss.on_enter = null;
    boss.on_kill = this.on_kill;
    boss.no_fight = true;
    boss.no_refresh = true;
    boss.on_die = null;

    return boss;
}
this.on_kill = function (me) {
    if (me.level > this.level) {
        if (this.family == FAMILIES.MONSTER) {
            return me.notify_fail(this.name + "目露凶光狠狠的瞪着你。");
        }
        return me.notify_fail(this.name + "对你拱手说道：这位" + me.call() + "，不知" + this.callme() + "有何得罪之处？");
    }
}

function create_finish_event(boss) {
    return {
        id: boss.event_id,
        name: BOSS_LEVELS[boss.level] + "BOSS挑战",
        desc: boss.name + "被击败了，解锁快速领取可直接领取基础掉落，并增加一次参与次数",
        time: BOSSTASK.next_time.getTime(),
        grade: boss.level,
        command: "领取",
        check: (me) => me.level === boss.level,
        on_command: function (me, par) {
            BOSSTASK.boss_auto_drops(me, boss, par);
        }
    }
}



this.on_died = function (me, corpse) {
    if (!this.is_party_boss)
        EVENTS.add(create_finish_event(this));
    if (!this.damages) return;
    corpse.no_alloc = true;
    corpse.clear_items = clear_items.bind(this);
    corpse.query_items = query_items.bind(this);
    corpse.query_damage = query_damage.bind(this);
}
function query_damage() {
    var str = [];
    for (var key in this.damages) {
        var user = WORLD.getUser(key);
        if (user) {
            str.push(user.name);
            str.push("：");
            str.push(this.damages[key]);
            str.push("==");
            str.push(parseInt(this.damages[key] * 100 / this.max_hp));
            str.push("%\n");
        }
    }
    return str.join("");
}

const BOSS_DROPS = {
    lv1_0: [
        "st/st_red#0", "st/st_gre#0", "st/st_blu#0", "st/st_yel#0"],

};




function query_items(me) {
    if (!this.damages) return;

    var sh = this.damages[me.id];
    if (!(sh > 1)) return;
    if (!this.user_items) this.user_items = {};
    if (this.user_items[me.id]) return this.user_items[me.id];
    if (me.query_temp("bcc", 0) >= 5) return;



    sh = parseInt(sh * 100 / this.max_hp);
    if (sh < 1) {
        this.user_items[me.id] = [OBJ.CREATE('money/silver', 1 + me.random(10))];
        return this.user_items[me.id];
    }
    if (sh > 100) sh = 80;
    var lv = this.diff_level - 20;
    if (lv < 0) lv = 0;

    var drops = [
        {
            obj: "st/xuanjing",
            min: 1,
            max: 10
        }, {
            obj: BOSS_DROPS.lv1_0,
            odds: 5000 + lv * 10 + sh * 10
        }
    ];

    me.add_temp("bcc", 1, UTIL.diff_time());
    var items = OBJ.create_by_odds(drops);
    this.user_items[me.id] = items;
    return items;
}


function clear_items(me) {
    if (this.user_items) {
        this.user_items[me.id].length = 0;
    }
}

this.levels = [
    3, 5, 10, 12, 20, 40
];
this.player_levels = [
    1, 1, 1, 2, 2, 2,
    3, 3, 3, 3

];
this.level_max = [
    [0, 99], [0, 3], [0, 4], [0, 4], [0, 4], [0, 4]
];
this.boss_levels = [
    3, 3, 3, 3, 3,
    3, 3, 3, 4, 4];

this.boss_min_fb = [
    1, 4, 6, 7
];
this.paths = [
    "yz/lm/zhao", "bj/ao/aobai", "bj/tdh/chen", "bj/shenlong/hong"
];
