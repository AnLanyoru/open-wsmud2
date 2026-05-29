import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "sx";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+)(?:\s+(\w+))?(?:\s+(\w+))?$/;

    enter(me, type, par1, par2) {
    if (type === 'greet') {
        this.do_greet(me);
    } else {
        this.do_manage(me, par1, par2);
    }
}
    do_greet(me) {
    let npc = me.family.first_npc;
    if (!npc) return me.send('首席目前不在线。');
    if (me.level > 5) return me.notify("堂堂武神大人就不要凑热闹了好吧。");
    if (npc.family != me.family) {
        return me.notify("你又不是" + npc.family.name + "弟子，凑什么热闹。");
    }
    if (WORLD.DATA.query_temp(npc.family.id + "_top") == me.id) {
        return me.notify("你自己就是" + npc.title + "，凑什么热闹。");
    }
    if (me.query_temp('qingan')) return me.notify("每天请一次安就可以了，多了会惹人烦的。");

    var user = WORLD.getUser(WORLD.DATA.query_temp(npc.family.id + "_top"));

    var userexp = npc.exp || Number.MAX_VALUE;
    if (user) userexp = user.exp;

    var ch = npc.gender == 1 ? "师兄" : "师姐";
    if (me.query_age() > npc.age) {
        ch = npc.gender == 1 ? "师弟" : "师妹";
    }
    var val = 10000 + me.level * 10000;

    me.set_temp('qingan', 1, UTIL.diff_time());
    //UTIL.add_task(me, 'qa', 1);
    if (userexp < me.exp) {
        me.send_room("$N向$n拱手道：" + npc.name + "" + ch + "好。", npc);

        // if (WORLD.is_server(me) && userexp < me.exp * 0.9) {

        //     WORLD.DATA.add_temp(fam.id + '_greetings', parseInt(val / 2));
        // }

    } else {
        me.send_room("$N向$n恭恭敬敬的一鞠躬：" + npc.name + "" + ch + "，神功盖世，千秋万代。", npc);
    }
    me.add_exp(val, val);
}
    check_power(me, npc) {
    if (npc.family != me.family) {
        return me.notify_fail("你又不是" + npc.family.name + "弟子，凑什么热闹。");
    }
    if (WORLD.DATA.query_temp(npc.family.id + "_top") !== me.id) {
        return me.notify_fail("你不是" + npc.title + "，不能更改设置。");
    }
    return true;
}
    do_manage(me, par1, par2) {
    let npc = me.family.first_npc;
    if (!npc) return me.send('你的门派还没有首席弟子。');
    if (!this.check_power(me, npc)) return;
    if (par1) {
        if (par1 === 'buff')
            return this.manage_buff(me, par2);

        if (par1 === 'battle')
            return this.manage_battle(me, par2);
    }

    me.send("你是" + npc.title + "，可以更改一些设置。");
    me.send_commands('sx manage buff', '设置增益', 'sx manage battle', '发起门派战争');
}
    manage_buff(me, par2) {
    let buff = me.family.query_temp("buff", 0);
    if (buff >= 1)
        return me.send('今天已经设置过门派增益了。');

    if (!par2) {
        me.send('你可以设置以下增益效果，持续一小时：');
        return me.send_commands('sx manage buff xue', '学习效率+20%',
            'sx manage buff lianxi', '练习效率+20%',
            'sx manage buff dazuo', '打坐效率+20%');
    }
    let msg = null;
    switch (par2) {
        case "xue":
            me.family.add_temp("study_per", 20, 3600000);
            msg = "学习效率";
            break;
        case "lianxi":
            me.family.add_temp("lianxi_per", 20, 3600000);
            msg = "练习效率";
            break;
        case "dazuo":
            me.family.add_temp("dazuo_per", 20, 3600000);
            msg = "打坐效率";
            break;
        default:
            return;
    }
    me.family.add_temp("buff", 1, UTIL.diff_time());
    me.send('<cyn>设置完成，全体门派增益效果：' + msg + '+20%</cyn>');

    me.family.send_channel(me, "已设置全体门派增益效果：" + msg + "+20%");

    if (!me.query_temp('qingan')) {
        var val = 10000 + me.level * 10000;
        me.add_exp(val, val);
        me.set_temp('qingan', 1, UTIL.diff_time());
    }
}
    manage_battle(me, par2) {
    if (me.family === FAMILIES.NONE)
        return me.send('你无门无派，要干什么？');
    if (me.family === FAMILIES.SHASHOU)
        return this.manage_battle2(me, par2);
    if (me.family.battle_family)
        return me.send('你的门派正在和' + FAMILIES[me.family.battle_family].name + "进行战争。");

    if (me.family.query_temp("sxwar", 0) > 0)
        return me.send('今天已经开启过门派战争了。');
    if (me.family.query_temp('battle')) {
        // let time = me.family.temp["battle"].e - Date.now();
        // if (time > 20 * 60000) {
        //     return me.send("你的门派刚结刚束战争，需要休养。");
        // }
        return me.send("你的门派刚结刚束战争，需要休养。");
    }
    if (!par2) {
        var str = ["{type:\"cmds\",items:["];
        for (var key of FAMS) {
            let fam = FAMILIES[key];
            if (fam === me.family || fam.battle_family || fam.query_temp('battle')) continue;
            if (str.length > 1) str.push(",");
            str.push("{cmd:\"sx manage battle ");
            str.push(key);
            str.push("\",name:\"", "向", fam.name, '宣战');
            str.push("\"}");
        }
        if (str.length == 1) {
            return me.notify("当前没有可宣战的门派。");
        }
        str.push("]}");

        me.send('选择你要进攻的门派：');
        return me.send(str.join(""));
    }
    let fam = FAMILIES[par2];
    if (!fam || fam === me.family) return me.send('你要进攻哪个门派？');
    if (fam.battle_family)
        return me.send(fam.name + '正在和' + FAMILIES[fam.battle_family].name + "进行战争。");
    if (fam.query_temp('battle'))
        return me.send(fam.name + '刚结束战斗，趁人之危非君子所为。');
    me.family.set_temp("sxwar", 1, UTIL.diff_time());
    me.family.check_battle(me, null, fam);
    me.family.send_channel(me, "所有门下弟子听令，开始进攻" + fam.name);
}
    manage_battle2(me, par2) {
    if (me.family.query_temp("sxwar", 0) >= 5)
        return me.send('杀手楼每天最多可介入5次其他门派的战争。');
    if (me.family.query_temp('battle')) {
        return me.send("你的门派正在战斗。");
    }
    if (!par2) {
        var str = ["{type:\"cmds\",items:["];
        for (var key of FAMS) {
            let fam = FAMILIES[key];
            if (fam === me.family || !fam.battle_family) continue;
            if (str.length > 1) str.push(",");
            str.push("{cmd:\"sx manage battle ");
            str.push(key);
            str.push("\",name:\"", "进攻", fam.name);
            str.push("\"}");
        }
        if (str.length == 1) {
            return me.notify("当前没有正在战斗中的门派。");
        }
        str.push("]}");

        me.send('选择你要趁乱进攻的门派：');
        return me.send(str.join(""));
    }

    let fam = FAMILIES[par2];
    if (!fam || fam === me.family) return me.send('你要进攻哪个门派？');
    if (!fam.battle_family)
        return me.send(fam.name + '没有发生战争，你无法介入 。');
    sxwar = me.family.add_temp("sxwar", 1, UTIL.diff_time());
    me.family.add_temp('battle', 1, 3600000);
    me.family.set_temp('ss_target', fam.id, 3600000);
    me.family.send_channel(me, "门下所有杀手听令，开始进攻" + fam.name);
    me.send('<cyn>已选择' + fam.name + '作为目标门派，本日已开启' + sxwar + '/5次。</cyn>');

    EVENTS.add({
        id: "SHASHOU_bat",
        name: "门派战争",
        desc: "你的门派正在进攻" + fam.name + "，击杀对方弟子会获得丰厚奖励。",
        time: fam.temp.battle.e,
        grade: 2,
        command: "进入战场",
        check: (me) => me.family === FAMILIES.SHASHOU,
        on_command: function (me) {
            me.do_command('goto', 'fam3');
        }
    });
}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
const FAMILIES = globalThis.FAMILIES;
const EVENTS = globalThis.EVENTS;
const FAMS = ['WUDANG', 'SHAOLIN', 'HUASHAN', 'EMEI', 'GAIBANG', 'XIAOYAO'];
