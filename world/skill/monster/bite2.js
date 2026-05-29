import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    type = SKILL_TYPES.SKILL;
    id = "bite2";
    name = "野兽扑咬";
    grade = 3;
    family = FAMILIES.MONSTER;
    desc = "高级动物类技能";
    attack_actions = [
    "$N张嘴朝$n的$l咬去", "$N抬起前爪往$n的$l一抓", "$N往$n的$l狠狠的扑了过去",
    "$N跳起来用前抓往$n的$l抓去", "$N猛的扑向$n的$l"
];
    query_prop = lv => ({ gj: lv * 2, mz: lv * 2, fy: lv * 2, zj: lv * 2, ds: lv * 2 });
    can_enables = ["bite"];
    pfm = {
    puyao:
    {
        name: "撕咬",
        distime: 7000,
        enable_skill: "bite",
        weapon_type: WEAPON_TYPE.UNARMED,
        release_time: 3000,
        mp: 10,
        attacks: [
            "<hir>$N张嘴朝$n的$l咬去</hir>", "<hir>$N抬起前爪往$n的$l一抓</hir>", "<hir>$N往$n的$l狠狠的扑了过去</hir>",
            "<hir>$N跳起来用前抓往$n的$l抓去</hir>", "<hir>$N猛的扑向$n的$l</hir>"
        ],
        use: function (me, target,lv) {
            var count = 5;
            me.send_room("<red>$N目露凶光，猛的朝$n扑了过去</red>", target);
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz * 2,
                    attack_msg: this.attacks[i]
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me,lv) {
            return "野兽类撕咬";
        }
    }
};
}

const FAMILIES = globalThis.FAMILIES;
const SKILL_TYPES = globalThis.SKILL_TYPES;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
