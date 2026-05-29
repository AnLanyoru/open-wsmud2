/**
 * CHARACTER 移动/跟随系统扩展
 */

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
    "up": "上",
    "down": "下",
    "enter": "里",
    "out": "外"
};

/**
 * 生成离开房间的消息文本
 * @param {CHARACTER} player - 离开的角色
 * @param {string} dir - 方向名称
 * @returns {string}
 */
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

/**
 * 生成进入房间的消息文本
 * @param {CHARACTER} player - 进入的角色
 * @param {string} dir - 方向名称
 * @returns {string}
 */
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
    return player.name + "走了过来。";
}

Object.assign(CHARACTER.prototype, {
    /**
     * 移动到新房间
     * @param {ROOM|string} rm - 目标房间或房间路径
     * @param {string} [leave_msg] - 离开消息
     * @param {string} [in_msg] - 进入消息
     * @param {string} [dir] - 方向
     * @returns {boolean|undefined}
     */
    moveto(rm, leave_msg, in_msg, dir) {
        const cur_room = this.environment;
        let next_room = rm;
        if (typeof rm === "string") {
            next_room = ROOM.Get(rm);
            if (!next_room) return false;
            if (next_room.parent === cur_room.parent) {
                if (cur_room.owner) {
                    next_room = next_room.query_copy(cur_room.owner);
                }
            } else {
                const my_room = next_room.query_copy2(this);
                if (my_room) {
                    next_room = my_room;
                }
            }
        }
        if (!next_room) return false;

        if (next_room.is_full()) {
            next_room = next_room.create_shadow();
            if (!next_room) {
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
    },

    /**
     * 跟随目标
     * @param {CHARACTER|null} target - 目标或null停止跟随
     */
    do_follow(target) {
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
    },

    /** 清除所有跟随关系 */
    clear_follow() {
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
    },

    /**
     * 通知跟随者移动
     * @param {string} dir - 方向
     */
    notify_follower(dir) {
        if (this.follow_targets) {
            for (let i = 0; i < this.follow_targets.length; i++) {
                const item = this.follow_targets[i];
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
                    item.moveto(this.environment,
                        sendOutMessage(item, dir), sendInMessage(item));
                } else {
                    item.moveto(this.environment,
                        sendOutMessage(item, dir), sendInMessage(item));
                }
            }
        }
    },

    /**
     * 尝试逃跑
     * @returns {boolean}
     */
    do_escape() {
        const eny = this.query_enemy();
        if (!eny) return true;
        if (eny.on_escape) return eny.on_escape(this);
        let is_esc = this.random(this.ds / 2) + this.ds > eny.mz;
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
    },


    /**
     * 退出队伍
     * @param {string} msg - 退出原因
     */
    team_out(msg) {
        const tm = this.team;
        if (!tm) return;
        for (let i = 0; i < tm.length; i++) {
            if (!tm[i].is_player && tm[i].master == this.id) {
                tm[i].on_teamout && tm[i].on_teamout();
                this.notify(tm[i].name + "退出了队伍。");
                tm[i].team = null;
                tm.splice(i, 1);
                i--;
            }
        }
        this.team = null;
        const iscap = this == tm[0];
        tm.remove(this);
        checkTeamfb(this);
        if (!tm.length) {
            this.send("你的队伍解散了。");
            this.send('{"type":"dialog","dialog":"team",dismiss:true}');
        } else {
            const first = tm[0];
            const dissmsg = '{"type":"dialog","dialog":"team",dismiss:true}';
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
    },
});
