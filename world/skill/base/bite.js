this.inherits(SKILL);
this.type = SKILL_TYPES.BASE;
this.id = "bite";
this.name = "野兽扑咬";
this.grade = 0;
this.desc = "动物类技能";
this.family = FAMILIES.MONSTER;
this.attack_actions = [
    "$N张嘴朝$n的$l咬去", "$N抬起前爪往$n的$l一抓", "$N往$n的$l狠狠的扑了过去",
    "$N跳起来用前抓往$n的$l抓去", "$N猛的扑向$n的$l"
];
this.query_prop = lv => ({ gj: parseInt(lv / 5), mz: parseInt(lv / 5) });
this.set_default(this.id);