import {NPC} from "../../../core/char/npc.js";

export default class extends NPC {
    name = "守门人";
    desc = "他是武道塔的守门人，一个神神秘秘的老头";
    gender = 1;
    age = 67;
    per = 55;
    mp = 5000000;
    max_mp = 5000000;
    hp = 80000000;
    max_hp = 80000000;
    level = 5;
    pfm_rate = 1;
    prop = {
        gjsd: 20000,
        add_sh_per: 100,
        diff_sh_per: 270,
        diff_sh_per2: 100,
        diff_downside_per: 170,
        gj: 100000,
        gj_per: 100,
        diff_fy_per: 150,
        distime_per: 80,
        ds: 150000,
        ds_per: 100,
        zj: 150000,
        zj_per: 100,
        mz: 150000,
        mz_per: 100
    };
    constructor() {
        super();
        this.skill_map(
            // 全基础技能
            ["force", 5000],
            ["dodge", 5000],
            ["parry", 5000],
            ["unarmed", 5000],
            ["sword", 5000],
            ["blade", 5000],
            ["staff", 5000],
            ["club", 5000],
            ["whip", 5000],
            ["throwing", 5000],
            // 特殊技能
            ["jiuyangshengong", 5000, "force"],
            ["xuanxubu", 5000, "dodge"],
            ["qiankundanuoyi", 5000, "parry"],
            ["xianglongzhang2", 5000, "unarmed"],
            ["xuantiejianfa", 5000, "sword"],
        );}
}
