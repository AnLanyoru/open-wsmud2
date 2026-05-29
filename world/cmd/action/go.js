import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "go";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, dir) {
    if (me.hp <= 0) return;
    if (!dir) return me.notify("你要往哪里走？");
    dir = OUTER_DOORS[dir];
    if (!dir) return me.notify("你要往哪里走？");
    var cur_room = me.environment;
    if (!cur_room) {
        return me.notify("这里不知道怎么走。");
    }
    var rm = cur_room.exits && cur_room.exits[dir];
    if (!rm) return me.notify("这个方向没有出路。");
    // if (rm === " ") {
    //     console.log(me.name, cur_room.path);
    // }

    var next_room = ROOM.Get(rm);
    if (!next_room) {
        return me.notify(rm + "还没开放!");
    }
    if (me.fight_type > 0 && !me.do_escape()) {
        return;
    }
    if (me.is_rash) return me.notify("你现在没办法移动。");
    if (cur_room.owner) {
        //当前房间在副本区域
        var copyroom = next_room.query_copy(cur_room.owner);
        if (copyroom) {
            next_room = copyroom;
        } else {
            if (cur_room.is_fb()) {
                //不能从副本直接出去
                return me.notify("这里不能过去。");
            }
        }
    }

    if (me.query_temp("killer")) {
        if (next_room.is_copy() || next_room.no_fight)
            return me.notify("你现在正在被追杀，不能进入安全区和副本区域。");
    }
    me.moveto(next_room, sendOutMessage(me, dir), sendInMessage(me), dir);
}
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
const ROOM = globalThis.ROOM;
var OUTER_DOORS = {
};
var doors = ["west", "north", "south", "east", "northwest", "southwest", "northeast", "southeast",
    "down", "up", "westdown", "northdown", "southdown", "eastdown", "westup", "northup", "southup", "eastup", "enter", "out"];
var doors_short = ["s", "n", "w", "e", "se", "sw", "nw", "ne", "d", "u", "sd", "ed", "nd", "wd", "su", "eu", "wu", "nu"];
for (var i = 0; i < doors.length; i++) {
    if (i < doors_short.length) {
        OUTER_DOORS[doors_short[i]] = doors[i];
    }
    OUTER_DOORS[doors[i]] = doors[i];
}
function sendOutMessage(player, dir) {
    dir = dirs[dir] || "";
    if (player.is_fighting()) {
        return player.name + "往" + dir + "落荒而逃了。";
    }
    var eq = player.hp * 100 / player.max_hp;
    if (eq < 5) {
        return player.name + "撑起满是<HIR>鲜血</HIR>的躯体，一瘸一拐地朝" + dir + "挪去。";
    } else if (eq < 10) {
        return player.name + "一边擦着嘴角的<HIR>鲜血</HIR>，一边朝" + dir + "走去。";
    } else if (eq < 30) {
        return player.name + "灰头土脸、狼狈不堪地向" + dir + "离去。";
    } else if (eq < 50) {
        return player.name + "一声不吭的转身朝" + dir + "走去，脸色好像有些难看。";
    }
    return player.name + "往" + dir + "离开。";
}
function sendInMessage(player, dir) {
    if (player.fight_type) {
        return player.name + "跌跌撞撞地跑了过来，模样有些狼狈。";
    }
    var eq = player.hp * 100 / player.max_hp;
    if (eq < 5) {
        return player.name + "撑着满是<HIR>鲜血</HIR>的躯体，一瘸一拐地挪了过来。";
    } else if (eq < 10) {
        return player.name + "一边擦着嘴角的<HIR>鲜血</HIR>，一边走了过来，龇牙咧嘴的。";
    } else if (eq < 30) {
        return player.name + "灰头土脸、狼狈不堪地走了过来。";
    } else if (eq < 50) {
        return player.name + "像斗败了的公鸡，垂头丧气地走了过来。";
    }

    var face = getFace(player) + "的" + player.name;
    var weapon = player.weapon_name();
    if (weapon) face += "手执" + weapon;
    if (!player.get_equipment(EQUIP_TYPE.CLOTH) && !player.get_equipment(EQUIP_TYPE.PANTS)) {
        face += "全身清洁溜溜的";
    }
    return face + "走了过来。";
}
var dirs = {
    "north": "北方",
    "south": "南方",
    "east": "东方",
    "west": "西方",
    "northup": "北边",
    "southup": "南边",
    "eastup": "东边",
    "westup": "西边",
    "northdown": "北边",
    "southdown": "南边",
    "eastdown": "东边",
    "westdown": "西边",
    "northeast": "东北",
    "northwest": "西北",
    "southeast": "东南",
    "southwest": "西南",
    "up": "上面",
    "down": "下面",
    "enter": "里面",
    "out": "外面",
};
var face1 = ["眉歪眼斜", "贼眉鼠眼", "尖嘴猴腮", "相貌平平", "膀大腰圆", "一表人才",
    "仪表堂堂", "丰神如玉", "气宇不凡", "玉树临风般"];
var face2 = ["奇丑无比", "獐头鼠目", "身材干瘦", "相貌平平", "体态轻盈", "亭亭玉立",
    "面目姣好", "容色秀丽", "风情万种", "清丽绝俗", "美若天仙"];
function getFace(player) {
    var v = parseInt((player.per || 20) / 4);
    if (player.gender == 1) {
        if (v > face1.length - 1) v = face1.length - 1;
        return face1[v];
    } else {
        if (v > face2.length - 1) v = face2.length - 1;
        return face2[v];
    }
}
