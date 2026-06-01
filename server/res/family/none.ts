import { FAMILY } from "../../core/skill/family.js";

export default class extends FAMILY {
    id = "NONE";
    name = "无门无派";
    top_name = "武馆大弟子";
    top_family = "道门";

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
    query_task_title(me) {
    let level = me.query_temp('sm_level', 0);
    return "武馆" + TITLES[level];
}
    query_job_title(level) {
    return TITLES[level];
}
}

const TITLES = ['打杂', '弟子', '教习', '护法', '长老', '供奉'];
