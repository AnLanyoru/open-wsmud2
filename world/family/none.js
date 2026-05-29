import { FAMILY } from "../../os/skill/family.js";

export default function() {
this.inherits(FAMILY);

this.id = "NONE";
this.name = "无门无派";
this.top_name = "武馆大弟子";
this.top_family = "道门";
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




const TITLES = ['打杂', '弟子', '教习', '护法', '长老', '供奉'];

this.query_task_title = function (me) {
    let level = me.query_temp('sm_level', 0);
    return "武馆" + TITLES[level];
}

this.query_job_title = function (level) {
    return TITLES[level];
}
}
