import { NPC } from "../../../core/char/npc.js";
import { WORLD } from "../../../core/world.js";
import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends NPC {
    name = "赵铁笔";
    desc = "他是负责户口登记的，需要离婚，解除师徒关系可以来找他。";
    title = "户口登记";
    gender = 1;
    age = 35;
    per = this.random(20) + 10;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;
    score = 10;

    constructor() {
        super();
        this.set_objects([
        "eq/lv1/guanfu", 1, 1
        ]);
        this.add_action("no_marry", "离婚", this.no_marry);
        this.add_action("no_marry_no", null, this.no_marry_no);
        this.add_action("no_marry_yes", null, this.no_marry_yes);
        this.add_action("no_shitu", "解除师徒", this.no_shitu);
        this.add_action("no_shitu_no", null, this.no_shitu_no);
        this.add_action("no_shitu_yes", null, this.no_shitu_yes);
        this.add_action("no_marry2", null, this.no_marry2);
        this.add_action("no_shitu2", null, this.no_shitu2);
    }

    no_marry(me: CHARACTER, par: string) {
        var user = this.check_player(me);
        if (!user) return;
        this.send_room("$N说道：离婚这个事情可不能草率，我得问问" + me.name + "愿不愿意。注意了，双方同意离婚后将解除婚姻关系。", user);
        this.send_room("<yel>$N对著$n问道：你愿意和"+me.name+"离婚吗？</yel>", user);
        user.send_commands("no_marry_no " + this.id, "不愿意", "no_marry_yes " + this.id, "愿意");
        user.set_temp("request_no_marry", 1, 100000);
    }

    no_marry_no(me: CHARACTER, par: string) {
        if (!me.query_temp("request_no_marry")) return me.notify("没人问你。");
        var user = this.check_player(me);
        if (!user) return;
        me.send_room("<mag>$N对著$n大声道：我不愿意！</mag>", user);
        me.remove_temp("request_no_marry");
        me.send_room("赵铁笔呵呵笑道：这个我就没办法了，咱总不能强人所难对吧。");
    }

    no_marry_yes(me: CHARACTER, par: string) {
        if (!me.query_temp("request_no_marry")) return me.notify("没人问你。");
        var user = this.check_player(me);
        if (!user) return;
        me.send_room("<mag>$N对著$n大声道：我愿意！</mag>", user);
        me.remove_temp("request_no_marry");
        me.send_room("赵铁笔呵呵笑道：好吧，从现在开始你们两个就不是夫妻了，好自为之吧。");
        if (me.query_temp("wife")) {
            me.remove_temp("wife");
            me.remove_temp("wife_n");
            user.remove_temp("husband");
            user.remove_temp("husband_n");
        }
        if (me.query_temp("husband")) {
            me.remove_temp("husband");
            me.remove_temp("husband_n");
            user.remove_temp("wife");
            user.remove_temp("wife_n");
        }
            me.add_title?.("", "mar");
            user?.add_title?.("", "mar");
            me.set_temp("marry_leave", 1, 7 * 24 * 3600000);
            user.set_temp("marry_leave", 1, 7* 24 * 3600000);
    }

    no_shitu(me: CHARACTER, par: string) {
        var user = this.check_player2(me);
        if (!user) return;
        this.send_room("<yel>$N对著$n问道：你愿意和" + me.name + "解除师徒关系吗？</yel>", user);
        user.send_commands("no_shitu_no " + this.id, "不愿意", "no_shitu_yes " + this.id, "愿意");
        user.set_temp("request_no_shitu", 1, 100000);
    }

    no_shitu_no(me: CHARACTER, par: string) {
        if (!me.query_temp("request_no_shitu")) return me.notify("没人问你。");
        var user = this.check_player2(me);
        if (!user) return;
        me.send_room("<mag>$N对著$n大声道：我不愿意！</mag>", user);
        me.remove_temp("request_no_shitu");
        me.send_room("赵铁笔呵呵笑道：这个我就没办法了，咱总不能强人所难对吧。");
    }

    no_shitu_yes(me: CHARACTER, par: string) {
        if (!me.query_temp("request_no_shitu")) return me.notify("没人问你。");
        var user = this.check_player2(me);
        if (!user) return;
        me.send_room("<mag>$N对著$n大声道：我愿意！</mag>", user);
        me.remove_temp("request_no_shitu");
        me.send_room("赵铁笔呵呵笑道：好吧，从现在开始你们两个就不是师徒了，各自都需要7天后才可以继续收徒或拜师。");
        if (me.query_temp("shifu")) {
            me.remove_temp("shifu");
            me.remove_temp("shifu_n");
            user.remove_temp("tudi");
            user.remove_temp("tudi_n");
        }
        if (me.query_temp("tudi")) {
            me.remove_temp("tudi");
            me.remove_temp("tudi_n");
            user.remove_temp("shifu");
            user.remove_temp("shifu_n");
        }
        me.set_temp("st_leave", 1, 3600000 * 24 * 7);
        user.set_temp("st_leave", 1, 3600000 * 24 * 7);
    }

    no_marry2(me: CHARACTER, par: string) {
        var wife = me.query_temp("wife") || me.query_temp("husband");
        if (!wife) return me.notify_fail("赵铁笔说道：你还没结婚呢，离什么婚！");
        me.notify("赵铁笔说道：单方面解除婚姻关系需要缴纳800两黄金的手续费。");
        me.send_commands("give " + this.id + " 8000000 money", "确认解除");
    }

    no_shitu2(me: CHARACTER, par: string) {
        var wife = me.query_temp("shifu") || me.query_temp("tudi");
        if (!wife) return me.notify_fail("赵铁笔说道：你还没拜师，也没收徒！");
        if (me.query_temp("tudi")) {
            me.notify("赵铁笔说道：单方面解除师徒关系需要缴纳1000两黄金的手续费，并且解除后7天内不允许再次收徒！");
            me.send_commands("give " + this.id + " 10000000 money", "确认解除");
        } else {
            me.notify("赵铁笔说道：单方面解除师徒关系需要缴纳500两黄金的手续费，并且解除后7天内不允许再次拜师！");
            me.send_commands("give " + this.id + " 5000000 money", "确认解除");
        }
    }

    check_player(me: CHARACTER): false | CHARACTER {
    var wife = me.query_temp("wife") || me.query_temp("husband");
    if (!wife) { me.notify_fail("赵铁笔说道：你还没结婚呢，离什么婚！"); return false; }
    var user = WORLD.getUser(String(wife));
    if (!user) {
        me.notify_fail("赵铁笔说道：你的妻子/丈夫目前不在线，我不能给你办理离婚！");
        me.send_commands("no_marry2 " + this.id, "强制解除");
        return false;
    }
    if (!this.is_here(user)) {
         me.notify_fail("赵铁笔说道：你的妻子/丈夫不在这里，我不能给你办理离婚！");
         me.send_commands("no_marry2 " + this.id, "强制解除");
         return false;
    }

    return user;
}
    check_player2(me: CHARACTER): false | CHARACTER {
    var tudi = me.query_temp("tudi") || me.query_temp("shifu");
    if (!tudi) { me.notify_fail("赵铁笔说道：你没有拜师，也没有收徒！"); return false; }
    var user = WORLD.getUser(String(tudi));
    if (!user) {
         me.notify_fail("赵铁笔说道：你的徒弟/师父目前不在线，我不能给你办理解除关系手续！");
         me.send_commands("no_shitu2 " + this.id, "强制解除");
         return false;
    }
    if (!this.is_here(user)) {
         me.notify_fail("赵铁笔说道：你的徒弟/师父不在这里，我不能给你办理解除关系手续！");
         me.send_commands("no_shitu2 " + this.id, "强制解除");
        return false;
    }

    return user;
}
    on_accept(me: CHARACTER, obj: string, count: number): boolean | void {

    if (obj == "money") {
        if (count == 8000000) {
            var wife = me.query_temp("wife") || me.query_temp("husband");
            if (!wife) return me.notify_fail("赵铁笔说道：你还没结婚呢，离什么婚！");
            var user = WORLD.getUser(String(wife));
            if (me.query_temp("wife")) {
                me.remove_temp("wife");
                me.remove_temp("wife_n");
                user && user.remove_temp("husband");
                user && user.remove_temp("husband_n");
            }
            if (me.query_temp("husband")) {
                me.remove_temp("husband");
                me.remove_temp("husband_n");
                user && user.remove_temp("wife");
                user && user.remove_temp("wife_n");
            }
            me.add_title?.("", "mar");
            user?.add_title?.("", "mar");
            user && user.notify("<yel>你和" + me.name + "的夫妻关系解除了。</yel>");
            var attach = user ? null : [{
                obj: "sp/tool/fuqi#" + me.id,
                count: 1
            }];
            COMMAND.DO("send", wife, {
                content: me.name + "主动和你解除夫妻关系。",
                attach: attach
            });
            me.notify("赵铁笔呵呵笑道：好吧，你的婚姻关系已经解除了。");
            me.set_temp("marry_leave", 1, 7 * 24 * 3600000);
            user&& user.set_temp("marry_leave", 1, 7 * 24 * 3600000);
            return true;
        }
        if (count == 10000000) {
            var tudi = me.query_temp("tudi");
            if (!tudi) return me.notify_fail("赵铁笔说道：你没有徒弟！");
            var user = WORLD.getUser(String(tudi));
            me.remove_temp("tudi");
            me.remove_temp("tudi_n");
            me.set_temp("st_leave", 1, 3600000 * 24 * 7);
            if (user) {
                user.remove_temp("shifu");
                user.remove_temp("shifu_n");
                user.set_temp("st_leave", 1, 3600000 * 24 * 7);
                user.notify("<yel>你和" + me.name + "的师徒关系解除了。</yel>");
            }

            COMMAND.DO("send", tudi, {
                content: "你的师父主动和你解除师徒关系",
                attach: [{
                    obj: "sp/tool/shitu#" + me.id,
                    count: 1
                }]
            });

            me.notify("赵铁笔说道：你的师徒关系已经解除了。");
            return true;
        }

        if (count == 5000000) {
            var shifu = me.query_temp("shifu");
            if (!shifu) return me.notify_fail("赵铁笔说道：你没有徒弟！");
            var user = WORLD.getUser(String(shifu));
            me.remove_temp("shifu");
            me.remove_temp("shifu_n");
            me.set_temp("st_leave", 1, 3600000 * 24 * 7);
            if (user) {
                user.remove_temp("tudi");
                user.remove_temp("tudi_n");
                user.set_temp("st_leave", 1, 3600000 * 24 * 7);
               user.notify("<yel>你和" + me.name + "的师徒关系解除了。</yel>");
            }

            COMMAND.DO("send", shifu, {
                content: "你的徒弟主动和你解除师徒关系",
                attach: [{
                    obj: "sp/tool/shitu#" + me.id,
                    count: 1
                }]
            });
            me.notify("赵铁笔说道：你的师徒关系已经解除了。");
            return true;
        }
    }
}
}
