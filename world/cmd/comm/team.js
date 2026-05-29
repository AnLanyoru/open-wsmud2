import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "team";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(add|with|remove|out|reply|dismiss|set)?(?:\s(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, act, user) {
    if (act) {
        var func = this["team_" + act];
        return func && func.call(this, me, user);
    } else {

        me.send(teamToString(me));
    }

}
    team_set(me, arg) {
    if (!me.team) return me.notify("你没有组队。");
    if (!arg) {
        me.notify("目前队伍的分配方式是：" + (me.team.free_get ? "自由拾取" : "需求分配"));
        if (me.team.free_get) {
            me.send_commands("team set allot_get", "更改为按需求分配");
        } else {
            me.send_commands("team set free_get", "更改为自由拾取");
        }
        return;
    }
    switch (arg) {
        case "free_get":
            me.team.free_get = true;
            me.send_team("<hig>拾取方式已设置为自由拾取。</hig>");
            break;
        case "allot_get":
            me.team.free_get = false;
            me.send_team("<hig>拾取方式已设置为需求分配。</hig>");
            break;
    }
}
    team_with(me, user) {
    var player = me.find_obj(user, me.environment);
    if (!player) return me.notify("没有这个玩家，或者不在线");
    if (player.master != me.id) return me.notify(player.name + "拒绝了你的组队邀请。");
    if (player.team) return me.notify(player.name + "已加入组队，无法接受你的请求。");
    if (me.environment.is_fb()) return me.notify("你正在副本，无法邀请别人。");
    if (me.environment.parent.no_team) return me.notify("你正在副本，无法邀请别人。");
    if (me.team) {
        if (me.team.length > 4) {
            return me.notify("你的队伍人数已满。");
        }
    }
    player.set_temp("team", me.id);

    this.team_reply(player, "ok");
}
    team_add(me, user) {
    var player = WORLD.getUser(user);
    if (!player) {
        //player = me.find_obj(user, me.environment);
        //if (player) {
        //    return me.notify(player.name + "已加入组队，无法接受你的请求。");
        //}

        return me.notify("没有这个玩家，或者不在线");
    }
    if (player.serverid !== me.serverid) return me.notify("你不能组他。");
    if (player === me) return;
    if (player.query_setting('no_team')) return me.notify(player.name + "目前不接受组队邀请。");

    if (player.team) return me.notify(player.name + "已加入组队，无法接受你的请求。");
    if (me.environment.is_fb()) return me.notify("你正在副本，无法邀请别人。");
    if (me.environment.parent.no_team) return me.notify("你正在副本，无法邀请别人。");
    if (player.query_temp('team') == me.id) return me.notify("你已经邀请过" + player.name + "了，正在等待回应。");

    if (me.team) {
        if (me.team.length > 4) {
            return me.notify("你的队伍人数已满。");
        }
        for (var i = 0; i < me.team.length; i++) {
            if (me.team[i].environment && me.team[i].environment.is_fb()) {
                return me.notify("你的队伍已经开启副本，无法增加队员。");
            }
        }
    }
    player.send("<hic>" + me.name + "邀请你加入组队，是否同意？</hic>");
    player.send_commands("team reply ok", "同意", "team reply no", "不同意");
    player.set_temp("team", me.id, 10000);
    me.send("<hig>已经发送对" + player.name + "的组队邀请。</hig>");
}
    team_reply(me, act) {
    var p = me.query_temp("team");
    if (!p) return me.send("没有人邀请你组队，或邀请已过期。");
    var player = WORLD.getUser(p);
    if (!player) me.send("没有人邀请你组队，或邀请已过期。");
    if (act == "ok") {
        if (me.team) return me.send("你已经有队伍了。");
        if (me.environment && me.environment.parent.is_copy && !me.environment.parent.not_fb) {
            return me.send("你目前正在副本中，无法加入队伍。");
        }

        if (me.environment.parent.no_team) return me.notify("你正在副本，无法加入队伍。");
        if (!player.team) {
            //如果开始组队的玩家没有队伍就先创建个
            player.team = [];
            player.team.alloc = team_dice;
            player.team.id = UTIL.create_id();
            player.team.push(player);
        } else if (player.team.length > 4) {
            return me.send("<red>" + player.name + "队伍人数已经满了。</red>");
        }
        player.team.push(me);
        me.team = player.team;
        me.send_team("<hig>" + me.name + "加入队伍。</hig>");
        me.send_team(teamToString(me));
        me.on_teamin && me.on_teamin(player);
    } else {
        player.send("<red>" + me.name + "拒绝了你的邀请。</red>");
        me.send("<hic>你拒绝了" + player.name + "的邀请。</hic>");
    }
    me.remove_temp("team");
}
    team_remove(me, user) {
    var tm = me.team;
    if (!tm) return me.notify("你还没有加入队伍。");
    if (me != tm[0]) return me.notify("你不是队长没有权利移除队员。");
    for (var i = 1; i < tm.length; i++) {
        var player = tm[i];
        if (player.id == user) {
            if (player.environment && player.environment.is_fb()) return me.notify(player.name + "现在正在副本区域，不能移除。");
            player.send("<red>你被移除出了队伍。</red>");
            player.on_teamout && player.on_teamout(me);
            player.team = null;
            tm.splice(i, 1);

            me.send_team("<hic>" + player.name + "被移出组队。</hic>");
            me.send_team('{"type":"dialog","dialog":"team",remove:"' + player.id + '"}');
            break;
        }
    }
    if (tm.length == 1) {
        me.send("<hic>你的队伍解散了。</hic>");
        me.send('{"type":"dialog","dialog":"team",dismiss:true}');
        tm.length = 0;
        me.team = null;
        checkTeamfb(me);
    }
}
    team_dismiss(me) {
    if (!me.team) return me.notify("你没有加入队伍。");
    if (me != me.team[0]) return me.notify("你不是队长没有权利解散队伍。");
    for (var i = 0; i < me.team.length; i++) {
        var tm = me.team[i];
        if (tm.environment.is_fb())
            return me.notify((tm == me ? "你" : tm.name) + "现在正在副本区域，不能解散队伍。");
    }
    for (var i = 0; i < me.team.length; i++) {
        var tm = me.team[i];
        tm.send("<hic>你的队伍解散了。</hic>");
        tm.send('{"type":"dialog","dialog":"team",dismiss:true}');
        if (tm != me) {
            tm.on_teamout && tm.on_teamout(me);
            tm.team = null;
        }
    }

    me.team.length = 0;
    me.team = null;
    checkTeamfb(me);
}
    team_out(me) {
    if (!me.team) return me.notify("你没有加入队伍。");
    if (me.environment.is_fb()) return me.notify("你现在正在副本区域，不能离开队伍。");
    me.team_out("退出队伍");
}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
function teamToString(me) {
    var str = ['{"type":"dialog","dialog":"team","items":['];
    if (me.team) {
        for (var i = 0; i < me.team.length; i++) {
            var p = me.team[i];

            str.push("{id:\"");
            str.push(p.id);
            str.push("\",name:\"");
            str.push(p.long_name());
            str.push("\"}");
            if (i != me.team.length - 1) {
                str.push(",");
            }
        }
    }
    str.push("]}");
    return str.join("");
}
function team_dice(obj) {
    if (!this.objs || this.objs.indexOf(obj) == -1) return;
    var me = this[0];
    if (!me) {
        for (let i = 0; i < this.objs.length; i++) {
            this.objs[i].dice = null;
        }
        return;
    }
    if (!obj.dice || !obj.dice.user) {
        me.send_team(obj.color_name + "所有人都放弃。");
        return;
    }
    var userid = obj.dice.user;

    var player = null;
    for (var i = 0; i < this.length; i++) {
        if (this[i].id == userid) {
            player = this[i];
            break;
        }
    }
    if (!player) {
        obj.dice = null;
        this.objs.remove(obj);
        return me.notify("战利品分配失败，玩家不在队伍。");
    }
    obj.dice = null;
    this.objs.remove(obj);
    player.add_obj(obj);
    player.send_team(player.name + "获得" + UTIL.to_c(obj.count) + obj.unit + obj.color_name + "。");
}
function checkTeamfb(me) {
    if (me.environment && me.environment.is_fb()) {
        WORLD.COMMANDS['cr'].enter(me, 'over')
        me.notify("<hic>你退出了队伍，自动离开副本。</hic>");
    }
}
