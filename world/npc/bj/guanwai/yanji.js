import { NPC } from "../../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "阎基",
    desc: "他是一个没落江湖医生。自从得了胡家刀谱几页残篇后，武功大进。",
    title:"江湖医生",
    gender: 1,
    age: 45,
    per: 26,
    mp: 400,
    max_mp: 4000,
    hp: 12500,
    max_hp: 15500,
    score: 20,
    prop: {
        gj: 500,
        mz: 600,
        ds: 600,
        fy: 900
    }
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
], [
        "eq/lv0/dao", 1, 1
]);
this.skill_map(
    ["dodge", 500],
    ["parry", 400],
    ["force", 400],
    ["unarmed", 400],
    ["parry", 300],
    ["blade", 400],
    ["sixiangbu", 400, "dodge"],
    ["hujiadaofa", 400, "blade"],
    ["lengyueshengong", 400, "force"]);

this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 30
}, {
        obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
        odds: 8000
    }, {
        obj: ["book/bc#hujiadaofa", "sp/bj/yanji"],
        odds: 3000
});
}
