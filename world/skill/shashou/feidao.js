import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "飞刀";
    id = "feidao";
    grade = 1;
    family = FAMILIES.SHASHOU;
    desc = "杀手楼的入门暗器武功";
    can_enables = ["throwing"];
    learn_condition = {
    max_mp: 200,
    skill: {
        throwing: 100
    }
};
    pfm = {
    jiang:
    {
        name: "又见飞刀",
        distime: 4500,
        enable_skill: "throwing",
        release_time: 1000,
        mp: 20,
        use: function (me, target, lv) {
            var msg = "<hic>$N手中$T寒光一闪，幻化出一道重影射向$n</hic>";
            me.send_room(msg, target);
            for (var i = 0; i < 2; i++) {
                me.do_attack({
                    target: target,
                    attack_msg: "",
                    gj: me.gj,
                    mz: me.mz,
                    no_append: true,
                    is_throwing: true
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            return "使用连续两把飞刀攻击敌人";
        }
    }
};

    query_enable_prop(lv) {
    return {
        throwing: {
            gj: parseInt(lv * 1.1) + 4
        }
    };
}
}

const FAMILIES = globalThis.FAMILIES;
