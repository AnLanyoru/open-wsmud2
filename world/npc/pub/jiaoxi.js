import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "武馆教习";
    desc = "一个高大威猛的汉子，负责教导武馆新人基本功法";
    gender = 1;
    age = 25;
    per = this.random(20) + 10;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;
    family = FAMILIES.NONE;

    constructor() {
        super();
        this.skill_map(
            ["force", 300],
            ["dodge", 300],
            ["parry", 300],
            ["sword", 300],
            ["blade", 300],
            ["club", 300],
            ["staff", 300],
            ["whip", 300],
            ["unarmed", 300],
            ["throwing", 300]);
    }

    on_checkskill(me) {
    if (!me.query_temp("wg_sr")) {
        me.send_room("武馆教习瞄了$N一眼：100两白银，先交钱再学功夫，包教包会。");

        return me.notify_fail('{type:"cmds",items:{cmd:"give ' + this.id + ' 10000 money",name:"交报名费"}}');
    }
    return true;
}
    on_teach(me) {
    return me.query_temp("wg_sr") == 1;
}
    on_accept(me, obj, count) {
    if (obj != "money") return false;
    if (me.query_temp("wg_sr")) {
        me.notify("武馆教习愉快笑了笑，收下你的钱。");
        return true;
    }
    if (count < 10000) return me.notify_fail("武馆教习瞪了你一眼：100两白银，不二价，没钱就一边玩去。");
    me.send_room("武馆教习收下$N的钱，拍了拍$N的肩膀：不错，以后你就是本馆的弟子了，本武馆包教基本武技到300级，随到随学，不限学时，全国连锁。");
    me.set_temp("wg_sr", 1);

    if (!me.query_temp("sm_tm")) {
        me.set_temp("sm_tm", Math.floor(Date.now() / 100000));
    }
    return true;
}
}

const FAMILIES = globalThis.FAMILIES;
