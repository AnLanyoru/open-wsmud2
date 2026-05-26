this.inherits(OBJ);
this.unit = "盘";
this.name = "米饭";
this.value = 200;
this.combined = true;
this.desc = "一碗热气腾腾的白米饭，吃掉后每5秒恢复100点气血。";
this.action_msg = "吃";
this.distime = 60000;
this.allow_fight = true;
this.distype = "buff";
this.transable = true;
this.on_use = function (me) {
    if (this.grade < 3) {
        var pname = ["fy_per", "zj_per", "gj_per",
            "ds_per", "mz_per", "add_sh_per",
            "diff_downside_per", "lianxi_per", "study_per", "dazuo_per", "add_bjsh_per",
            "diff_bj", "lianyao1", "releasetime_per", "gjsd_per", "hp_per"].random();
        var prop = {};
        prop[pname] = 5 + this.grade * 5;
        me.add_status({
            id: "food",
            name: "宴席",
            desc: "你吃下了一份大餐",
            prop: prop,
            duration: 60000 * 20
        });
        me.send_room("$N吃下一" + this.unit + this.color_name + "。");
    } else if (this.grade == 3) {
        if (me.max_hp <= me.hp) return me.notify_fail('你目前气血充沛，用不着恢复。');
        var hp = me.add_hp(parseInt(me.max_hp * 50 / 100));
        hp = hp || 0;
        me.send_room("$N吃下一" + this.unit + this.color_name + "。");
        me.notify("<hig>你恢复了" + hp + "气血。</hig>")
    } else if (this.grade == 4) {
        if (me.max_hp <= me.hp) return me.notify_fail('你目前气血充沛，用不着恢复。');
        var hp = me.add_hp(parseInt(me.max_hp * 80 / 100));
        hp = hp || 0;
        me.send_room("$N吃下一" + this.unit + this.color_name + "。");
        me.notify("<hig>你恢复了" + hp + "气血。</hig>")
    } else {
        me.add_temp("ad_jl", 100);
        me.send_room("$N吃下一" + this.unit + this.color_name + "。");
        me.notify("<hiy>你增加了100点精力。</hiy>");
    }
}
this.on_create = function (path, par) {
    var lv = 0;

    if (par) {
        lv = parseInt(par.substr(1));
        if (!(lv > 0 && lv < 15)) lv = 0;
    }
    this.grade = parseInt(lv / 3) + 1;
    this.level = lv;
    this.name = ["蜜饯青梅", "红梅珠香", "碧螺春卷",
        "乌龙吐珠", "蝴蝶暇卷", "沙舟踏翠",
        "山珍刺龙芽", "佛手金卷", "金丝酥雀",
        "瑶柱玉女", "凤凰展翅", "凤尾鱼翅",
        "龙凤呈祥", "花开富贵", "祥龙双飞"][lv];
    this.desc = "这是一道醉仙楼的名菜：" + this.name + "，";
    this.name = "喜宴：" + this.name;
    if (this.grade < 3) {
        this.desc += "据说吃了后有不少好处。";
        // this.distype = "buff";
    }
    else if (this.grade < 5) {
        this.desc += "吃了后会恢复你大量气血。";
        this.distype = "hp";
    }
    else if (this.grade == 5) {
        this.desc += "吃了后会恢复你大量精力。";
        this.distype = null;
    }
    this.value = this.grade * 1000;
}
