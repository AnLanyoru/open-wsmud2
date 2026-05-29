import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { SKILL } from "../../../os/skill/skill.js";

export default class extends COMMAND {
    command = "look3";
    allow_busy = true;
    allow_state = true;
    regex = /^(?:(\w+)\sof\s)?(\w+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, index, userid) {
    if (userid.startsWith("fb_")) {
        var area_index = parseInt(userid.substr(3));
        var area = WORLD.AREAS[area_index];
        if (!area) return me.notify("没有这个副本。");
        var drop_items = area.query_drop_items();
        if (!drop_items) return me.notify("没有这件装备。");
        var item = drop_items[index];
        if (!item) return me.notify("没有这件装备。");
        if (item.skill) {
            var skill_base = SKILL.get(item.skill);
            if (!skill_base) {
                return me.send("没有这个技能。");
            }
            if (!me.skills) me.skills = {};
            return me.send(skill_base.query_desc(me, 1000));
        }
        // var book_index = item.path.indexOf("book/bc#");
        // if (book_index == 0) {
        //     var skillid = item.path.substr(8);
        //     var skill_base = SKILL.get(skillid);
        //     if (!skill_base) {
        //         return me.send("没有这个技能。");
        //     }
        //     return me.send(skill_base.query_desc(me, 1000));
        // }
        me.notify(item.get_desc(me));
        return;
    }
    if (userid === me.id) return me.send(me.query_desc(me, "look3"));
    var user = WORLD.getUser(userid);
    if (!user) return me.notify("没有这个玩家。");
    if (index != undefined) {
        if (index === 'body') {
            return me.send(user.query_desc(me, "look3"));
        }
        index = parseInt(index);
        if (!(index >= 0 && index < 11)) return me.notify("你要看什么？");
        if (user.query_setting("hide_equip")) {
            return me.send("看样子" + user.call3() + "不想让别人看自己的装备。");
        }

        let item = user.equipment[index];
        if (!item) return me.notify(user.name + "没有装备你要看的东西。");
        me.notify(item.get_desc(user));

    } else {
        //  me.notify(user.query_desc(me, "look3"));
        me.send(user.long_name() + "<div class='item-commands'><span cmd='look3 body of " + user.id + "'>查看</span><span cmd='team add " + user.id + "'>邀请组队</span></div>");
        if (me.user_level >= 2) {
            if (user.query_temp("no_chat")) {
                me.send_commands("setuser " + user.id + " chat3", "解除禁言", "setuser " + user.id + " quit", "踢出游戏");
            } else {
                me.send_commands("setuser " + user.id + " chat1", "永久禁言", "setuser " + user.id + " chat2", "禁言1小时", "setuser " + user.id + " quit", "踢出游戏");
            }
        }
    }
}
}

