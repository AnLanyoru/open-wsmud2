import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES; const WEAPON_TYPE = globalThis.WEAPON_TYPE;
this.inherits(SKILL);
this.name = "武当长拳";
this.id = "wudangchangquan";
this.grade = 1;

this.family = FAMILIES.WUDANG;
this.attack_actions = [
    "$N力灌右臂，一招「七星手」，一拳直出打向$n的$l",
    "$N身行前探，闪身跨奔$n身侧，一招「推手」，向$n的$l推去",
    "$N双臂微曲，身行晃动，一招「一条鞭」守中带攻打向$n的$l",
    "$N马步扎稳，左手虚晃，右手握拳一式「直击」迅猛打向$n的胸口",
    "$N施出「雁回头」，纵身跃向空中，双手同时击向$n的$l",
    "$N双臂回环，身行微微后仰，一招「井栏」，缠向$n的双手"
];
this.desc = "武当派入门拳脚功夫";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed"];
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv  + 7
        }
    };
}
this.learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};
this.pfm = {
    bao:
    {
        name: "虎抱头",
        distime: 16000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 10,
        release_time: 0,
        use: function (me, target, lv) {
            var sh = me.do_attack({
                target: target,
                attack_msg: "<hic>$N身行前探，双手抱环向$n推去</hic>",
                damage_msg:"<hir>$n一时大意，被$P内劲牵引，不由得一个趔趄。</hir>"
            });
            if (sh) {
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    name: "忙乱",
                    desc: "你处于忙乱状态，无法攻击，招架",
                    duration: 3000 + lv * 4,
                    downside:true

                },me);
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var lv = 3000 + lv * 4;
            return "命中敌人后，使敌人忙乱"+(lv/1000)+"秒，无法攻击，招架";
        }
    }
};
}
