import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "风清扬";
    desc = "他就是华山剑宗的长老风清扬。他身材瘦长，眉宇间一直笼罩着一股淡淡的忧伤神色，显然对当年的剑宗气宗之争一直难以忘怀。";
    title = "剑宗祖师";
    gender = 1;
    age = 68;
    per = 33;
    str = 27;
    con = 37;
    dex = 27;
    int = 37;
    family = FAMILIES.HUASHAN;
    family_level = 0;
    level = 3;
    max_mp = 781400;
    max_hp = 871400;
    prop = {
        gj: 8000,
        mz: 8000,
        ds: 8000
    };

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);
        this.skill_map(
            ["dodge", 800],
            ["parry", 800],
            ["force", 800],
            ["unarmed", 800],
            ["sword", 800],
            ["literate", 800],
            ["dugujiujian", 800, ["sword","parry"]],
            ["zixiashengong", 800, "force"],
            ["feiyanhuixiang", 800, "dodge"],
            ["huashanjianfa", 800],
            ["kuangfengkuaijian", 800], 
            ["poyuquan", 800, "unarmed"],
            ["huashanquanfa", 800]);
    }

    on_master(me) {

    if (me.query_skill("zixiashengong2", 0) == 0 && me.query_skill("zixiashengong", 0) < 500) return me.notify_fail("风清扬说道：你的紫霞神功掌握程度还不够，需要多加练习。");
    if (me.query_skill("zixiashengong", 0) == 0 && me.query_skill("zixiashengong2", 0) < 500) return me.notify_fail("风清扬说道：你的紫霞神功掌握程度还不够，需要多加练习。");
    if (me.query_skill("kuangfengkuaijian2", 0) == 0 && me.query_skill("kuangfengkuaijian", 0) < 500) return me.notify_fail("风清扬说道：你的狂风快剑掌握程度还不够，还需多加努力。");
    if (me.query_skill("kuangfengkuaijian", 0) == 0 && me.query_skill("kuangfengkuaijian2", 0) < 500) return me.notify_fail("风清扬说道：你的狂风快剑掌握程度还不够，还需多加努力。");
    me.notify("风清扬叹了口气说到：剑气之争又如何？");
    return true;
}
}

const FAMILIES = globalThis.FAMILIES;
