import { FAMILY } from "../../os/skill/family.js";

export default function() {
    const UTIL = globalThis.UTIL;
this.inherits(FAMILY);

this.id = "SHAOLIN";
this.name = "少林派";
this.gender = 1;
this.top_name = "少林派大师兄";
this.top_family = "佛门";
this.can_battle = true;
this.def_npcs = [["shaolin/huihe", "shaolin/banruo"],
["shaolin/xuannan", "shaolin/fangzhang"],
["shaolin/qingle", "shaolin/guangchang"],
["pub/dadizi#SHAOLIN", "shaolin/lianwu"],
["shaolin/chengjing", "shaolin/luohan"],
["pub/mpguanli#SHAOLIN", "shaolin/shanmen"],
["shaolin/daojue", "shaolin/twdian"]];
this.call = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 18) return isbad ? "小贼尼" : "小师太";
        else return isbad ? "贼尼" : "师太";
    } else {
        if (age < 20) return isbad ? "死秃驴" : "小师父";
        else return isbad ? "老秃驴" : "大师";
    }
}
this.call_me = function (player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 30) return "贫尼";
        else return "老尼";
    } else {
        if (age < 50) return isbad ? "和尚我" : "贫僧";
        else return isbad ? "老和尚我" : "老衲";
    }

}
this.set_titles("少林掌门", "少林派第三十五代弟子", "少林派第三十六代弟子",
    "少林派第三十七代弟子", "少林派第三十八代弟子",
    "少林派第三十九代弟子", "少林派第四十代弟子", "少林派第四十一代弟子");
this.boss_path = "shaolin/xuannan";
this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", "阿弥陀佛！" + me.family.name + "门下弟子" + me.name + "击杀我派弟子" + npc.name + "，众弟子听令，对" + me.family.name + "格杀勿论！");
    }
}

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", "阿弥陀佛！");
    }
}
this.boss_guard = ["shaolin/fangzhang", "shaolin/lianwu", "shaolin/houdian"];

this.guard_rooms = ['shaolin/daxiong', 'shaolin/gulou', 'shaolin/zhonglou',
    'shaolin/liangong2'];
this.create_name = function (npc) {
    return ["", "", "", "玄", "橙", "慧", "道", "清"][npc.family_level] + UTIL.name2[this.random(UTIL.name2.length)];
}
this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["club", 800],
    ["blade", 800],
    ["hunyuanyiqi", 800],
    ["literate", 800],
    ["jingangquan", 800, "parry"],
    ["yijinjing", 800, "force"],
    ["ranmudao", 800, "blade"],
    ["shaolinshenfa", 800, "dodge"],
    ["yizhichan", 800, "unarmed"]];
this.boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["club", 800],
    ["blade", 800],
    ["hunyuanyiqi", 800],
    ["literate", 800],
    ["jingangquan", 800, "parry"],
    ["yijinjing2", 800, "force"],
    ["ranmudao2", 800, "blade"],
    ["shaolinshenfa", 800, "dodge"],
    ["yizhichan2", 800, "unarmed"]];
this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["blade", 5000],
    ["yijinjing2", 5000, "force"],
    ["ranmudao3", 5000, ["blade", "parry"]],
    ["shaolinshenfa2", 5000, "dodge"],
    ["yizhichan2", 5000, "unarmed"]];
}
