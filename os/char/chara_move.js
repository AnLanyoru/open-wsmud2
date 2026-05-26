

CHARACTER.prototype.moveto = function (rm, leave_msg, in_msg, dir) {
    var cur_room = this.environment;
    var next_room = rm;
    if (typeof rm === "string") {
        next_room = ROOM.Get(rm);
        if (!next_room) return false;
        if (next_room.parent === cur_room.parent) {
            if (cur_room.owner) {
                next_room = next_room.query_copy(cur_room.owner);
            }
        } else {
            var my_room = next_room.query_copy2(this);
            if (my_room) {
                next_room = my_room;
            }
        }
    }
    if (!next_room) return false;

    if (next_room.is_full()) {
        //如果房间人数过多，创建投影
        next_room = next_room.create_shadow();
        if (!next_room) {
            //如果创建失败就返回，房间设置不允许投影，或别的原因
            return this.notify("那里人太多了，你过不去。");
        }
    }
    if (cur_room) {
        if (cur_room.do_leave(this, dir, leave_msg) === false) {
            return false;
        }
    }

    next_room.do_enter(this, true, in_msg);
    this.notify_follower(dir);
    if (cur_room && next_room.parent !== cur_room.parent) {
        cur_room.parent.on_leaved(this);
    }
}
CHARACTER.prototype.do_follow = function (target) {
    if (target) {
        if (target.query_setting("no_follow")) {
            return this.notify(target.name + "不允许别人跟随。");
        }
        if (this.follow_target) {
            this.follow_target.follow_targets.remove(this);
            this.send_room("$N不再跟随$n一起行动。", this.follow_target);
        }
        this.follow_target = target;
        if (!target.follow_targets) {
            target.follow_targets = [];
        }
        target.follow_targets.push(this);
        this.send_room("<hig>$N决定跟随$n一起行动。</hig>", target);
    } else {
        if (!this.follow_target) return this.notify("你目前没有跟随别人一起行动。");
        this.follow_target.follow_targets.remove(this);
        this.send_room("$N不再跟随$n一起行动。", this.follow_target);
        this.follow_target = null;
    }
}
CHARACTER.prototype.clear_follow = function () {
    if (this.follow_target) {
        this.follow_target.follow_targets.remove(this);
        this.follow_target = null;
    }
    if (this.follow_targets) {
        for (let item of this.follow_targets) {
            item.follow_target = null;
        }
        this.follow_targets = null;
    }
}

CHARACTER.prototype.notify_follower = function (dir) {
    if (this.follow_targets) {
        for (var i = 0; i < this.follow_targets.length; i++) {
            var item = this.follow_targets[i];
            if (!item.environment) continue;
            if (!item.is_player) {
                if (item.on_master_leave) {
                    if (item.on_master_leave(this, this.environment) == false) {
                        continue;
                    }
                } else {
                    if (item.environment.is_fb() != this.environment.is_fb()) {
                        continue;
                    }
                }
                //if (item.state && item.set_state) {
                //    item.set_state(null);
                //}
                item.moveto(this.environment,
                    sendOutMessage(item, dir), sendInMessage(item));
            } else {
                item.moveto(this.environment,
                    sendOutMessage(item, dir), sendInMessage(item));
            }
        }
    }
}

CHARACTER.prototype.do_escape = function () {
    var eny = this.query_enemy();
    if (!eny) return true;
    if (eny.on_escape) return eny.on_escape(this);
    var is_esc = this.random(this.ds / 2) + this.ds > eny.mz;
    if (eny.is_faint) is_esc = true;
    if (!is_esc) {
        this.send_room("<cyn>$N转身想跑，$n一把拦住$P：想跑？没门！\n</cyn>", eny);
        this.add_status({
            id: "busy",
            name: "忙乱",
            duration: this.gjsd,
            is_busy: true
        });
    }
    return is_esc;
}


CHARACTER.prototype.team_out = function (msg) {
    var tm = this.team;
    if (!tm) return;
    for (var i = 0; i < tm.length; i++) {
        if (!tm[i].is_player && tm[i].master == this.id) {
            tm[i].on_teamout && tm[i].on_teamout();
            this.notify(tm[i].name + "退出了队伍。");
            tm[i].team = null;
            tm.splice(i, 1);
            i--;
        }
    }
    this.team = null;
    var iscap = this == tm[0];
    tm.remove(this);
    checkTeamfb(this);
    if (!tm.length) {
        this.send("你的队伍解散了。");
        this.send('{"type":"dialog","dialog":"team",dismiss:true}');
    } else {
        var first = tm[0];
        var dissmsg = '{"type":"dialog","dialog":"team",dismiss:true}';
        this.send("<hic>你退出了队伍。</hic>");


        if (tm.length > 1) {
            if (iscap) {
                first.send_team("<hic>" + this.name + msg + "，" + first.name + "现在是队长。</hic>");
            } else {
                first.send_team("<hic>" + this.name + msg + "。</hic>");
            }
            first.send_team('{"type":"dialog","dialog":"team",remove:"' + this.id + '"}');
            this.send(dissmsg);
        } else {
            if (first.team) {
                checkTeamfb(first);
                first.send("<hic>" + this.name + msg + "，你的队伍解散了。</hic>");
                first.team.length = 0;
                first.team = null;
                first.send(dissmsg);
                this.send(dissmsg);
            }
        }

    }
}