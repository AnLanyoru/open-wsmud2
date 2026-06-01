import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "吴六奇";
    desc = "这个老叫花，便是天下闻名的“铁丐”吴六奇，向来嫉恶如仇。他在官居广东提督之时，手握一省重兵，受了查伊璜的劝导，心存反清复明之志，暗入天地会，任职洪顺堂香主。";
    title = "铁丐";
    gender = 1;
    age = 55;
    per = 22;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["houquan", 250, "unarmed"],
            ["yunlongshenfa", 200, "dodge"],
            ["yunlongxinfa", 200, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        },
            {
                obj: ["book/bc#houquan"],
                odds: 5000
            });
    }

    on_enter(me) {
    me.notify("吴六奇对你喝到：你不是我天地会的人，来这里做什么？");
    this.do_kill(me);
}
}
