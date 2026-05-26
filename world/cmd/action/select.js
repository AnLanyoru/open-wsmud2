
this.inherits(COMMAND);
this.command = "select,command";
this.allow_busy = true;
this.allow_state = true;
this.enter = function (me, arg) {
    if (!me.environment) return;
    if (arg) {
        var target = me.environment.find_obj(arg);
        if (!target) {
            return me.notify("这里没有这个东西。");
        }
        me.notify(target.query_commands(me));
        if (target.hp) {
            var str = ["{type:\"cmds\",items:["];

            if (target.path && me.query_temp('yb_npc2') == target.path) {
                str.push("{cmd:\"task yunbiao ");
                str.push(target.id);
                str.push(" give\",name:\"交镖银\"}");
            }
            str.push("]}");
            if (str.length > 2) {

                me.send(str.join(''));
            }

        }
        if (me.user_level > 0 && target.is_player) {
            me.send_commands("setuser " + target.id + " chat1", "永久禁言",

                "setuser " + target.id + " chat2", "禁言24小时",
                "setuser " + target.id + " quit", "踢出游戏",
                "setuser " + target.id + " dis", "登录限制",
                "setuser " + target.id + " query", "查询信息",
                "setuser " + target.id + " reback", "开始回档");
        }

    } else {
        me.notify(me.environment.query_commands(me, true));
    }
}
this.exec = function (me, target) {
    var str = ['{type:"'];
    str.push(me == target ? 'login"' : 'select"');
    if (target) {
        str.push(',hp:');
        str.push(target.hp);
        str.push(',mp:');
        str.push(target.mp);
        str.push(',max_hp:');
        str.push(target.max_hp);
        str.push(',max_mp:');
        str.push(target.max_mp);
        str.push(',name:"');
        str.push(target.long_name());
        str.push('",level:');
        str.push(target.level);
        str.push(',id:"');
        str.push(target.id);


        str.push('",status:[');
        if (target.status) {
            for (var item in target.status) {
                str.push(target.status[item].to_json());
            }
        }
        str.push(']');
    }
    str.push('}');
    if (me != target) {
        if (me.action_target) {
            me.action_target.remove_listen(me);
        }
        me.action_target = target;
        if (target)
            me.action_target.add_listen(me);
    }
    return this.notify(str.join(""));
}
