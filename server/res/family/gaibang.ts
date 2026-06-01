import { FAMILY } from "../../core/skill/family.js";

export default class extends FAMILY {
    id = "GAIBANG";
    name = "丐帮";
    top_name = "丐帮首席弟子";
    boss_path = "gaibang/hongqigong";
    top_family = "墨门";
    can_battle = true;
    def_npcs = [["pub/mpguanli#GAIBANG", "gaibang/andao2"],
["gaibang/lu", "gaibang/andao4"],
["pub/dadizi#GAIBANG", "gaibang/mishi"],
["gaibang/jian", "gaibang/pomiao"],
["gaibang/zuo", "gaibang/shudongxia"],
["gaibang/hongqigong", "gaibang/xiaowu"]];
    boss_guard = ["gaibang/xiaowu", "gaibang/andao4", "gaibang/andao3"];
    guard_rooms = ['gaibang/pomiao', 'gaibang/mishi', 'gaibang/andao2'];
    eqs = [

];
    npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["club", 800],
    ["huntianqigong", 800, "force"],
    ["xiaoyaoyou", 800, "dodge"],
    ["dagoubang", 800, "club"],
    ["xianglongzhang", 800, ["unarmed", "parry"]]];
    boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["club", 800],
    ["huntianqigong2", 800, "force"],
    ["xiaoyaoyou", 800, "dodge"],
    ["dagoubang2", 800, "club"],
    ["xianglongzhang2", 800, ["unarmed", "parry"]]];
    boss_skills2 = [
    ["dodge", 5000],
    ["parry", 5000],
    ["force", 5000],
    ["unarmed", 5000],
    ["club", 5000],
    ["huntianqigong2", 5000, "force"],
    ["xiaoyaoyou", 5000, "dodge"],
    ["dagoubang2", 5000, "club"],
    ["xianglongzhang3", 5000, ["unarmed", "parry"]]];

    constructor() {
        super();
        this.set_titles("丐帮帮主", "丐帮副帮主", "丐帮九袋长老", "丐帮八袋弟子", "丐帮七袋弟子", "丐帮六袋弟子");
    }

    call(player, isbad) {
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
    call_me(player, isbad) {
    var age = player.query_age();
    if (player.gender == 2) {
        if (age < 30) return isbad ? "本姑娘" : "小女子";
        else return isbad ? "老娘" : "妾身";
    } else {
        if (age < 50) return isbad ? "大爷我" : "在下";
        else return isbad ? "老子" : "老头子";
    }
}
    on_kill(npc, me) {
    if (this.boss) {
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀我派弟子" + npc.name + "，丐帮众弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}
    on_battle(fam) {
    if (this.boss) {
        this.boss.do_command("chat", "哈哈，" + fam.boss.call() + "且慢！");
    }
}
}
