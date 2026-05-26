this.inherits(ROOM);
this.name = "武道塔"
this.desc = "这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道什么原因留下一些横七竖八的刀刻剑痕，你想细看却觉得眼睛被刺得发疼。";
this.exits = { "up": "wudao/up", "out": "wudao/ding" };
this.max_item_count = 1;
this.on_before_enter = function (me) {
    var level = (me.query_temp("wd_level", 0)) + 1 - 100;
    this.name = "上" + UTIL.to_c(level) + "层";
    if (level > 5) return
    var npc = NPC.CLONE("pub/wudao_boss");

    npc.die = this.on_die_boss;
    npc.init_from(me, level);

    npc.environment = this;
    this.items.length = 0;
    this.items.push(npc);
    this.refresh();
}
this.on_enter = function (me) {
    me.die = this.on_die1;
    let npc = this.items[0];
    if (npc && !npc.is_player) {
        //  me.send(npc.name + '：这位' + me.call() + "，请了。");
        me.do_kill(npc);
        npc.on_kill(me);
    }
}

this.on_die1 = function (me) {
    if (this.on_die && this.on_die(me) == false) {
        this.hp = 1;
        return false;
    }
    this.hp = this.max_hp;
    this.mp = this.max_mp;
    var npc = this.environment.find_by_path("pub/wudao");
    npc && npc.destroy();
    this.moveto('wudao/ding');
    this.notify("<hir>你的挑战失败了。</hir>");
}

this.on_die_boss = function (me) {
    me.notify("<hig>恭喜你战胜了" + this.name + "。</hig>");
    let count = me.query_temp('wd_level', 0);
    if (count > 105) {
        //塔主
        return;
    }
    count = me.add_temp('wd_level', 1);

    this.on_reward(me, count);//npc的
    const max = WORLD.DATA.query_temp("wudao_max", 0);
    if (count > max) {
        WORLD.DATA.set_temp("wudao_max", count);
        WORLD.DATA.set_temp("wudao_max_user", me.name);
        COMMAND.DO("rumor", "听说" + me.name + "战胜了" + this.name + "。");
        me.environment.parent.notify_update();
    }
    me.environment.item_changed(this, false, this.name + "离开了。");
}
this.on_reward = function (me, lv) {

}
this.on_leave = function (me, dir) {

    var npc = this.find_by_path("pub/wudao_boss");
    if (dir == "up") {
        if (npc) {
            return me.notify_fail(npc.name + "对你说道：打败我，你就可以上去。");
        }
        if (this.items.length > 1) {
            let npcs = [];
            for (let item of this.items) {
                if (!item.is_player) {
                    npcs.push(item);
                }
            }
            for (let item of npcs) {
                item.destroy();
            }
        }
        if (me.query_temp('wd_level', 0) >= 105) {
            return me.notify_fail('暂未开放。');
        }
        me.moveto('wudao/ta2');

        return false;
    } else {
        if (npc) this.items.remove(npc);
        me.die = USER.prototype.die;
    }
}

