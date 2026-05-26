this.inherits(FAMILY);

this.id = "HUASHAN";
this.name = "华山派";
this.top_name = "华山派首席弟子";
this.top_family = "剑门";
this.can_battle = true;
this.def_npcs = [["huashan/yuebuqun", "huashan/keting"],
["pub/dadizi#HUASHAN", "huashan/lianwu"],
["pub/mpguanli#HUASHAN", "huashan/lianwu"],
["huashan/fengqingyang", "huashan/luoyan"],
["huashan/fengbuping", "huashan/xiaowu"],
["huashan/gaogenming", "huashan/zhenyue"]];
this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 18) return isbad ? "小贱人" : "小姑娘";
        else if (age < 50) return isbad ? "贱人" : "姑娘";
        else return isbad ? "死老太婆" : "婆婆";
    } else {
        if (age < 20) return isbad ? "小王八蛋" : "小兄弟";
        else if (age < 50) return isbad ? "臭贼" : "壮士";
        else return isbad ? "老匹夫" : "老爷子";
    }
}
this.call_me = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 30) return isbad ? "本姑娘" : "小女子";
        else return isbad ? "老娘" : "妾身";
    } else {
        if (age < 50) return isbad ? "大爷我" : "在下";
        else return isbad ? "老子" : "老头子";
    }
}
this.set_titles("华山派长老", "华山派第十三代弟子", "华山派第十四代弟子", "华山派第十五代弟子", "华山派第十六代弟子");
this.boss_path = "huashan/yuebuqun";
this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "欺人太甚，门下弟子" + me.name + "击杀我派弟子" + npc.name + "，华山派众弟子听令，对" + me.family.name + "格杀勿论！");
    }
}

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", fam.boss.call() + "别冲动，这其中是不是有什么误会？");
    }
}

this.boss_guard = ["huashan/keting", "huashan/lianwu", "huashan/yunv"];

this.guard_rooms = ['huashan/xiaowu', 'huashan/pingdi', 'huashan/siguoya',
    'huashan/luoyan'];

this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["dugujiujian", 800, ["sword", "parry"]],
    ["zixiashengong", 800, "force"],
    ["feiyanhuixiang", 800, "dodge"],
    ["huashanquanfa", 800, "unarmed"]];
this.boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["dugujiujian2", 800, ["sword", "parry"]],
    ["zixiashengong2", 800, "force"],
    ["feiyanhuixiang", 800, "dodge"],
    ["poyuquan2", 800, "unarmed"]];
this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["sword", 5000],
    ["literate", 5000],
    ["dugujiujian3", 5000, ["sword", "parry"]],
    ["zixiashengong2", 5000, "force"],
    ["kuangfengkuaijian2", 5000, "dodge"],
    ["poyuquan2", 5000, "unarmed"]];
this.eqs = [

];
