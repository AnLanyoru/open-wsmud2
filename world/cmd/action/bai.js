this.inherits(COMMAND);
this.command = "bai";
this.enter = function (me, target) {
    if (!WORLD.is_server(me)) return me.notify("你不能拜师。");
    if (!target) return me.notify("你要拜谁为师？");
    target = me.find_obj(target, me.environment);
    if (!target || !target.call3) return me.notify("你要拜谁为师？");
    if (!target.family || target.family == FAMILIES.NONE)
        return me.notify(target.name + "无门无派，你不能拜" + target.call3() + "为师。");
    if (me.query_temp("master") == target.path) {
        return me.send_room("$N恭恭敬敬的向$n磕头请安,叫道：「师父！」", target);
    }
    me.send_room("$N想拜$n为师。\n", target);
    if (target.on_before_master && target.on_before_master(me) === false)
        return;

    if (me.family != FAMILIES.NONE) {
        if (me.family == target.family) {
            var level = me.query_temp("family_level");
            if (level < target.family_level) {
                return me.send_room("$n笑着对$N说：师叔不要开玩笑了。", target);
            }
            else if (level == target.family_level) {
                return me.send_room("$n笑着对$N说：" + (me.gender === 1 ? "师弟" : "师妹") + "不要开玩笑了。", target);
            }
        } else {
            return me.send_room("$n对$N说：" + me.call() + "既然已有名师指点，何必再来拜" + target.callme() + "。", target);
        }
    }
    if (target.on_master) {
        if (target.on_master(me) == false) {
            return;
        }
        let is_reset = me.family === FAMILIES.NONE;
        me.family = target.family;
        var lv = (target.family_level || 0) + 1;

        var title = me.family.query_title(lv);
        me.add_title(title, "family");
        me.set_temp("master", target.path);
        me.set_temp("family", target.family.id);
        me.set_temp("family_level", lv);
        if (!me.query_temp("sm_tm")) {
            me.set_temp("sm_tm", Math.floor(Date.now() / 100000));
        }
        me.remove_temp('sr');
        if (is_reset)
            WORLD.DATA.reset_famtops(me, FAMILIES.NONE);
        me.send_room("<HIG>$n说道：好吧，" + target.callme() + "就收下你了。</HIG>\n$n决定收$N为弟子。\n$N跪下来向$n恭恭敬敬的磕了四个响头,叫道：「师父！」", target);
        return me.notify("<hic>恭喜你成为" + title + "，师门将持续向你发放物资(任务栏领取)。</hic>\n");


    }
    return me.send_room("$n说道：在下才疏学浅，不敢误人子弟。", target);
}