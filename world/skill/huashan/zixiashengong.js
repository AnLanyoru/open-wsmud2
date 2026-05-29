import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "紫霞神功";
this.id = "zixiashengong";
this.grade = 3;
this.force_rad = 0.6;
this.family = FAMILIES.HUASHAN;
this.desc = "华山派的内功心法，气宗的立派根本，以修炼时身上紫气环绕而得名";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["force"];
this.learn_condition = {
    max_mp: 300,
    skill: {
        force: 300
    }
};

this.query_enable_prop = function (lv) {
    return {
        force: {
            gj: parseInt(lv * 1.3) + 10,
            mz: parseInt(lv * 1.2) + 10,
            limit_mp: lv * 100,
            desc: "唯一：将你内力的60%转化为气血"
        }
    };
}
this.pfm = {
    xi:
    {
        name: "紫气东来",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {

            var gj = 10 + parseInt(lv / 100);
            var time = 20000 + lv * 10;
            var mz = lv + 30;
            me.send_room("<mag>$N微一凝神，运起紫霞神功，周身紫气萦绕。</mag>", target);
            me.add_status({
                id: "force",
                name: "紫气东来",
                desc: "使用紫霞神功提升战力，增加你的伤害",
                duration: time,
                prop: {
                    add_sh_per: gj,
                    mz: mz
                },
                finish_msg: "$N的紫霞神功运行完毕，将内力收回丹田。",
            });

        },
        query_desc: function (me, lv) {
            var gj = 10 + parseInt(lv / 100);
            var mz = lv + 30;
            var time = 20000 + lv * 10;
            return "使用紫霞神功提升战力，增加你的伤害" + gj + "%，命中增加" + mz + "，持续" + (time / 1000) + "秒";
        }
    }
};
}
