import { FAMILY } from "../../os/skill/family.js";

export default function() {
this.inherits(FAMILY);

this.id = "EMEI";
this.name = "峨眉派";
this.top_name = "峨眉大师姐";
this.top_family = "梵门";
this.gender = 2;
this.can_battle = true;

this.def_npcs = [["emei/jingxin", "emei/dadian"],
["pub/dadizi#EMEI", "emei/guangchang"],
["emei/sumengqing", "emei/miaomen"],
["emei/miejue", "emei/qingxiu"],
["emei/zhouzhiruo", "emei/xiaowu"],
["pub/mpguanli#EMEI", "emei/zoulang2"]];

this.boss_path = "emei/miejue";
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
        else return isbad ? "老和尚我" : "老纳";
    }
}
this.set_titles("峨眉派前掌门", "峨眉派掌门", "峨眉派长老", "峨眉派第三代弟子", "峨眉派第四代弟子", "峨眉派第五代弟子", "峨眉派第六代弟子");
this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "欺人太甚，门下弟子" + me.name + "击杀我派弟子" + npc.name + "，峨眉派众弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}

this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", "哼，我峨眉派还怕了你" + fam.name + "不成？");
    }
}
this.boss_guard = ["emei/qingxiu", "emei/zoulang3", "emei/zoulang2"];

this.guard_rooms = ['emei/dadian', 'emei/huacang', 'emei/duguangtai',
    'emei/xiuxishi'];


this.npc_skills = [["dodge", 100],
["parry", 100],
["force", 100],
["unarmed", 100],
["sword", 100],
["emeixinfa", 100],
["linjizhuang", 100, "force"],
["zhutianbu", 100, "dodge"],
["huifengjian", 100],
["yitianjianfa", 100, "sword"],
["jiuyinbaiguzhao", 100, "unarmed"]];
this.boss_skills = [["dodge", 100],
["parry", 100],
["force", 100],
["unarmed", 100],
["sword", 100],
["emeixinfa", 100],
["linjizhuang2", 100, "force"],
["zhutianbu2", 100, "dodge"],
["yitianjianfa2", 100, "sword"],
["jiuyinbaiguzhao2", 100, "unarmed"]];
this.boss_skills2 = [
    ["dodge", 4000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["sword", 5000],
    ["linjizhuang2", 5000, "force"],
    ["zhutianbu3", 5000, "dodge"],
    ["yitianjianfa3", 5000, "sword"],
    ["jiuyinbaiguzhao2", 5000, "unarmed"]];
this.eqs = [

];
}
