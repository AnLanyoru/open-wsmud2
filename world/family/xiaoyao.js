import { FAMILY } from "../../os/skill/family.js";

export default function() {
this.inherits(FAMILY);

this.id = "XIAOYAO";
this.name = "逍遥派";
this.top_name = "逍遥派首席弟子";
this.top_family = "逍遥宗";
this.can_battle = true;
this.def_npcs = [["pub/mpguanli#XIAOYAO", "xiaoyao/linjian"],
["pub/dadizi#XIAOYAO", "xiaoyao/linjian3"],
["xiaoyao/xuemuhua", "xiaoyao/muwu2"],
["xiaoyao/suxinghe", "xiaoyao/qingcaop"],
["xiaoyao/xiaoyaozi", "xiaoyao/shishi2"]];
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
this.boss_guard = ["xiaoyao/shishi2", "xiaoyao/shishi", "xiaoyao/linjian3"];

this.guard_rooms = ['xiaoyao/muwu1', 'xiaoyao/muwu2', 'xiaoyao/muwu3', "xiaoyao/liangong"];


this.set_titles("逍遥派长老", "逍遥派第一代弟子", "逍遥派第二代弟子", "逍遥派第三代弟子", "逍遥派第四代弟子");
this.npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["blade", 800],
    ["sword", 800],
    ["literate", 800],
    ["xiaoyaoxinfa", 800],
    ["beimingshengong", 800, "force"],
    ["lingboweibu", 800, "dodge"],
    ["ruyidao", 800, "blade"],
    ["zhemeishou", 800, "parry"],
    ["liuyangzhang", 800, "unarmed"]];

this.boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["blade", 800],
    ["sword", 800],
    ["xiaowuxiang2", 800, "force"],
    ["lingboweibu2", 800, "dodge"],
    ["ruyidao", 800, "blade"],
    ["zhemeishou", 800, "parry"],
    ["liuyangzhang2", 800, "unarmed"]];
this.boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["beimingshengong3", 5000, "force"],
    ["lingboweibu2", 5000, "dodge"],
    ["zhemeishou", 5000, "parry"],
    ["liuyangzhang3", 5000, "unarmed"]];

this.boss_path = "xiaoyao/xiaoyaozi";
this.on_kill = function (npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀我派弟子" + npc.name + "，逍遥派众弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}


this.on_battle = function (fam) {
    if (this.boss) {
        this.boss.do_command("chat", "...");
    }
}
}
