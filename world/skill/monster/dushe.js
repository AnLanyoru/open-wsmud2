this.inherits(SKILL);
this.name = "毒蛇攻击";
this.id = "dushegongji";
this.grade = 1;

this.family = FAMILIES.MONSTER;
this.attack_actions = [
    "$N张嘴朝$n的$l咬去", "$N往$n的$l狠狠的扑了过去",
    "$N猛的扑向$n的$l", "$N扑上来张嘴往$n的$l咬去"
];
this.desc = "毒蛇攻击方式，会中毒";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["bite"];
this.query_enable_prop = function (lv) {
    return {
        bite: {
            gj: lv,
            mz: lv,
            ds: lv,
            desc: "你的攻击有可能让对方中毒"
        }
    };
}
this.on_attack_over = function (me, target, par) {
    if (!par.is_dodge && !par.is_parry) {
        var lv = me.query_skill("dushegongji", 0);
        var sh = parseInt((lv / 10) + 10);
        if (this.random(lv) > 100) {
            target.add_status({
                id: "shedu",
                name: "蛇毒",
                desc: "你中了蛇毒，每三秒减少" + sh + "气血",
                duration: 3000,
                duration_count: 4,
                on_interval: function (me, count) {
                    me.from_attack(sh * count, 999999, null, "<hir>$N觉得被蛇咬中的地方一阵发麻。</hir>");
                },
                downside: true,
                override: 1
            });
        }
    }

}