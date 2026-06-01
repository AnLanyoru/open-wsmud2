import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends SKILL {
    name = "小无相功";
    id = "xiaowuxianggong";
    family = FAMILIES.XIAOYAO;
    grade = 4;
    attack_actions = [
    "$N挥拳攻击$n的$l", "$N往$n的$l一抓", "$N往$n的$l狠狠地踢了一脚",
    "$N提起拳头往$n的$l捶去", "$N对准$n的$l用力挥出一拳"
];
    attack_actions2 = [
    "$N用$W往$n的$l刺去", "$N用$W往$n的$l砍去", "$N挥动$W,斩向$n的$l"
];
    desc = "逍遥派的一门奇特武功，其主要特点是不着形相，无迹可寻，可以模仿别人的绝学";
    can_enables = ["unarmed", "sword"];
    learn_condition = {
    max_mp: 1000,
    skill: {
        unarmed: 300,
        parry: 300
    }
};
    pfm = {
    duo:
    {
        name: "无相",
        distime: 20000,
        mp: 40,
        no_copy: true,
        allow_busy: true,
        release_time: 3000,
        query_releasetime: function (me, lv) {
            return this.release_time;
        },
        query_distime: function (me, lv) {
            return this.distime;
        },
        query_name: function (me, type) {
            if (!type) return this.name;
            return "无相" + ALLOW_TYPES[type];
        },
        use: function (me, target, lv, sk) {
            var prev = target.query_temp("used_pfm");
            if (!prev) return me.notify_fail("<cyn>" + target.name + "最近没有使用绝招，你无法模仿。</cyn>");
            var str = prev.split("/");
            var sp_skill = SKILL.get(str[0]);
            if (!sp_skill) {
                return me.notify_fail("没有这个技能。");
            }
            if (sp_skill.grade > 4)
                return me.notify_fail("对方使用的武功太高深，你无法模仿。");
            var pfm = sp_skill.get_pfm(str[1]);
            if (!pfm) {
                return me.notify_fail(sp_skill.name + "没有这个绝招。");
            }
            if (pfm.no_copy) return me.notify_fail("这个绝招不能模仿。");
            if (me.is_busy && !pfm.allow_busy) return me.notify_fail("你现在正手忙脚乱，无法模仿别人的技能。");
            //if (pfm.enable_skill && !me.skills["xiaowuxianggong"][pfm.enable_skill]) {
            //    return me.notify_fail("<cyn>你的小无相功需要装备为" + SKILL.get(pfm.enable_skill).name + "才可以使用【" + pfm.name + "】。</cyn>");
            //}
            var isEnable = false;
            if (pfm.enable_skill) {
                if (sk === pfm.enable_skill) {
                    isEnable = true;
                } else {

                    return me.notify_fail(this.query_name(me, sk) + "不能模仿" + pfm.name + "。");
                    // return me.notify_fail("<cyn>你的小无相功目前只可以模仿武器和拳脚技能。</cyn>");
                }
                // if (pfm.enable_skill === "force" ||
                //     pfm.enable_skill === "parry" || pfm.enable_skill === "dodge") {
                //     return me.notify_fail("<cyn>你的小无相功目前只可以模仿武器和拳脚技能。</cyn>");
                // }
                // isEnable = me.skills["xiaowuxianggong"][pfm.enable_skill];
                // if (pfm.enable_skill === "unarmed" && !isEnable) {
                //     return me.notify_fail("<cyn>你的小无相功需要装备为拳脚技能才可以模仿拳脚。</cyn>");
                // }


            }
            var up = 80 + parseInt(lv / 40);
            if (up > 100) up = 100;
            me.use_pfm(target, pfm, parseInt(up * lv / 100));

            this.distime = pfm.query_distime?.(me, lv) ?? 0;
            this.release_time = pfm.query_releasetime?.(me, lv) ?? 0;

            if (sp_skill.grade <= 4 && isEnable && !me.is_in("yz/leitai/leitai") &&
                sp_skill.family !== FAMILIES.MONSTER) {
                me.notify("\n<hic>你学会了绝招【" + pfm.name + "】，可以使用【无我】释放。<hic>");
                me.remove_temp('copy_pfm');
                me.set_temp("copy_pfm_" + pfm.enable_skill, prev);
            }
        },
        query_desc: function (me, lv) {
            lv = 80 + parseInt(lv / 40);
            if (lv > 100) lv = 100;
            return "使用前一个攻击你的绝招攻击敌人，效果是你小无相功等级的" + lv + "%，如果你的小无相品阶不低于对方技能的品阶并且装备的基础武功相同，你将学会这个绝招";
        }
    }
    ,
    wuwo:
    {
        name: "无我",
        distime: 20000,
        mp: 40,
        allow_busy: true,
        no_copy: true,
        release_time: 3000,
        query_releasetime: function (me, lv) {
            return this.release_time;
        },
        query_distime: function (me, lv) {
            return this.distime;
        },
        query_name: function (me, type) {
            if (!type) return this.name;
            return "无我" + ALLOW_TYPES[type];
        },
        use: function (me, target, lv, sk) {
            var prev = me.query_temp("copy_pfm_" + sk);
            var baseSkill = SKILL.get(sk);
            if (!baseSkill) return false;
            if (!prev) {
                return me.notify_fail("<cyn>你最近没有模仿并学会任何绝招，无法使用装备为【" + baseSkill.name + "】的无我。</cyn>");
            }
            var str = prev.split("/");
            var sp_skill = SKILL.get(str[0]);
            if (!sp_skill) {
                return me.notify_fail("没有这个技能。");
            }
            if (sp_skill.family === FAMILIES.MONSTER) return me.notify_fail("怪物专属技能无法模仿。");
            if (sp_skill.grade > 4) return me.notify_fail("对方使用的武功太高深，你无法模仿。");
            var pfm = sp_skill.get_pfm(str[1]);
            if (!pfm) {
                return me.notify_fail(sp_skill.name + "没有这个绝招。");
            }
            if (pfm.no_copy) return me.notify_fail("这个绝招不能模仿。");

            if (me.is_busy && !pfm.allow_busy) return me.notify_fail("你现在正手忙脚乱，无法模仿别人的技能。");
            if (sk == "sword" && me.query_weapon_type() != WEAPON_TYPE.SWORD) {
                return me.notify("你使用的武器不对。");
            } else if (sk == "blade" && me.query_weapon_type() != WEAPON_TYPE.BLADE) {
                return me.notify("你使用的武器不对。");
            }
            if (pfm.enable_skill == sk && !me.skills["xiaowuxianggong"][sk]) {
                return me.notify_fail("<cyn>你的小无相功需要装备为" + baseSkill.name + "才可以使用【" + pfm.name + "】。</cyn>");
            }
            var up = 70 + parseInt(lv / 100);
            if (up > 100) up = 100;
            me.use_pfm(target, pfm, parseInt(up * lv / 100));
            this.distime = pfm.query_distime?.(me, lv) ?? 0;
            this.release_time = pfm.query_releasetime?.(me, lv) ?? 0;
        },
        query_desc: function (me, lv) {
            lv = 70 + parseInt(lv / 100);
            if (lv > 100) lv = 100;
            return "使用你无相模仿并学会的绝招，效果是你小无相功等级的" + lv + "%，绝招需要和你的小无相装备的基本技能一样";
        }
    }
};

    query_attack_action(me, target) {
    let type = me.query_weapon_type();
    if (type === WEAPON_TYPE.NONE)
        return this.attack_actions.random();
    return this.attack_actions2.random();
}
    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.4) + 20,
            mz: parseInt(lv * 1.2) + 20
        },
        sword: {
            gj: parseInt(lv * 1.4) + 20,
            mz: parseInt(lv * 1.2) + 20
        }
        // ,
        // blade: {
        //     gj: parseInt(lv * 1.4) + 20,
        //     mz: parseInt(lv * 1.2) + 20
        // }
    };
}
}

const ALLOW_TYPES = {
    sword: "(剑法)",
    unarmed: "(拳脚)"
};
const ALLOW_RECORD = {
    sword: true,
    unarmed: true
};
