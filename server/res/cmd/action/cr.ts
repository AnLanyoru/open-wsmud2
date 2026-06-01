import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { OBJ } from "../../../core/item/obj.js";
import { UTIL } from "../../../core/util/util.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { AREA } from "../../../core/room/area.js";
import { ROOM } from "../../../core/room/room.js";

export default class extends COMMAND {
    command = "cr";
    allow_fight = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    if (!me.environment) return;

    if (!arg) {
        fb_confirm_over(me);
    } else if (arg == "over") {
        fb_over(me);
    }
    else {
        fb_start(me, arg);
    }
}
}

function fb_ok(me) {
    var r = me.query_temp("teamcr");
    if (r == 1) {
        me.set_temp("teamcr", 2, 200000);
        me.send_team("<hig>" + me.name + "同意进入副本。</hig>");
        for (var i = 0; i < me.team.length; i++) {
            if (me.team[i].query_temp("teamcr") != 2) {
                return;
            }
        }

        return;
    } else if (r == 2) {
        return me.notify("你已经同意了。");
    }
    return me.notify("没有人邀请你进入副本。");
}
function fb_reject(me) {
    var r = me.query_temp("teamcr");
    if (r == 1) {
        me.remove_temp("teamcr");
        return me.send_team("<hic>" + me.name + "拒绝进入副本。</hic>");
    } else if (r == 2) {
        return me.notify("你已经同意了。");
    }
    return me.notify("没有人邀请你进入副本。");
}
function fb_saodang(me, path, isdiff, count) {
    var fb = AREA.Get_FB(path);
    if (!fb) {
        return me.notify("没有这个副本!");
    }
    let next_room = ROOM.Get(fb.first);
    if (!next_room) {
        return me.notify("没有这个房间");
    }
    if (!next_room.is_fb()) return me.notify(fb.name + "不是副本区域!");

    if (!fb.is_unlock(me))
        return me.notify("副本" + fb.name + "还没解锁!");

    if (me.is_full(-10)) return me.notify("你身上东西太多了!");
    var area = next_room.parent;
    var unlock_name = isdiff ? "fb_sao1" : "fb_sao0";
    if (area.unlock_index) {
        if (me.query_temp('fb_sao' + area.fb_index, 0) !== (isdiff ? 2 : 1))
            return me.notify("你需要" + area.name + (isdiff ? "(困难)" : "(普通)") + "单人模式完成100%才可以扫荡副本!");
    } else {
        if (area.fb_index >= (me.query_temp(unlock_name) || 0))
            return me.notify("你需要" + area.name + (isdiff ? "(困难)" : "(普通)") + "单人模式完成100%才可以扫荡副本!");
    }

    count = parseInt(count);

    if (me.query_jingli() < area.expend) return me.notify("你的精力不够，无法扫荡副本。");
    var fu = me.find_obj_bypath("cash/saodang");
    if (!fu || fu.count < count) return me.notify_fail("你的扫荡符不够继续扫荡了。");
    if (count == 1) return fb_quick(me, area, isdiff);
    me.call_interval(fb_quick.bind(me, me, area, isdiff), 500, count, x => {
        me.notify(area.name + "扫荡完成。");
    });
}
function fb_quick(me, area, isdiff) {

    var drops = area.query_drops(isdiff, me);
    if (!drops || !drops.length) return me.notify_fail('这里不能快速完成。');

    var fu = me.find_obj_bypath("cash/saodang");

    if (!fu || !fu.count) return me.notify_fail("你的扫荡符不够继续扫荡了。");
    if (me.query_jingli() < area.expend) {
        me.notify("你的精力不够继续开启副本。");
        return false;
    }
    if (me.items.length > 204) return me.notify_fail("你背包的东西太多了。");

    if (area.on_quick && !area.on_quick(me)) return false;

    if (me.expend_jingli(area.expend) == false) { return me.notify_fail("你的精力不够，不能开启副本。"); }


    me.remove_obj(fu, 1);
    var max_score = area.query_exp();
    me.add_exp(max_score, max_score);
    me.add_temp("fb_count", 1);
    me.add_temp("fb_count_day", 1, UTIL.diff_time());

    var diff = isdiff ? 1 : 0;
    if (area.is_record(diff)) {
        ''
        me.add_temp("fbc_" + diff + "_" + area.fb_index, 1);
    }
    for (var j = 0; j < drops.length; j++) {
        var items = OBJ.create_by_odds(drops[j]);
        for (var i = 0; i < items.length; i++) {
            var item = me.add_obj(items[i]);
            if (item.is_equipment && item.grade >= 5) {
                COMMAND.DO("rumor", "听说有人得到了一" + item.unit + item.name + "。");
            }
            var count = items[i].count || 1;
            if (item) {
                me.send("你获得了" + UTIL.to_c(count) + item.unit + item.color_name + "。");


            }

        }
    }

    area.on_quick_over && area.on_quick_over(me);
}
function get_mincount(drops, obj) {
    for (var i = 0; i < drops.length; i++) {
        if (typeof drops[i].obj == "string") {
            if (drops[i].obj == obj) {
                return drops[i].min;
            }
        } else if (drops[i].obj.indexOf(obj) > -1) {
            return drops[i].min;
        }

    }
    return 1;
}
function get_odds(drops, obj) {
    for (var i = 0; i < drops.length; i++) {
        if (typeof drops[i].obj == "string") {
            if (drops[i].obj == obj) {
                return drops[i].odds;
            }
        } else if (drops[i].obj.indexOf(obj) > -1) {
            return drops[i].odds;
        }

    }
    return 1;
}
function fb_start(me, path) {
    if (!path) return me.notify("你要开始哪个副本？");
    if (!me.environment) return me.notify("你不知道在哪。");
    if (me.environment.is_fb()) return me.notify("你现在正在副本区域。");
    if (me.environment.parent.on_leave && me.environment.parent.on_leave(me) == false) return;

    var pars = /^(.+?)\s(\d)\s(\d+)$/.exec(path);


    var diff_type = 0;
    if (pars != null) {
        path = pars[1];
        diff_type = parseInt(pars[2]);
        if (diff_type < 0 || diff_type > 2) return;
        var sao = parseInt(pars[3]);
        if (sao > 0) {
            if (diff_type == 2) {
                return me.notify("组队副本不可以扫荡!");
            }
            return fb_saodang(me, path, diff_type == 1, sao);
        }

    }
    var fb = AREA.Get_FB(path);
    if (!fb) {
        return me.notify("没有这个副本!");
    }
    var next_room = ROOM.Get(fb.first);
    if (!next_room) {
        return me.notify("没有这个副本!");
    }
    if (fb.is_lock) {
        return me.notify("暂未开放，正在修复");
    }
    if (diff_type == 1 && !fb.is_diffi) {
        return me.notify(fb.name + "没有困难模式!");
    }
    if (diff_type == 2) {
        if (!fb.is_multi)
            return me.notify(fb.name + "没有组队模式!");
        if (!me.team || !me.team.length)
            return me.notify("你没有组队无法进入组队模式!");
    } else {
        if (me.team)
            return me.notify("你正在队伍中，无法进入单人副本!");
    }
    if (!next_room.is_copy() || !next_room.is_fb())
        return me.notify(fb.name + "不是副本区域!");

    if (!fb.is_unlock(me))
        return me.notify("副本" + fb.name + "还没解锁!");





    if (fb.on_enter && fb.on_enter(me) === false) return;
    var team = me.query_teamid();
    var copy_room = next_room.query_copy(team);
    if (copy_room) {
        next_room = copy_room;
        if (me.team) {
            if (copy_room.query_temp(me.id, undefined, me) == 1) {
                return me.notify("你已经完成副本，必须等其他队员也完成后才可以重新进入。");
            }
            if (me.expend_jingli(fb.expend) == false) { return me.notify("你的精力不够，无法副本。"); }
            //记录这个玩家进入副本的标志，防止重复进入
            copy_room.set_temp(me.id, 1, undefined, me);
        } else {
            if (diff_type == 2)
                return me.notify("你需要组队才可以进入副本。");
        }
    } else {
        if (me.query_jingli() < fb.expend) {
            return me.notify("你的精力不够，不能开启副本。");
        }
        if (me.expend_jingli(fb.expend) == false) { return me.notify("你的精力不够，不能开启副本。"); }
        next_room = next_room.create_copy(team, diff_type);

        if (!next_room) {
            return me.notify("副本创建失败。");
        }
        next_room.set_temp("diff", diff_type, undefined, me);
        if (me.team) {
            next_room.set_temp(me.id, 1, undefined, me);
            for (var i = 0; i < me.team.length; i++) {
                var tm = me.team[i];
                if (tm != me && tm.is_player) {
                    tm.send("<hic>你的队友" + me.name + "已进入组队副本【"
                        + fb.name + "】，是否进入？</hic>", true);
                    tm.send('{type:\"cmds\",items:[{cmd:"cr ' + path + ' 2 0",name:"进入副本"}]}', true);
                }
            }
        }

        if (!me.team || me.team[0] === me) {
            WORLD.COMMANDS['ex'].on_enter_fb(me, next_room);
        }
    }
    me.send('{type:"dialog",dialog:"jh",close:true}');

    me.set_temp("enter_room", me.environment.path);


    if (me.moveto(next_room, me.name + "离开了。", me.name + "走了进来。")) {

        if (me.team) {
            me.notify("<hic>你已进入组队副本，在副本中退出游戏，退出队伍，完成副本都会离开当前副本，当前队伍所有人都离开副本后才可以重新进入。</hic>");

        }
    }


}
function fb_over(me) {
    var area = me.environment.parent;
    if (!me.environment || !me.environment.is_fb()) return;
    var score = me.query_fbscore();
    var max_score = area.score || 100;
    var max_exp = area.query_exp();
    var p = parseInt(score * 100 / max_score);
    if (p <= 0) p = 0;
    if (p > 100) p = 100;
    var exp = max_exp * p / 100;
    var pot = max_exp * p / 100;

    var fb = me.environment;
    var diff = fb.query_temp("diff", undefined, me) || 0;
    if (me.moveto(me.query_temp("enter_room"), me.name + "离开了副本。", me.name + "走了过来。") != false) {

        if (me.team && me.environment.parent.id !== 'home') {
            for (let i = 0; i < me.team.length; i++) {
                if (!me.team[i].is_player && me.team[i].master === me.id &&
                    me.team[i].environment && me.team[i].environment.parent.id !== 'home') {
                    me.team[i].end_fight();
                    if (me.team[i].hp < 1) me.team[i].hp = 1;
                    me.team[i].moveto(me.query_home());
                    me.send(me.team[i].name + "回家了。");
                }
            }
        }
        fb.clear_copy(me);
        me.add_temp("fb_count", 1);
        me.add_temp("fb_count_day", 1, UTIL.diff_time());
        var unlock = me.query_temp("fb", 0);
        if (p >= 100) {
            let is_first_k = false;
            if (fb.parent.unlock_index) {
                if (!me.team && diff === 0) {
                    if (!me.query_temp("fb_sao" + fb.parent.fb_index, 0)) {
                        me.notify("<hic>单人(普通)模式扫荡解锁。</hic>");
                        me.set_temp("fb_sao" + fb.parent.fb_index, 1);
                        is_first_k = true;
                    }
                } else if (!me.team && diff === 1) {
                    if (!me.query_temp("fb_sao" + fb.parent.fb_index, 0)) {
                        me.notify("<hic>单人(困难)模式扫荡解锁。</hic>");
                        me.set_temp("fb_sao" + fb.parent.fb_index, 2);
                        is_first_k = true;
                    }
                }
            } else {
                if (unlock === fb.parent.fb_index) {
                    me.set_temp("fb", unlock + 1);
                    me.notify("<hig>完成度100%，解锁下个副本。</hig>");
                    me.send('{type:"dialog",dialog:"jh",unlock:' + (unlock + 1) + '}');
                    is_first_k = true;
                }
                if (!me.team && diff === 0) {
                    if (me.query_temp("fb_sao0", 0) <= fb.parent.fb_index) {
                        me.notify("<hic>单人(普通)模式扫荡解锁。</hic>");

                        me.set_temp("fb_sao0", fb.parent.fb_index + 1);
                        is_first_k = true;
                    }

                } else if (!me.team && diff === 1) {
                    if (me.query_temp("fb_sao1", 0) <= fb.parent.fb_index) {
                        me.notify("<hic>单人(困难)模式扫荡解锁。</hic>");
                        me.set_temp("fb_sao1", fb.parent.fb_index + 1);
                        is_first_k = true;
                    }
                }
            }

            if (is_first_k)
                fb_first_check(me, fb, area, diff);


        } else {
            me.notify("完成度未满100%，未能解锁下个副本。");
        }
        me.add_exp(exp, pot);
        if ((!me.team || me.team[0] === me) && me.query_temp('fbbs', 0) === 1) {
            me.remove_temp('fbbs');
        }
        if (diff != 2) {
            if (me.follow_targets && me.follow_targets.length) {
                me.follow_targets.length = 0;
            }
        }
        if (!me.team && fb.parent.is_record(diff)) {
            me.add_temp("fbc_" + diff + "_" + fb.parent.fb_index, 1);
        }

        if (me.team && me.team.length == 2 && me.query_temp("tudi")) {
            if (me.query_temp("st_count", 0) >= 10) {
                return;
            }
            var next = me.team[0] == me ? me.team[1] : me.team[0];
            if (next.environment && next.environment.parent == fb.parent) {
                if (next.id == me.query_temp("tudi") && me.id == next.query_temp("shifu")) {
                    if (next.query_temp("fb") >= fb.parent.fb_index) {
                        var count = me.add_temp("st_count", 1, UTIL.diff_week_time());

                        me.send_team("<hic>你们师徒合力完成一次组队副本，获得额外收益，目前次数" + count + "(每周10次)。</hic>");
                        me.add_exp(exp * 10, pot * 10);
                        next.add_exp(exp * 10, pot * 10);
                    }
                }
            }
        }
    } else {
        me.notify("你现在还不能离开副本。");
    }
}
function fb_first_check(me, fb, area, diff) {
    if (me.family === FAMILIES.NONE && !me.query_temp('sr')) {
        return;//无门无派的非长期散人不参与
    }
    if (!WORLD.is_server(me)) return;

    const fblock = fb.parent.fb_index + 1;
    const famkey = me.family.id;
    const fb_key = "fb_first_" + fblock + "_" + diff;//存全服第一个通过
    let fb_fam_key = "fb_first_" + famkey + "_" + fblock + "_" + diff; //每个门派的
    if (diff === 2) fb_fam_key = fb_key;
    if (WORLD.DATA.query_temp(fb_fam_key)) return;//这个门派已经拿过了
    var fb_key2 = "fb_first_" + fblock;
    var ss_users = WORLD.DATA.query_temp(fb_key2);
    var teams = me.team || [me];
    if (ss_users) {
        for (var i = 0; i < teams.length; i++) {
            if (ss_users.indexOf(teams[i].id) !== -1) {
                return;//存在任意一个位置就算重复
            }
        }
    }

    const fb_name = area.name + "(" + ["普通", "困难", "组队"][diff] + ")";
    let isfirst = false;
    if (!WORLD.DATA.query_temp(fb_key)) {
        const user_name = me.team ? team_name(me.team) : me.name;
        WORLD.DATA.set_temp(fb_key, user_name);
        COMMAND.DO("rumor", "听说" + user_name + "首次通过了" + fb_name + "区域。");
        isfirst = true;
    }
    if (diff < 2) {
        WORLD.DATA.set_temp(fb_fam_key, me.name);
        if (!isfirst)
            COMMAND.DO("rumor", "听说" + me.family.name + me.name + "首次通过了" + fb_name + "区域。");
    }
    if (area.ss_title && !me.team) {
        if ((diff == 0 && !area.is_diffi) || (diff == 1 && area.is_diffi)) {
            me.add_title(area.ss_title, "fb_" + fb.parent.fb_index);
            me.send("<hig>你获得了称号【" + area.ss_title + "】。</hig>");
        }
    }
    if (area.is_show && WORLD.DATA.query_temp("fb_index", 0) < fb.parent.fb_index) {
        WORLD.DATA.set_temp("fb_index", fb.parent.fb_index);
    }
    let ss_userids = WORLD.DATA.query_temp(fb_key2, "");
    let msg = "<hio>恭喜你完成副本" + fb_name + "的首杀！</hio>";
    if (diff < 2) msg = "<hio>恭喜你做为" + me.family.name + "弟子首次通过了副本" + fb_name + "！</hio>";
    for (var i = 0; i < teams.length; i++) {
        if (!teams[i].is_player) continue;
        teams[i].send(msg);
        ss_userids += teams[i].id + ",";
    }
    WORLD.DATA.set_temp(fb_key2, ss_userids);
    fb.parent.notify_update();
}
function team_name(tms) {
    var str = [];
    for (var i = 0; i < tms.length; i++) {
        str.push(tms[i].name);
    }
    return str.join("，");
}
function fb_confirm_over(me) {
    var area = me.environment.parent;
    var score = me.query_fbscore();
    var max_score = area.score || 100;
    var p = parseInt(score * 100 / max_score);
    if (p <= 0) p = 0;
    if (p > 100) p = 100;

    var exp = 1200;
    var str = ["当前副本："];
    str.push(area.name);
    if (exp > 0) {
        str.push("\n将获得经验：");
        str.push(exp);
        str.push("，潜能：");
        str.push(exp);
    }
    str.push("\n完成度：");
    if (p < 30) {
        str.push(p);
        str.push("%\n");
    } else if (p < 60) {
        str.push("<hig>");
        str.push(p);
        str.push("%</hig>\n");
    } else if (p < 80) {
        str.push("<hic>");
        str.push(p);
        str.push("%</hic>\n");
    } else if (p < 100) {
        str.push("<hiy>");
        str.push(p);
        str.push("%</hiy>\n");
    } else {
        p = 100;
        str.push("<hiz>");
        str.push(p);
        str.push("%</hiz>\n");
    }
    me.notify(str.join(""));
    me.send_commands("cr over", "领取奖励并离开副本");
}
