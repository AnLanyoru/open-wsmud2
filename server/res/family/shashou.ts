import { FAMILY } from "../../core/skill/family.js";

export default class extends FAMILY {
    id = "SHASHOU";
    boss_path = "shashou/wu";
    name = "杀手楼";
    top_name = "金牌杀手";
    def_npcs = [["shashou/shashou", "shashou/damen"],
["shashou/her", "shashou/datang"],
["pub/dadizi#SHASHOU", "shashou/liangong"],
["shashou/wu", "shashou/shufang"],
["pub/mpguanli#SHASHOU", "shashou/xiuxi"],
["shashou/lisi", "shashou/yinlou"]];
    boss_guard = ["shashou/shufang", "shashou/xiaolu2", "shashou/xiaolu"];
    npc_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["literate", 800],
    ["wudangxinfa", 800],
    ["wudangjianfa", 800],
    ["wudangchangquan", 800],
    ["taijishengong", 800, "force"],
    ["tiyunzong", 800, "dodge"],
    ["taijijian", 800, "sword"],
    ["taijiquan", 800, ["unarmed", "parry"]]];
    boss_skills = [
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["taijishengong2", 800, "force"],
    ["tiyunzong2", 800, "dodge"],
    ["taijijian3", 5000, "sword"],
    ["taijishengong2", 800, "force"],
    ["tiyunzong2", 800, "dodge"],
    ["taijiquan3", 5000, ["unarmed", "parry"]]];

    constructor() {
        super();
        this.set_titles("杀手楼主", "金牌杀手", "银牌杀手", "铜牌杀手", "见习杀手");
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
        this.boss.do_command("chat", me.family.name + "门下弟子" + me.name + "击杀我派弟子" + npc.name + "，杀手楼众弟子听令，对" + me.family.name + "弟子格杀勿论！");
    }
}
    on_battle(fam) {
    if (this.boss) {
        this.boss.do_command("chat", "奉陪到底");
    }
}
    create_event(fam) {
    return {
        id: this.id + "_bat",
        name: "门派战争",
        desc: "你的门派正在进攻" + fam.name + "，击杀对方弟子会获得丰厚奖励。",
        time: Date.now() + 30 * 60000,
        grade: 2,
        command: "进入战场",
        check: (me) => me.family === this,
        on_command: function (me) {
            me.do_command('goto', 'fam3 ' + fam.id);
        }
    }
}
    finish_event(suc, target_fam) {
    let msg = suc > 0 ?
        "杀手楼在门派战斗中帮客户占得优势，所有弟子获得鼓舞，练功效率+" + suc
        + "%。" : "杀手楼在门派战斗中没有帮助客户取得优势。";
    return {
        id: this.id + "_settle",
        name: "门派战争",
        desc: msg,
        time: this.temp?.["battle"]?.e,
        grade: 2,
        command: "领取战利品",
        check: (me) => me.family === this,
        on_command: (me) => {
            this.battle_settle?.(me, suc, target_fam)
        }
    }
}
}
