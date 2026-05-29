import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "岳不群";
    desc = "他就是华山派的现任掌门人，江湖上人称“君子剑”的岳不群。他看上去是个和善的中年人，对人总是彬彬有礼，很有一代宗师的风范。";
    title = "华山派掌门 君子剑";
    gender = 1;
    age = 40;
    per = 33;
    max_mp = 827400;
    max_hp = 891500;
    str = 27;
    con = 27;
    dex = 27;
    int = 27;
    family = FAMILIES.HUASHAN;
    family_level = 1;
    prop = {
        gj: 4000,
        mz: 4000,
        ds: 4000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 500],
            ["parry", 500],
            ["force", 500],
            ["unarmed", 500],
            ["sword", 500],
            ["literate", 500],
            ["zixiashengong", 500, "force"],
            ["huashanjianfa", 500],
            ["huashanxinfa", 500],
            ["feiyanhuixiang", 500, "dodge"],
            ["huashanquanfa", 500],
            ["poyuquan", 500, ["unarmed", "parry"]]);
    }

    on_teach(me, sk) {
    if (!this.is(me.query_temp("master")))
        return me.notify_fail(this.name + "对你说道：请教？这怎么敢当！");

}
    on_master(me) {

    if (me.query_skill("huashanxinfa", 0) < 100) return me.notify_fail("岳不群说道：你的华山心法掌握程度还不够，需要多加练习。");
    if (me.query_skill("huashanjianfa", 0) < 100) return me.notify_fail("岳不群说道：你的华山剑法掌握程度还不够，还需多加努力。");
    return true;
}
}

const FAMILIES = globalThis.FAMILIES;
