import { NPC } from "../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "小昭",
    desc: "她因年纪幼小，身材尚未长成，但更显得娇小玲珑、甜美可爱。",
    title:"<hiw>明教圣女</hiw>",
    gender: 2,
    age: 14,
    per: 38,
    dex: 40,
    str: 15,
    int: 40,
    con: 15,
    exp: 1000000,
    pot: 1000000,
    max_mp: 2000,
    max_hp: 2000,
    level: 3,
    max_item_count: 20
});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["literate", 1000]);
this.on_master_enter = function (me) {
    if (this.random(3) == 1) {
        if(me.gender==1)
            me.notify("小昭嘻嘻一笑，对你说道：" + me.name + "哥哥，你来啦。");
        else
            me.notify("小昭嘻嘻一笑，对你说道：" + me.name + "姐姐，你来啦。");
    }
}
}
