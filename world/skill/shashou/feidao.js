import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "飞刀";
this.id = "feidao";
this.grade = 1;

this.family = FAMILIES.SHASHOU;

this.desc = "杀手楼的入门暗器武功";
//<$1>$2</$1>
//<$1>$2</$1>
this.can_enables = ["throwing"];
this.learn_condition = {
    max_mp: 200,
    skill: {
        throwing: 100
    }
};

this.query_enable_prop = function (lv) {
    return {
        throwing: {
            gj: parseInt(lv * 1.1) + 4
        }
    };
}
this.pfm = {
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
}
